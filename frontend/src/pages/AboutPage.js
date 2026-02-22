import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl text-primary font-bold mb-6 text-center" data-testid="about-title">
            About Jasubhai Chappal
          </h1>
          <p className="font-accent text-secondary text-2xl md:text-3xl text-center mb-12">
            Handcrafted with Love
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src="https://images.pexels.com/photos/11576563/pexels-photo-11576563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Artisan crafting chappals"
              className="w-full h-96 object-cover rounded-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-heading text-3xl text-primary font-bold mb-6">Our Story</h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Located in the heart of Mahemdavad, Kheda District, Gujarat, Jasubhai Chappal has been creating
                beautiful handmade ladies fancy chappals for generations. Our journey began with a simple vision:
                to blend traditional craftsmanship with contemporary style.
              </p>
              <p>
                Each pair of chappals we create is a testament to the skill and dedication of our artisans. We use
                only the finest materials and time-honored techniques to ensure that every chappal is not just a
                product, but a work of art.
              </p>
              <p>
                Our commitment to quality, comfort, and style has made us a trusted name among women across India
                who appreciate the beauty of handcrafted footwear.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Heart, title: 'Made with Love', description: 'Every piece crafted with care and passion' },
            { icon: Users, title: 'Skilled Artisans', description: 'Generations of expertise and craftsmanship' },
            { icon: Award, title: 'Premium Quality', description: 'Only the finest materials and techniques' },
            { icon: Sparkles, title: 'Unique Designs', description: 'Exclusive patterns for every occasion' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="text-center p-6 bg-muted/50 rounded-sm"
              data-testid={`value-card-${index}`}
            >
              <item.icon className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-xl text-foreground mb-2">{item.title}</h3>
              <p className="font-body text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-primary text-primary-foreground p-12 rounded-sm text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-secondary">Our Promise</h2>
          <p className="font-body text-lg leading-relaxed max-w-3xl mx-auto">
            We promise to continue the tradition of excellence, bringing you footwear that combines comfort,
            style, and the authentic touch of handcrafted artistry. Every step you take in our chappals is a
            step in luxury and tradition.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
