export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-foreground/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing and using The Impetus website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on The Impetus website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software on The Impetus website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Product Information</h2>
            <p className="text-foreground/80 leading-relaxed">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Pricing and Payment</h2>
            <p className="text-foreground/80 leading-relaxed">
              All prices are listed in Nigerian Naira (₦) and are subject to change without notice. Payment must be made in full before products are dispatched. We accept payments through Paystack and other specified payment methods. You agree to provide current, complete, and accurate purchase and account information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Order Acceptance</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product or pricing information, or suspected fraudulent activity. If your order is cancelled after payment has been processed, we will issue a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. User Account</h2>
            <p className="text-foreground/80 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
            <p className="text-foreground/80 leading-relaxed">
              All content on The Impetus website, including text, graphics, logos, images, and software, is the property of The Impetus or its content suppliers and is protected by international copyright laws. Unauthorized use of any content may violate copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed">
              The Impetus shall not be liable for any damages arising out of or related to your use of, or inability to use, this website or products purchased through it. This includes, but is not limited to, direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Governing Law</h2>
            <p className="text-foreground/80 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Nigeria. Any disputes arising from these terms or your use of this website shall be subject to the exclusive jurisdiction of the courts of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
            <p className="text-foreground/80 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Email: support@theimpetus.com<br />
              Website: theimpetus.com
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
