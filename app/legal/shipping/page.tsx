import Link from 'next/link'

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
          Shipping Policy
        </h1>
        <p className="text-sm text-foreground/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Shipping Areas</h2>
            <p className="text-foreground/80 leading-relaxed">
              We currently ship to all states within Nigeria. International shipping is not available at this time but may be offered in the future.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Shipping Costs</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Shipping costs are calculated at checkout based on:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Delivery location (within Nigeria)</li>
              <li>Order weight and size</li>
              <li>Selected shipping method</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              <strong>Free Shipping:</strong> Orders over ₦50,000 qualify for free standard shipping within Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Processing Time</h2>
            <p className="text-foreground/80 leading-relaxed">
              Orders are processed within 1-2 business days (Monday to Friday, excluding public holidays). You will receive an order confirmation email once your order is received, and a shipping confirmation email with tracking information once your order has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Delivery Time</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Estimated delivery times from dispatch:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Lagos & Environs:</strong> 2-3 business days</li>
              <li><strong>Major Cities:</strong> 3-5 business days</li>
              <li><strong>Other Locations:</strong> 5-7 business days</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Please note that these are estimates and actual delivery times may vary due to factors beyond our control, such as weather conditions, customs delays, or courier issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Order Tracking</h2>
            <p className="text-foreground/80 leading-relaxed">
              Once your order ships, you will receive a tracking number via email. You can track your order status by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
              <li>Visiting your account dashboard</li>
              <li>Using the tracking number with our courier partner</li>
              <li>Contacting our customer support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Delivery Issues</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              If you experience any delivery issues:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Delayed Delivery:</strong> Contact us if your order hasn't arrived within the estimated timeframe</li>
              <li><strong>Failed Delivery:</strong> We will attempt to contact you for re-delivery</li>
              <li><strong>Damaged Package:</strong> Inspect your package upon delivery and report any damage immediately</li>
              <li><strong>Lost Package:</strong> Contact us within 7 days of expected delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Address Accuracy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Please ensure your shipping address is accurate and complete. We are not responsible for orders shipped to incorrect addresses provided by the customer. If you need to change your shipping address, contact us immediately after placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Multiple Items</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you order multiple items, they may ship separately depending on availability and location. You will receive separate tracking information for each shipment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Shipping Restrictions</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to refuse shipping to certain locations or addresses. We do not ship to P.O. boxes at this time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              For shipping inquiries, please contact us at:
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Email: shipping@theimpetus.com<br />
              Phone: +234 XXX XXX XXXX<br />
              Hours: Monday - Friday, 9:00 AM - 5:00 PM WAT
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/10">
          <Link href="/" className="text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
