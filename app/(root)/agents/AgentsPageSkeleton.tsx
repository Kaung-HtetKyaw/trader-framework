const AgentsPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white border border-border-100 rounded-lg p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-text-200 animate-pulse" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 w-32 bg-text-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-text-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-text-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-text-200 rounded animate-pulse" />
          </div>
          <div className="h-3 w-40 bg-text-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default AgentsPageSkeleton;
