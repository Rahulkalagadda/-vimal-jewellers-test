import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function PriceRow({
  label,
  amount,
  original,
  isTotal = false,
}: {
  label: string
  amount: string
  original?: string
  isTotal?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-2 items-center px-6 py-4 ${isTotal ? "font-semibold" : "text-sm"} border-b last:border-b-0`}
    >
      <div>{label}</div>
      <div className="ml-auto flex items-center gap-3">
        {original ? <span className="text-muted-foreground line-through">{original}</span> : null}
        <span className={isTotal ? "text-base" : ""}>{amount}</span>
      </div>
    </div>
  )
}

export function PriceBreakupAccordion({
  rows,
  grandTotal,
  grandCaption,
}: {
  rows: { label: string; amount: string; original?: string }[]
  grandTotal: string
  grandCaption?: string
}) {
  return (
    <Accordion type="single" collapsible defaultValue="price" className="space-y-4">
      <AccordionItem value="price" className="rounded-lg border">
        <AccordionTrigger className="rounded-lg bg-muted/40 px-6 py-3 text-left text-sm">
          PRICE BREAKUP
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <div className="divide-y">
            {rows.map((r) => (
              <PriceRow key={r.label} {...r} />
            ))}
            <div className="px-6 py-5">
              <div className="rounded-lg border">
                <PriceRow label="Grand Total" amount={grandTotal} isTotal />
              </div>
              {grandCaption ? <p className="mt-2 text-right text-xs text-muted-foreground">{grandCaption}</p> : null}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="metal" className="rounded-lg border">
        <AccordionTrigger className="rounded-lg bg-muted/40 px-6 py-3 text-left text-sm">
          METAL DETAILS
        </AccordionTrigger>
        <AccordionContent className="p-6 text-sm text-muted-foreground">
          Metal karat, color, and weight details can be shown here.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="diamond" className="rounded-lg border">
        <AccordionTrigger className="rounded-lg bg-muted/40 px-6 py-3 text-left text-sm">
          DIAMOND DETAILS
        </AccordionTrigger>
        <AccordionContent className="p-6 text-sm text-muted-foreground">
          Diamond quality, clarity, and carat information goes here.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="other" className="rounded-lg border">
        <AccordionTrigger className="rounded-lg bg-muted/40 px-6 py-3 text-left text-sm">
          OTHER MATERIAL DETAILS
        </AccordionTrigger>
        <AccordionContent className="p-6 text-sm text-muted-foreground">
          Any additional materials or embellishments can be listed here.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}