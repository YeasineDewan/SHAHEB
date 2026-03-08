import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const allProducts = [
  { id: "1", name: "Classic Oxford Shirt", price: 2499, originalPrice: 3199, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "shirts" },
  { id: "7", name: "Cotton Linen Shirt", price: 1799, originalPrice: 2499, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop", category: "shirts" },
  { id: "11", name: "Polo T-Shirt", price: 999, originalPrice: 1499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "shirts" },
  { id: "2", name: "Slim Fit Chinos", price: 1999, originalPrice: 2699, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop", category: "trousers" },
  { id: "9", name: "Cargo Joggers", price: 1499, originalPrice: 2199, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop", category: "trousers" },
  { id: "3", name: "Leather Jacket", price: 5999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jackets" },
  { id: "6", name: "Formal Blazer", price: 6999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop", category: "jackets" },
  { id: "10", name: "Casual Denim Jacket", price: 3999, originalPrice: 5499, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jackets" },
  { id: "4", name: "Premium Kurta Set", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", category: "ethnic" },
  { id: "8", name: "Designer Kurta", price: 2999, originalPrice: 4499, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop", category: "ethnic" },
  { id: "5", name: "Style Guide eBook", price: 499, originalPrice: 999, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop", category: "digital" },
  { id: "12", name: "Grooming Guide PDF", price: 299, originalPrice: 599, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop", category: "digital" },
];

const categoryInfo: Record<string, { title: string; description: string; banner: string }> = {
  shirts: { title: "Shirts", description: "Premium cotton & linen shirts for every occasion", banner: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=400&fit=crop" },
  trousers: { title: "Trousers", description: "Tailored fits from chinos to joggers", banner: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=400&fit=crop" },
  jackets: { title: "Jackets & Blazers", description: "Statement outerwear for the modern man", banner: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=400&fit=crop" },
  ethnic: { title: "Ethnic Wear", description: "Authentic kurtas and traditional sets", banner: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=400&fit=crop" },
  accessories: { title: "Accessories", description: "Complete your look with premium accessories", banner: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=400&fit=crop" },
  digital: { title: "Digital Products", description: "Style guides, eBooks & exclusive content", banner: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=400&fit=crop" },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const info = categoryInfo[slug || ""] || { title: "Category", description: "", banner: "" };
  const products = useMemo(() => allProducts.filter(p => p.category === slug), [slug]);

  return (
    <Layout>
      {/* Banner */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <img src={info.banner} alt={info.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60 dark:bg-background/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground dark:text-foreground">{info.title}</h1>
            <p className="text-primary-foreground/70 dark:text-foreground/70 text-sm mt-2">{info.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 py-8 md:py-12">
        <div className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp;
          <Link to="/products" className="hover:text-foreground">Products</Link> &nbsp;/&nbsp;
          <span className="text-foreground">{info.title}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{products.length} products</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2.5">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {discount > 0 && <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">-{discount}%</Badge>}
                    <Button size="icon" className="absolute bottom-2 right-2 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-all h-9 w-9">
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent font-bold text-sm">₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No products in this category yet.</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
              <Link to="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default CategoryPage;
