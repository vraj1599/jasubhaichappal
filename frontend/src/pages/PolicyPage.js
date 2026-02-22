import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function PolicyPage() {
  const { type } = useParams();

  const policies = {
    shipping: {
      title: 'Shipping Policy',
      content: [
        { heading: 'Shipping Methods', text: 'We offer standard and express shipping options across India.' },
        { heading: 'Delivery Time', text: 'Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days.' },
        { heading: 'Shipping Charges', text: 'Free shipping on all orders above ₹999. For orders below ₹999, a nominal shipping charge of ₹99 applies.' },
        { heading: 'Order Tracking', text: 'Once your order is shipped, you will receive a tracking number via email and SMS.' },
      ],
    },
    returns: {
      title: 'Return & Refund Policy',
      content: [
        { heading: 'Return Period', text: 'You can return products within 7 days of delivery if you are not satisfied.' },
        { heading: 'Conditions', text: 'Products must be unused, in original packaging, and with all tags attached.' },
        { heading: 'Refund Process', text: 'Once we receive and inspect the returned item, refunds will be processed within 7-10 business days.' },
        { heading: 'Exchange', text: 'We offer size and color exchange subject to availability.' },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      content: [
        { heading: 'Information Collection', text: 'We collect personal information such as name, email, phone number, and shipping address for order processing.' },
        { heading: 'Use of Information', text: 'Your information is used solely for order fulfillment, customer service, and marketing communications (with your consent).' },
        { heading: 'Data Security', text: 'We implement industry-standard security measures to protect your personal information.' },
        { heading: 'Third-Party Sharing', text: 'We do not sell or share your personal information with third parties except for order fulfillment (shipping partners).' },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      content: [
        { heading: 'Use of Website', text: 'By accessing this website, you agree to these terms and conditions.' },
        { heading: 'Product Information', text: 'We strive to provide accurate product descriptions and images. Actual products may vary slightly.' },
        { heading: 'Pricing', text: 'All prices are in Indian Rupees (INR) and are subject to change without notice.' },
        { heading: 'Payment', text: 'We accept various payment methods including credit/debit cards, UPI, and cash on delivery.' },
        { heading: 'Liability', text: 'Jasubhai Chappal is not liable for any indirect or consequential damages arising from the use of our products.' },
      ],
    },
  };

  const policy = policies[type] || policies.shipping;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl text-primary font-bold mb-8" data-testid="policy-title">
            {policy.title}
          </h1>

          <div className="bg-white rounded-sm border border-border p-8 space-y-8">
            {policy.content.map((section, index) => (
              <div key={index} data-testid={`policy-section-${index}`}>
                <h2 className="font-heading text-2xl text-primary font-bold mb-3">{section.heading}</h2>
                <p className="font-body text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-muted-foreground">
              For any questions or concerns, please{' '}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
