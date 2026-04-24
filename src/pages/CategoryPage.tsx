import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Tables } from "@/integrations/supabase/types";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const categoryInfo: Record<string, { title: string; description: string; banner: string }> = {
    shirts: { title: t("cat.shirts"), description: t("cat.shirtsDesc"), banner: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=400&fit=crop" },
    trousers: { title: t("cat.trousers"), description: t("cat.trousersDesc"), banner: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=400&fit=crop" },
    jackets: { title: t("cat.jackets"), description: t("cat.jacketsDesc"), banner: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=400&fit=crop" },
    ethnic: { title: t("cat.ethnic"), description: t("cat.ethnicDesc"), banner: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=400&fit=crop" },
    accessories: { title: t("cat.accessories"), description: t("cat.accessoriesDesc"), banner: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=400&fit=crop" },
    digital: { title: t("cat.digital"), description: t("cat.digitalDesc"), banner: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=400&fit=crop" },
  };

  const info = categoryInfo[slug || ""] || { title: slug || "Category", description: "", banner: "" };
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", slug || "")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  return (
    <Layout>
      {info.banner && (
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
      )}

      <div className="container px-4 py-8 md:py-12">
        <div className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">{t("general.home")}</Link> &nbsp;/&nbsp;
          <Link to="/products" className="hover:text-foreground">{t("nav.products")}</Link> &nbsp;/&nbsp;
          <span className="text-foreground">{info.title}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{loading ? t("general.loading") : `${products.length} ${t("category.products")}`}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product, i) => {
              const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/products/${product.slug}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2.5">
                      <img src={product.images?.[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      {discount > 0 && <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">-{discount}%</Badge>}
                      <Button size="icon" className="absolute bottom-2 right-2 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-all h-9 w-9">
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-accent font-bold text-sm">৳{product.price.toLocaleString()}</span>
                      {product.original_price && <span className="text-xs text-muted-foreground line-through">৳{product.original_price.toLocaleString()}</span>}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">{t("category.noProducts")}</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
              <Link to="/products">{t("category.browseAll")}</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default CategoryPage;
