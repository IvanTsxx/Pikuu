import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CreditUsageTable() {
  const usageData = [
    { action: "Proyecto completo nuevo", cost: "10 créditos", usd: "$1.00" },
    { action: "Agregar modelo", cost: "3 créditos", usd: "$0.30" },
    { action: "Modificar form/validation", cost: "2 créditos", usd: "$0.20" },
    { action: "Iterar/ajustar", cost: "1 crédito", usd: "$0.10" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Acción</TableHead>
            <TableHead>Costo en Créditos</TableHead>
            <TableHead>Valor Aprox. (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usageData.map((item) => (
            <TableRow key={item.action}>
              <TableCell className="font-medium">{item.action}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>{item.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
