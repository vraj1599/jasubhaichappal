const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-primary mb-2">Shipping Policy</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-3xl font-semibold text-primary mb-4">Shipping Information</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We are committed to delivering your handcrafted chappals with care and efficiency.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Delivery Time</h3>
          <ul className="text-foreground/80 leading-relaxed space-y-2 mb-6">
            <li>Metro Cities: 3-5 business days</li>
            <li>Other Cities: 5-7 business days</li>
            <li>Remote Areas: 7-10 business days</li>
          </ul>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Shipping Charges</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We offer FREE shipping on all orders across India.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Order Tracking</h3>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Once your order is shipped, you will receive a tracking number via SMS and email to track your delivery.
          </p>

          <h3 className="font-serif text-2xl font-semibold text-primary mb-3 mt-8">Contact Us</h3>
          <p className="text-foreground/80 leading-relaxed">
            For any shipping-related queries, please contact us at info@jasubhaichappal.com or call +91 98765 43210.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
