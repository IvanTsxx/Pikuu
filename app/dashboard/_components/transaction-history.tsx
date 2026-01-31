import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No hay transacciones recientes
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {format(new Date(tx.createdAt), "dd MMM yyyy HH:mm", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{tx.description || "-"}</TableCell>
                <TableCell className="capitalize">{tx.type}</TableCell>
                <TableCell
                  className={`text-right ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
