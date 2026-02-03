'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Critical System Error
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Our servers encountered a critical issue. Please refresh the page.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-[#B88746] text-white rounded-full font-medium hover:bg-[#a6793b] transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </body>
        </html>
    );
}
