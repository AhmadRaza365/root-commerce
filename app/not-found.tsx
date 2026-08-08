import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-primary">
      <Image
        src="/images/not-found-image.svg"
        alt="404 Not Found"
        width={100}
        height={100}
        className="mb-4"
        priority
      />
      <h1 className="text-2xl lg:text-4xl font-bold text-error">Page Not Found</h1>
      <p className="text-gray-600">Could not find the requested resource.</p>
      <Link href="/" className="mt-4 btn btn-primary btn-soft">
        Go back to Home
      </Link>
    </div>
  );
}
