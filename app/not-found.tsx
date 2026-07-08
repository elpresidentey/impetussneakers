import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter text-foreground mb-6">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center bg-foreground text-background px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-foreground/90 active:scale-[0.98]"
          >
            Back to Home
          </Link>
          <Link
            href="/#shop"
            className="inline-flex min-h-12 items-center justify-center border border-foreground px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background active:scale-[0.98]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
