export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
          Returns & Refunds
        </h1>
        <p className="text-sm text-foreground/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Return Period</h2>
            <p className="text-foreground/80 leading-relaxed">
              We accept returns within <strong>14 days</strong> of delivery. To be eligible for a return, items must be unused, unworn, and in their original packaging with all tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Return Conditions</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Items must meet the following conditions to be eligible for return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Unworn and unused condition</li>
              <li>Original tags and labels attached</li>
              <li>Original packaging intact</li>
              <li>Proof of purchase (order number or receipt)</li>
              <li>No signs of wear, damage, or alterations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Non-Returnable Items</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Items marked as "Final Sale"</li>
              <li>Customized or personalized products</li>
              <li>Items without original tags or packaging</li>
              <li>Worn or damaged items</li>
              <li>Hygiene-sensitive products (socks, underwear)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. How to Initiate a Return</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              To start a return:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-foreground/80">
              <li>Contact our customer support team at returns@theimpetus.com within 14 days of delivery</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive a Return Authorization (RA) number and instructions</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Include the RA number on the package</li>
              <li>Ship the item to the provided return address</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Return Shipping</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>Return Shipping Costs:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Defective/Wrong Item:</strong> We cover return shipping costs</li>
              <li><strong>Change of Mind:</strong> Customer is responsible for return shipping costs</li>
              <li><strong>Free Returns:</strong> Available on select items (indicated on product page)</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              We recommend using a trackable shipping service and purchasing shipping insurance for returns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Refund Processing</h2>
            <p className="text-foreground/80 leading-relaxed">
              Once we receive and inspect your return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
              <li>We will notify you of the approval or rejection of your refund</li>
              <li>Approved refunds are processed within 5-7 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>Please allow 5-10 business days for the refund to appear in your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Exchanges</h2>
            <p className="text-foreground/80 leading-relaxed">
              We currently do not offer direct exchanges. If you need a different size or color:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80 mt-4">
              <li>Return the original item for a refund</li>
              <li>Place a new order for the desired item</li>
            </ol>
            <p className="text-foreground/80 leading-relaxed mt-4">
              This ensures you receive your preferred item quickly without waiting for return processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Defective or Damaged Items</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you receive a defective or damaged item:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide photos of the defect or damage</li>
              <li>We will arrange for a replacement or full refund</li>
              <li>We cover all return shipping costs for defective items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Wrong Item Received</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you receive the wrong item:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 mt-4">
              <li>Contact us immediately at support@theimpetus.com</li>
              <li>We will arrange for the correct item to be sent</li>
              <li>We cover all shipping costs for the return and replacement</li>
              <li>You may keep or return the wrong item as instructed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Late or Missing Refunds</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you haven't received your refund after 10 business days:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/80 mt-4">
              <li>Check your bank account again</li>
              <li>Contact your credit card company (processing may take time)</li>
              <li>Contact your bank</li>
              <li>If you've done all of this and still haven't received your refund, contact us at refunds@theimpetus.com</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              For returns and refund inquiries:
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Email: returns@theimpetus.com<br />
              Phone: +234 XXX XXX XXXX<br />
              Hours: Monday - Friday, 9:00 AM - 5:00 PM WAT
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/10">
          <a href="/" className="text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
