export function SkeletonCard() {
  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-square bg-foreground/5 animate-pulse" />
      <div className="flex flex-1 flex-col px-1 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-foreground/10 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-foreground/10 rounded animate-pulse w-1/3" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex gap-1.5">
            <div className="h-7 w-8 bg-foreground/10 rounded animate-pulse" />
            <div className="h-7 w-8 bg-foreground/10 rounded animate-pulse" />
            <div className="h-7 w-8 bg-foreground/10 rounded animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
