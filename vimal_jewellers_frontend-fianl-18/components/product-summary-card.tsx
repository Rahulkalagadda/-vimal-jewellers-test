import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SummaryData = Record<string, string>

export function ProductSummaryCard({
  data,
  note,
}: {
  data: SummaryData
  note?: React.ReactNode
}) {
  const entries = Object.entries(data)
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Product Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="rounded-lg border">
          {entries.map(([k, v], idx) => (
            <div
              key={k}
              className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${idx < entries.length - 1 ? "border-b" : ""}`}
            >
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}

          {note ? <div className="bg-muted/40 px-4 py-4 text-sm text-muted-foreground">{note}</div> : null}
        </dl>
      </CardContent>
    </Card>
  )
}