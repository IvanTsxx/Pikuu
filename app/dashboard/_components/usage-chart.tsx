import type { UsageLog } from "@/app/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../../../components/ui/badge";

interface UsageChartProps {
  logs: UsageLog[];
}

export function UsageChart({ logs }: UsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-36">
          <div className="space-y-4">
            {logs.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No hay uso registrado.
              </p>
            )}
            {logs.map((log) => {
              // Parsear pq viene como JSON
              const tools = JSON.stringify(log.toolsExecuted);

              // Quitar las comillas, los espacios y los corchetes
              const toolsList: string[] = tools
                .replace(/"/g, "")
                .replace(/\s/g, "")
                .replace(/\[|\]/g, "")
                .split(",")
                .filter((tool) => tool !== "");

              return (
                <div
                  key={log.id}
                  className="flex flex-col gap-4 rounded border border-primary p-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm capitalize">
                        {log.operationType.replace("_", " ")}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-bold text-red-500 text-sm">
                      -{log.creditsCharged} créditos
                    </div>
                  </div>
                  {/* Listado de tools usadas */}
                  {toolsList && toolsList.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">Tools ejecutados:</h3>
                      <ul className="list-disc space-y-2 pl-6">
                        {toolsList.map((tool, index) => (
                          <li key={index}>
                            <Badge variant="outline">{tool}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
