import { fetchPage } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await fetchPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Hero / Header Section */}
            <div className="bg-white border-b border-gray-100 py-12 md:py-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                        Vimal Jewellers
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 capitalize text-gray-900 tracking-tight">
                        {page.title}
                    </h1>
                    <div className="w-24 h-1 bg-[#FADDA0] mx-auto rounded-full"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>

                {/* Optional: Simple Breadcrumb or Back Link */}
                <div className="mt-8 text-center">
                    <a href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        &larr; Back to Home
                    </a>
                </div>
            </div>
        </main>
    );
}
