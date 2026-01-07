import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMethod, includeTax, discount, cashReceived } = await request.json();

    // Validate payment method
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
    if (!normalizedPaymentMethod) {
      return Response.json({ 
        error: `Invalid payment method. Valid methods are: ${VALID_PAYMENT_METHODS.join(", ")}` 
      }, { status: 400 });
    }

    // Get order to calculate final total
    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "DRAFT") {
      return Response.json({ error: "Order is not in DRAFT status" }, { status: 400 });
    }

    // Calculate final total based on discount and tax
    const subtotal = order.total;
    const finalSubtotal = Math.max(0, subtotal - (discount || 0));
    const taxAmount = includeTax ? Math.round(finalSubtotal * 0.1) : 0;
    const finalTotal = finalSubtotal + taxAmount;

    // For cash payments, validate that cash received is sufficient
    if (normalizedPaymentMethod === "cash" && cashReceived !== undefined) {
      if (typeof cashReceived !== 'number' || cashReceived < finalTotal) {
        return Response.json({ 
          error: `Insufficient cash received. Required: ${finalTotal}, Received: ${cashReceived}` 
        }, { status: 400 });
      }
    }

    // Update order status to PAID and set payment method
    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: {
        status: "PAID",
        payment_method: normalizedPaymentMethod,
        tax: taxAmount,
        discount: discount || 0,
        total: finalTotal,
        cash_received: normalizedPaymentMethod === "cash" ? cashReceived : null,
        paid_at: new Date(),
      },
      include: {
        items: true
      }
    });

    return Response.json({ 
      success: true, 
      data: updatedOrder,
      message: "Payment processed successfully" 
    });

  } catch (error) {
    console.error("Payment processing error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, paymentMethod } = await request.json();

    // If changing status to PAID, validate payment method
    if (status === "PAID" && paymentMethod) {
      const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
      if (!normalizedPaymentMethod) {
        return Response.json({ 
          error: `Invalid payment method. Valid methods are: ${VALID_PAYMENT_METHODS.join(", ")}` 
        }, { status: 400 });
      }

      // Update order with new status and payment method
      const updatedOrder = await db.order.update({
        where: { id: params.id },
        data: {
          status: "PAID",
          payment_method: normalizedPaymentMethod,
          paid_at: new Date(),
        },
        include: {
          items: true
        }
      });

      return Response.json({ 
        success: true, 
        data: updatedOrder,
        message: "Order status updated successfully" 
      });
    } else if (status) {
      // Update order status without payment method
      const updatedOrder = await db.order.update({
        where: { id: params.id },
        data: { status },
        include: {
          items: true
        }
      });

      return Response.json({ 
        success: true, 
        data: updatedOrder,
        message: "Order status updated successfully" 
      });
    } else {
      return Response.json({ error: "No status or payment method provided" }, { status: 400 });
    }

  } catch (error) {
    console.error("Order status update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}