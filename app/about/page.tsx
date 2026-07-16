import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 md:px-8 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-background/80">
            About Us
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Move Different
          </h1>
          <p className="text-lg md:text-xl text-background/85 leading-relaxed max-w-3xl mx-auto">
            The Impetus is where culture meets commerce. We curate the finest sneakers and streetwear for those who refuse to blend in.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Founded with a simple mission: to bring authentic, premium sneakers and streetwear to Nigeria's most discerning collectors and fashion enthusiasts.
              </p>
              <p>
                We started The Impetus because we saw a gap in the market—a need for genuine, curated pieces that speak to individual style rather than mass trends. Every product in our catalog is carefully selected for its quality, authenticity, and cultural significance.
              </p>
              <p>
                From the latest drops to timeless classics, we're building a community of people who understand that what you wear is more than fashion—it's identity, it's culture, it's impetus.
              </p>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Authenticity</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Every item we sell is 100% authentic. We work directly with verified suppliers and authorized retailers to ensure you get the real deal, every time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Quality</h3>
                <p className="text-foreground/80 leading-relaxed">
                  We don't compromise on quality. From the sneakers we stock to the packaging we use, excellence is our standard.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
                <p className="text-foreground/80 leading-relaxed">
                  We're building more than a store—we're creating a space where sneakerheads and style enthusiasts can connect, share, and thrive.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Culture</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Sneakers are culture. We celebrate the stories, the history, and the movements that make each pair meaningful beyond the material.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
              Why Choose Us
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-foreground font-bold mt-1">✓</span>
                  <span><strong>100% Authentic Products:</strong> Verified authenticity on every item</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground font-bold mt-1">✓</span>
                  <span><strong>Curated Selection:</strong> Only the best sneakers and streetwear make it to our catalog</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground font-bold mt-1">✓</span>
                  <span><strong>Fast & Secure Shipping:</strong> Quick delivery across Nigeria with secure packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground font-bold mt-1">✓</span>
                  <span><strong>Customer First:</strong> Responsive support and hassle-free returns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground font-bold mt-1">✓</span>
                  <span><strong>Competitive Pricing:</strong> Premium quality at fair prices</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
              Get In Touch
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Have questions? Want to collaborate? Or just want to talk sneakers? We'd love to hear from you.
            </p>
            <div className="space-y-3 text-foreground/80">
              <p>
                <strong>Email:</strong> support@theimpetus.com
              </p>
              <p>
                <strong>Phone:</strong> +234 XXX XXX XXXX
              </p>
              <p>
                <strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM WAT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-foreground/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-6">
            Ready to Move Different?
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Explore our curated collection of premium sneakers and streetwear.
          </p>
          <Link 
            href="/#shop" 
            className="inline-flex min-h-12 items-center justify-center bg-foreground text-background px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-foreground/90 active:scale-[0.98]"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
