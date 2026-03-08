import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag, Heart, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight,
  Share2, Ruler, Clock, Package, Check, ZoomIn, ChevronLeft
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Tables<"products"> | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Try slug first, then id
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", id || "")
        .maybeSingle();

      if (!data) {
        ({ data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id || "")
          .maybeSingle());
      }

      if (data) {
        setProduct(data);
        setSelectedColor(data.colors?.[0] || "");
        // Fetch related
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category", data.category)
          .eq("is_active", true)
          .neq("id", data.id)
          .limit(4);
        if (related) setRelatedProducts(related);
      }
      setLoading(false);
    };
    fetchProduct();
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-6 md:py-10">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            <Skeleton className="aspect-[4/5] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
        <Footer />
      </Layout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"];
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const inStock = (product.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    toast({ title: "Added to cart!", description: `${product.name}${selectedColor ? ` (${selectedColor})` : ""}${selectedSize ? `, ${selectedSize}` : ""} × ${quantity}` });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  return (
    <Layout>
      <div className="container px-4 py-6 md:py-10">
        <div className="text-xs text-muted-foreground mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link> <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-foreground">Products</Link> <ChevronRight className="h-3 w-3" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-foreground capitalize">{product.category}</Link> <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary cursor-zoom-in group" onClick={() => setShowZoom(true)}>
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 shadow-lg"><ZoomIn className="h-4 w-4" /></Button>
              </div>
              {discount > 0 && <Badge variant="destructive" className="absolute top-3 left-3">-{discount}% OFF</Badge>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-18 h-22 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImage === i ? "border-accent ring-1 ring-accent" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground capitalize">{product.category}</Badge>
              {inStock ? (
                <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"><Check className="h-3 w-3 mr-1" />In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h1>
            <p className="text-xs text-muted-foreground mb-3">SKU: {product.slug}</p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-accent">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
                  <Badge variant="destructive" className="text-xs">Save ₹{(product.original_price - product.price).toLocaleString()}</Badge>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{product.description}</p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2.5">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`h-9 px-4 rounded-lg border text-sm font-medium transition-all ${
                        selectedColor === c ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-foreground/30"
                      }`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2.5">Size{selectedSize && `: ${selectedSize}`}</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`h-11 min-w-[48px] px-4 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size ? "border-accent bg-accent text-accent-foreground shadow-sm" : "border-border hover:border-foreground/30"
                      }`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2.5">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-l-lg rounded-r-none" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-semibold text-sm border-x border-border h-10 flex items-center justify-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-r-lg rounded-l-none" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full text-base font-semibold shadow-lg shadow-accent/20" onClick={handleAddToCart} disabled={!inStock}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart — ₹{(product.price * quantity).toLocaleString()}
              </Button>
              <Button variant="outline" size="icon" className={`h-12 w-12 rounded-full ${isWishlisted ? "text-red-500 border-red-200" : ""}`}
                onClick={() => { setIsWishlisted(!isWishlisted); toast({ title: isWishlisted ? "Removed from wishlist" : "Added to wishlist!" }); }}>
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold mb-6" asChild>
              <Link to="/checkout">Buy Now</Link>
            </Button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 bg-secondary/50 rounded-xl p-4">
              {[
                { icon: Truck, label: "Free Delivery", sub: "Orders ₹999+" },
                { icon: ShieldCheck, label: "Genuine Product", sub: "100% Authentic" },
                { icon: RotateCcw, label: "Easy Returns", sub: "15 Days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-[10px] text-muted-foreground">{sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Description tab */}
        {product.description && (
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start border-b bg-transparent rounded-none p-0 h-auto overflow-x-auto">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-5 py-3 text-sm whitespace-nowrap">Description</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
            </TabsContent>
          </Tabs>
        )}

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group block">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2">
                    <img src={p.images?.[0] || "/placeholder.svg"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <p className="text-[10px] uppercase text-muted-foreground tracking-wider capitalize">{p.category}</p>
                  <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-accent font-bold text-sm">₹{p.price.toLocaleString()}</span>
                    {p.original_price && <span className="text-xs text-muted-foreground line-through">₹{p.original_price.toLocaleString()}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image zoom */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-4xl p-1">
          <DialogTitle className="sr-only">Image Zoom</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}><ChevronLeft className="h-5 w-5" /></Button>
            <img src={images[selectedImage]} alt={product.name} className="w-full rounded-lg" />
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}><ChevronRight className="h-5 w-5" /></Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </Layout>
  );
};

export default ProductDetail;
