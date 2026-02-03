import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
            <h1 className="text-9xl font-bold text-[#FADDA0]/50">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>
            <Link href="/">
                <Button className="bg-[#B88746] hover:bg-[#a6793b] text-white rounded-full px-8">
                    Return Home
                </Button>
            </Link>
        </div>
    );
}
