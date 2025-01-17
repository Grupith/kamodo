import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      {/* Card 1 */}
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border rounded-lg p-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Card 2 */}
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border rounded-lg p-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Card 3 */}
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border rounded-lg p-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Card 4 */}
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 border rounded-lg p-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
