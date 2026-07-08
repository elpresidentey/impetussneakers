export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square rounded-2xl bg-foreground/5 border border-foreground/10 animate-pulse" />
      <div className="space-y-3">
        <div className="h-6 bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 bg-foreground/5 rounded w-3/4 animate-pulse" />
        <div className="flex gap-2 mt-2">
          <div className="h-4 w-4 rounded-full bg-foreground/10 animate-pulse" />
          <div className="h-4 w-4 rounded-full bg-foreground/10 animate-pulse" />
          <div className="h-4 w-4 rounded-full bg-foreground/10 animate-pulse" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-12 bg-foreground/10 rounded animate-pulse" />
          <div className="h-6 w-12 bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex items-end justify-between pt-3 border-t border-foreground/10">
        <div className="space-y-2">
          <div className="h-6 bg-foreground/10 rounded w-24 animate-pulse" />
          <div className="h-4 bg-foreground/5 rounded w-16 animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-foreground/10 rounded animate-pulse" />
      </div>
    </div>
  )
}
