const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">Privacy Policy</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground/80 leading-relaxed mb-6">
            At Jasubhai Chappal, we respect your privacy and are committed to protecting your personal information.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Information We Collect</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="text-foreground/80 leading-relaxed space-y-2 mb-6">
            <li>Name, email address, and phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information</li>
            <li>Order history and preferences</li>
          </ul>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">How We Use Your Information</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="text-foreground/80 leading-relaxed space-y-2 mb-6">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your comments and questions</li>
            <li>Improve our products and services</li>
          </ul>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Data Security</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We implement appropriate security measures to protect your personal information from unauthorized access,
            alteration, or disclosure.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Contact Us</h3>
          <p className="text-foreground/80 leading-relaxed">
            If you have any questions about our Privacy Policy, please contact us at info@jasubhaichappal.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
