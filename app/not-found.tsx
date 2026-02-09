import Link from "@/components/ui/general/link";

export default function GeneralNotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-accent space-y-2">
      <h1 className="text-4xl font-bold">
        404 - Ooops! The Resource You Are Looking For Is Not Found
      </h1>
      <p className="mt-2">The page you are looking for does not exist.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
}
