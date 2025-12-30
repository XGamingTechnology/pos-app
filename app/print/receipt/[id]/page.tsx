// app/print/receipt/[id]/page.tsx
import ReceiptPrint from "./ReceiptPrint";
import "./receipt.css";

export default function PrintReceiptPage({ params }: { params: { id: string } }) {
  // ❌ TIDAK PERLU requirePermission — struk harus publik!
  return <ReceiptPrint orderId={params.id} />;
}
