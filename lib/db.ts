// Mock database client for development
// In a real application, this would be replaced with Prisma or another ORM

interface Order {
  id: string;
  customer_name: string;
  table_number: string;
  status: string;
  total: number;
  tax?: number;
  discount?: number;
  payment_method?: string;
  cash_received?: number | null;
  paid_at?: Date | null;
  created_at: Date;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
}

interface OrderWhere {
  id?: string;
  status?: string;
}

interface OrderCreateData {
  data: {
    customer_name: string;
    table_number: string;
    status: string;
    total: number;
    tax?: number;
    discount?: number;
    payment_method?: string;
    cash_received?: number | null;
    paid_at?: Date;
    items: {
      create: Array<{
        product_name: string;
        qty: number;
        price: number;
        subtotal: number;
      }>;
    };
  };
  include: {
    items: boolean;
  };
}

interface OrderUpdateData {
  where: {
    id: string;
  };
  data: Partial<Order>;
  include: {
    items: boolean;
  };
}

interface OrderFindManyArgs {
  include: {
    items: boolean;
  };
  orderBy?: {
    created_at: 'asc' | 'desc';
  };
}

class MockOrderModel {
  async findUnique(where: { where: OrderWhere; include: { items: boolean } }): Promise<Order | null> {
    // Mock implementation
    return null;
  }

  async findMany(args: OrderFindManyArgs): Promise<Order[]> {
    // Mock implementation
    return [];
  }

  async create(data: OrderCreateData): Promise<Order> {
    // Mock implementation
    const newOrder: Order = {
      id: Math.random().toString(36).substring(7),
      customer_name: data.data.customer_name,
      table_number: data.data.table_number,
      status: data.data.status,
      total: data.data.total,
      items: data.data.items.create.map((item, index) => ({
        id: `item-${index}`,
        product_name: item.product_name,
        qty: item.qty,
        price: item.price,
        subtotal: item.subtotal
      })),
      created_at: new Date()
    };
    return newOrder;
  }

  async update(data: OrderUpdateData): Promise<Order> {
    // Mock implementation
    return {
      id: data.where.id,
      customer_name: "Mock Customer",
      table_number: "Mock Table",
      status: data.data.status || "DRAFT",
      total: data.data.total || 0,
      items: [],
      created_at: new Date()
    };
  }
}

class MockDBClient {
  order = new MockOrderModel();
}

export const db = new MockDBClient();