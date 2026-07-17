import Link from 'next/link'

const values = [
  {
    title: 'Authenticity',
    body: 'Every item we sell is 100% authentic. We work with verified suppliers and authorized retailers so you get the real deal, every time.',
  },
  {
    title: 'Quality',
    body: "We don't compromise on quality. From the sneakers we stock to the packaging we use, excellence is our standard.",
  },
  {
    title: 'Community',
    body: "We're building more than a store — a space where sneakerheads and style enthusiasts can connect, share, and thrive.",
  },
  {
    title: 'Culture',
    body: 'Sneakers are culture. We celebrate the stories, history, and movements that make each pair meaningful beyond the material.',
  },
]

const reasons = [
  { label: '100% Authentic Products', detail: 'Verified authenticity on every item' },
  { label: 'Curated Selection', detail: 'Only the best sneakers and streetwear make the catalog' },
  { label: 'Fast & Secure Shipping', detail: 'Quick delivery across Nigeria with secure packaging' },
  { label: 'Customer First', detail: 'Responsive support and hassle-free returns' },
  { label: 'Competitive Pricing', detail: 'Premium quality at fair prices' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen page-shell text-foreground">
      {/* Hero — left-aligned editorial */}
      <section className="relative overflow-hidden surface-ink px-4 pb-16 pt-28 text-white md:px-8 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl text-left">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50">
              About Us
            </p>
            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-6xl lg:text-7xl">
              Move Different
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              The Impetus is where culture meets commerce. We curate the finest sneakers and streetwear for those who refuse to blend in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/#shop"
                className="inline-flex min-h-12 items-center justify-center bg-white px-8 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/90"
              >
                Shop the catalog
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad surface-paper">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div className="text-left">
              <p className="section-eyebrow">Our Story</p>
              <h2 className="section-title text-4xl md:text-5xl lg:text-6xl">
                Built for real wardrobes.
              </h2>
            </div>
            <div className="prose-body space-y-5 text-left text-foreground/70">
              <p className="text-base leading-relaxed md:text-lg">
                Founded with a simple mission: to bring authentic, premium sneakers and streetwear to Nigeria&apos;s most discerning collectors and fashion enthusiasts.
              </p>
              <p className="text-base leading-relaxed md:text-lg">
                We started The Impetus because we saw a gap in the market — a need for genuine, curated pieces that speak to individual style rather than mass trends. Every product in our catalog is carefully selected for quality, authenticity, and cultural significance.
              </p>
              <p className="text-base leading-relaxed md:text-lg">
                From the latest drops to timeless classics, we&apos;re building a community of people who understand that what you wear is more than fashion — it&apos;s identity, it&apos;s culture, it&apos;s impetus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad surface-warm border-y border-foreground/[0.06]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl text-left md:mb-14">
            <p className="section-eyebrow">Values</p>
            <h2 className="section-title text-4xl md:text-5xl">What We Stand For</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 md:grid-cols-2">
            {values.map((value) => (
              <article
                key={value.title}
                className="bg-[var(--surface-warm)] p-7 text-left transition-colors hover:bg-white md:p-9"
              >
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/65 md:text-base">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why us + contact */}
      <section className="section-pad surface-paper">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:gap-16">
          <div className="text-left">
            <p className="section-eyebrow">Why Us</p>
            <h2 className="section-title mb-8 text-4xl md:text-5xl">Why Choose Us</h2>
            <ul className="space-y-5">
              {reasons.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center border border-foreground/15 bg-foreground/[0.04] text-xs font-bold">
                    ✓
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground md:text-base">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground/60">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-foreground/[0.08] bg-white/60 p-7 text-left md:p-9">
            <p className="section-eyebrow">Contact</p>
            <h2 className="section-title mb-4 text-3xl md:text-4xl">Get In Touch</h2>
            <p className="mb-8 text-sm leading-relaxed text-foreground/65 md:text-base">
              Have questions? Want to collaborate? Or just want to talk sneakers? We&apos;d love to hear from you.
            </p>
            <dl className="space-y-4 text-sm md:text-base">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Email
                </dt>
                <dd className="mt-1 text-foreground">
                  <a href="mailto:support@theimpetus.com" className="hover:underline">
                    support@theimpetus.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Phone
                </dt>
                <dd className="mt-1 text-foreground">+234 XXX XXX XXXX</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Hours
                </dt>
                <dd className="mt-1 text-foreground">Monday – Friday, 9:00 AM – 5:00 PM WAT</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="surface-ink px-4 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl text-left">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
              Ready?
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              Ready to Move Different?
            </h2>
            <p className="mt-4 text-base text-white/65">
              Explore our curated collection of premium sneakers and streetwear.
            </p>
          </div>
          <Link
            href="/#shop"
            className="inline-flex min-h-12 shrink-0 items-center justify-center bg-white px-8 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/90"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
