import { Link } from "react-router-dom";
import Container from "./Container";
import { BsArrowRight } from "react-icons/bs";

export default function PromoBanner() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <Container>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-surface border border-border px-8 py-16 text-foreground lg:px-20 shadow-2xl premium-card group">
          {/* Safe Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px] group-hover:bg-primary/30 transition-colors duration-700" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-[80px] group-hover:bg-secondary/30 transition-colors duration-700" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Limited Time Offer
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-6">
              Upgrade Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Setup.</span>
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-foreground/70 mb-10 font-sans">
              Discover laptops, smartphones, gaming gear and accessories
              carefully selected for top performance and everyday use.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 font-bold text-white dark:text-black shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 cyber-glow-hover"
              >
                <span className="relative z-10 text-white dark:text-black">Shop Now</span>
                <BsArrowRight className="relative z-10 text-white dark:text-black transition-transform group-hover:translate-x-1" size={20} />
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-8 py-4 font-bold text-foreground transition-all hover:border-primary/50"
              >
                View All Products
              </Link>
            </div>
          </div>
          
          {/* Decorative graphic right side (visible on large screens) */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[150%] opacity-20 pointer-events-none">
             <div className="w-full h-full border-l border-primary/30 transform -skew-x-12 translate-x-12 relative">
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-primary/30"></div>
                <div className="absolute top-2/4 left-0 w-full h-[1px] bg-primary/30"></div>
                <div className="absolute top-3/4 left-0 w-full h-[1px] bg-primary/30"></div>
             </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
