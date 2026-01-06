import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Define valid payment methods
const VALID_PAYMENT_METHODS = ["cash", "debit", "credit", "qris", "transfer"] as const;

/**
 * Normalizes payment method by converting to lowercase and validating against valid methods
 * @param paymentMethod The payment method to normalize
 * @returns Normalized payment method or null if invalid
 */
function normalizePaymentMethod(paymentMethod: string): string | null {
  const normalized = paymentMethod.toLowerCase().trim();
  
  if (VALID_PAYMENT_METHODS.includes(normalized as any)) {
    return normalized;
  }
  
  return null;
}

/**
 * Normalizes order data for consistent format
 * @param order The order data from database
 * @returns Normalized order data
 */
function normalizeOrder(order: any) {
  return {
    ...order,
    payment_method: order.payment_method ? normalizePaymentMethod(order.payment_method) : null,
    created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
    paid_at: order.paid_at ? new Date(order.paid_at).toISOString() : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all orders
    const orders = await db.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const normalizedOrders = orders.map(normalizeOrder);

    return Response.json({ 
      success: true, 
      data: normalizedOrders 
    });

  } catch (error) {
    console.error("Get orders error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customer_name, table_number, items } = await request.json();

    // Create new order
    const newOrder = await db.order.create({
      data: {
        customer_name: customer_name || "Customer Umum",
        table_number: table_number || "",
        status: "DRAFT",
        total: 0, // Will be calculated from items
        items: {
          create: items.map((item: any) => ({
            product_name: item.product_name,
            qty: item.qty,
            price: item.price,
            subtotal: item.qty * item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Recalculate total after creating items
    const total = newOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
    const updatedOrder = await db.order.update({
      where: { id: newOrder.id },
      data: { total },
      include: {
        items: true
      }
    });

    return Response.json({ 
      success: true, 
      data: normalizeOrder(updatedOrder),
      message: "Order created successfully" 
    });

  } catch (error) {
    console.error("Create order error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}