import { SectionHeader } from "@/components/section-header"
import { ProductSummaryCard } from "@/components/product-summary-card"
import { HelpCard } from "@/components/help-card"
import { PriceBreakupAccordion } from "@/components/price-breakup-accordion"

export default function ProductInfoPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <SectionHeader title="Product Information" underlineClassName="bg-teal-500" />

      <div className="mt-10 grid gap-8 md:grid-cols-[320px,1fr]">
        <div className="space-y-6">
          <ProductSummaryCard
            data={{
              "Style No.": "KC06830RG",
              Width: "1.645 cm (16.45 mm)",
              Height: "1.64 cm (16.4 mm)",
              "Mangalsutra Length": "17.25 inches (43.82 cm)",
              "Metal Weight": "4.44g",
              "Gross Weight": "4.59g",
            }}
            note={
              <>
                <p>Mangalsutra comes with 17.25&quot; inches (43.82 cm) chain.</p>
                <p className="mt-2">Difference in gold weight may occur &amp; will apply on final price.</p>
              </>
            }
          />
          <HelpCard />
        </div>

        <div>
          <PriceBreakupAccordion
            rows={[
              { label: "Metal", amount: "₹35,644" },
              {
                label: "Diamond",
                amount: "₹29,447",
                original: "₹39,263",
              },
              {
                label: "Making Charges",
                amount: "₹9,324",
                original: "₹12,432",
              },
              { label: "GST(3%)", amount: "₹2,232", original: "₹2,620" },
            ]}
            grandTotal="₹76,647"
            grandCaption="(MRP Incl. of all taxes)"
          />

          <p className="mt-6 text-sm text-muted-foreground">
            *A differential amount will be applicable with difference in weight if any.
          </p>
        </div>
      </div>
    </main>
  )
}
