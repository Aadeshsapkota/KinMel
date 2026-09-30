import { FaHeadphones, FaLaptop, FaMobileAlt, FaGamepad } from "react-icons/fa";

import Container from "./Container";

const categories = [
  { title: "Smartphones", icon: FaMobileAlt },
  { title: "Laptops", icon: FaLaptop },
  { title: "Gaming", icon: FaGamepad },
  { title: "Accessories", icon: FaHeadphones },
];

export default function CategoriesSection() {
  return (
    <section className="bg-surface py-24 relative overflow-hidden border-b border-border">
      <Container className="relative z-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-4">Categories</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="max-w-2xl text-lg text-foreground/60">
            Explore our curated selection of high-performance product categories, engineered for excellence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group relative overflow-hidden rounded-2xl bg-card-bg p-8 border border-card-border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 premium-card"
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <category.icon className="text-2xl text-primary" />
                </div>

                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  {category.title}
                </h3>

                <p className="text-sm text-foreground/60 mb-6 flex-1">
                  Browse our latest {category.title.toLowerCase()} collection.
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <span>Explore</span>
                  <span className="text-lg leading-none">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
