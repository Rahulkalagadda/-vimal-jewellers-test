import { fetchProductBySlug } from "@/lib/api";
import ProductDetailClient from "@/components/product-detail-client";
import type { Metadata } from "next";

type Props = {
  params: { slug: string }
};

// Ensure params are awaited before accessing properties
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const awaitedParams = await params;
  if (!awaitedParams || !awaitedParams.slug) {
    throw new Error("Invalid slug provided");
  }
  const { slug } = awaitedParams;
  const product = await fetchProductBySlug(slug);
  return {
    title: product?.name || "Product Not Found",
    description: product?.description || "No product description available.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  try {
    const awaitedParams = await params;
    if (!awaitedParams || !awaitedParams.slug) {
      throw new Error('Product slug is required');
    }

    const { slug } = awaitedParams;
    const product = await fetchProductBySlug(slug);

    if (!product) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mt-2 text-gray-600">
              Sorry, we couldn't find the product you're looking for.
              The product might have been removed or the URL might be incorrect.
            </p>
            <div className="mt-4">
              <a
                href="/category/all"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Browse All Products
              </a>
            </div>
          </div>
        </div>
      );
    }

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error('Error in ProductDetailPage:', error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-gray-600">
            We encountered an error while loading the product.
            Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
