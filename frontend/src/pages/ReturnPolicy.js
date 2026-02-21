const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">Return & Refund Policy</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-3xl font-semibold text-primary mb-4">Our Return Policy</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We want you to be completely satisfied with your purchase. If you're not happy with your order,
            we're here to help.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Return Eligibility</h3>
          <ul className="text-foreground/80 leading-relaxed space-y-2 mb-6">
            <li>Products can be returned within 7 days of delivery</li>
            <li>Items must be unused and in original packaging</li>
            <li>Products should not be damaged or altered</li>
            <li>Return shipping will be arranged by us</li>
          </ul>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Refund Process</h3>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Once we receive your returned item, we will inspect it and process your refund within 5-7 business days.
            The refund will be credited to your original payment method.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Exchange Policy</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            If you would like to exchange your product for a different size or color, please contact our customer
            support team. We will arrange the exchange at no additional cost.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">How to Initiate a Return</h3>
          <p className="text-foreground/80 leading-relaxed mb-2">
            To initiate a return, please contact us:
          </p>
          <ul className="text-foreground/80 leading-relaxed space-y-2">
            <li>Email: info@jasubhaichappal.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>WhatsApp: +91 98765 43210</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
