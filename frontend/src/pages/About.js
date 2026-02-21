const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground">The Story of Jasubhai Chappal</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-primary mb-6">Our Heritage</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Located in the heart of Mahemdavad, Kheda District, Gujarat, Jasubhai Chappal has been crafting
              exquisite ladies fancy chappals for generations. Our journey began with a simple vision: to create
              footwear that perfectly blends traditional craftsmanship with modern comfort.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Each chappal is lovingly handmade by skilled artisans who have inherited their craft through
              generations. We take pride in preserving the age-old techniques while incorporating contemporary
              designs that appeal to modern sensibilities.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              From wedding ceremonies to festive celebrations, our chappals have been part of countless special
              moments across India. We believe in creating not just footwear, but pieces of art that tell a story.
            </p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/5894283/pexels-photo-5894283.jpeg"
              alt="Artisan at work"
              className="w-full h-[500px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            />
          </div>
        </div>

        <div className="bg-accent/30 p-12 mb-16">
          <h2 className="font-serif text-4xl font-semibold text-primary mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-serif text-xl font-semibold text-primary mb-3">Quality</h3>
              <p className="text-muted-foreground">
                We use only premium materials and maintain strict quality standards in every piece we create.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-semibold text-primary mb-3">Craftsmanship</h3>
              <p className="text-muted-foreground">
                Every chappal is handcrafted with attention to detail, ensuring unique character in each pair.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-semibold text-primary mb-3">Tradition</h3>
              <p className="text-muted-foreground">
                We honor our heritage while embracing innovation to serve our customers better.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-4xl font-semibold text-primary mb-6">Made in Gujarat, India</h2>
          <p className="text-foreground/80 leading-relaxed max-w-3xl mx-auto mb-8">
            We are proud to be part of Gujarat's rich textile and craft heritage. By choosing Jasubhai Chappal,
            you support local artisans and help preserve traditional Indian craftsmanship for future generations.
          </p>
          <img
            src="https://images.pexels.com/photos/29169312/pexels-photo-29169312.jpeg"
            alt="Traditional Indian craftsmanship"
            className="w-full max-w-4xl mx-auto h-[400px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
