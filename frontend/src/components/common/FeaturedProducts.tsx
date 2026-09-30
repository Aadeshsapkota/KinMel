import { useEffect, useState } from "react";

import ProductCard from "../cards/ProductCard";

import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";

import Container from "./Container";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <section className="bg-background py-32 border-b border-border relative">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4 cyber-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Featured Collection
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Featured Products
            </h2>

            <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
              Discover our most advanced, battle-tested components and high-fidelity devices chosen by top-tier enthusiasts.
            </p>
          </div>
          
          <div className="hidden md:flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
              &larr;
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
