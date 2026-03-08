import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const product = {
  id: "1", name: "Classic Oxford Shirt", price: 2499, originalPrice: 3199, sku: "SHB-OXF-001",
  description: "Crafted from premium 100% Egyptian cotton, this Oxford shirt features a timeless design with meticulous attention to detail. The perfect blend of comfort and sophistication for the modern gentleman. From boardroom meetings to weekend brunches, this versatile shirt adapts to every occasion with effortless grace.",
  images: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop",
  ],
  category: "Shirts", sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "White", hex: "#FFFFFF" }, { name: "Sky Blue", hex: "#87CEEB" }, { name: "Navy", hex: "#1B1F3B" }
  ],
  rating: 4.5, reviews: 128, sold: 1450, inStock: true,
  features: ["100% Egyptian cotton fabric", "Button-down collar", "Regular fit for all body types", "Machine washable at 30°C", "Pre-shrunk material", "Reinforced stitching", "Mother-of-pearl buttons"],
  specifications: [
    { label: "Material", value: "100% Egyptian Cotton" },
    { label: "Fit", value: "Regular Fit" },
    { label: "Collar", value: "Button-Down" },
    { label: "Sleeve", value: "Full Sleeve" },
    { label: "Pattern", value: "Solid" },
    { label: "Care", value: "Machine Wash Cold" },
    { label: "Origin", value: "Made in India" },
  ],
  sizeGuide: [
    { size: "S", chest: "36", waist: "30", length: "27" },
    { size: "M", chest: "38", waist: "32", length: "28" },
    { size: "L", chest: "40", waist: "34", length: "29" },
    { size: "XL", chest: "42", waist: "36", length: "30" },
    { size: "XXL", chest: "44", waist: "38", length: "31" },
  ],
};

const reviews = [
  { id: 1, name: "Arjun M.", avatar: "AM", rating: 5, date: "Feb 28, 2026", title: "Perfect fit and quality!", text: "Exactly what I was looking for. The cotton feels premium and the stitching is flawless. Ordered in sky blue and white — both are amazing.", helpful: 24 },
  { id: 2, name: "Rahul S.", avatar: "RS", rating: 4, date: "Feb 15, 2026", title: "Great shirt, runs slightly large", text: "Beautiful shirt with excellent quality. I'd recommend sizing down if you prefer a snug fit. The fabric softens beautifully after the first wash.", helpful: 12 },
  { id: 3, name: "Vikram P.", avatar: "VP", rating: 5, date: "Jan 30, 2026", title: "Best Oxford I've owned", text: "The attention to detail is incredible — from the mother-of-pearl buttons to the reinforced collar. Worth every penny.", helpful: 31 },
];

const ratingBreakdown = [
  { stars: 5, count: 78, percent: 61 },
  { stars: 4, count: 35, percent: 27 },
  { stars: 3, count: 10, percent: 8 },
  { stars: 2, count: 3, percent: 2 },
  { stars: 1, count: 2, percent: 2 },
];

const relatedProducts = [
  { id: "7", name: "Cotton Linen Shirt", price: 1799, originalPrice: 2499, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop", category: "Shirts", rating: 4.4 },
  { id: "11", name: "Polo T-Shirt", price: 999, originalPrice: 1499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", category: "Shirts", rating: 4.1 },
  { id: "6", name: "Formal Blazer", price: 6999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&h=400&fit=crop", category: "Blazers", rating: 4.7 },
  { id: "2", name: "Slim Fit Chinos", price: 1999, originalPrice: 2699, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop", category: "Trousers", rating: 4.3 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) { toast({ title: "Please select a size", variant: "destructive" }); return; }
    toast({ title: "Added to cart!", description: `${product.name} (${selectedColor}, ${selectedSize}) × ${quantity}` });
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
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link> <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary cursor-zoom-in group" onClick={() => setShowZoom(true)}>
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 shadow-lg"><ZoomIn className="h-4 w-4" /></Button>
              </div>
              {discount > 0 && <Badge variant="destructive" className="absolute top-3 left-3">-{discount}% OFF</Badge>}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-18 h-22 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImage === i ? "border-accent ring-1 ring-accent" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground">{product.category}</Badge>
              {product.inStock ? <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"><Check className="h-3 w-3 mr-1" />In Stock</Badge>
                : <Badge variant="destructive">Out of Stock</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h1>
            <p className="text-xs text-muted-foreground mb-3">SKU: {product.sku} · {product.sold.toLocaleString()} sold</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-accent">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              <Badge variant="destructive" className="text-xs">Save ₹{(product.originalPrice - product.price).toLocaleString()}</Badge>
            </div>

            <div className="bg-secondary/50 rounded-lg p-3 mb-5 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-accent shrink-0" />
              <span>Order within <strong className="text-accent">2h 34m</strong> for delivery by <strong>Mar 10, 2026</strong></span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{product.description}</p>

            {/* Color */}
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2.5">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c.name ? "border-accent ring-2 ring-accent/30" : "border-border"}`}>
                    <span className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-sm font-semibold">Size{selectedSize && `: ${selectedSize}`}</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-accent hover:underline flex items-center gap-1">
                  <Ruler className="h-3 w-3" /> Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`h-11 min-w-[48px] px-4 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size ? "border-accent bg-accent text-accent-foreground shadow-sm" : "border-border hover:border-foreground/30"
                    }`}>{size}</button>
                ))}
              </div>
            </div>

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
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full text-base font-semibold shadow-lg shadow-accent/20" onClick={handleAddToCart}>
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

        {/* Tabs */}
        <Tabs defaultValue="features" className="mt-12">
          <TabsList className="w-full justify-start border-b bg-transparent rounded-none p-0 h-auto overflow-x-auto">
            {[
              { v: "features", l: "Features" }, { v: "specs", l: "Specifications" }, { v: "reviews", l: `Reviews (${product.reviews})` },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-5 py-3 text-sm whitespace-nowrap">{t.l}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="features" className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> <span className="text-muted-foreground">{f}</span></li>
                ))}
              </ul>
              <div className="bg-secondary/50 rounded-xl p-5">
                <h4 className="font-semibold text-sm mb-3">Why Choose This Product?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Our Classic Oxford Shirt is crafted with the finest Egyptian cotton, known for its exceptional softness and durability. Each shirt undergoes rigorous quality checks to ensure perfect stitching, consistent sizing, and long-lasting color retention.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="pt-6">
            <div className="max-w-lg">
              {product.specifications.map((s, i) => (
                <div key={i} className={`flex items-center justify-between py-3 text-sm ${i < product.specifications.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-5 h-fit">
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">{product.rating}</p>
                  <div className="flex justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingBreakdown.map(r => (
                    <div key={r.stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{r.stars}</span>
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <Progress value={r.percent} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div className="md:col-span-2 space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-accent/10 text-accent text-xs">{r.avatar}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-[10px] text-muted-foreground">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{r.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">👍 Helpful ({r.helpful})</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-full">Load More Reviews</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="group block">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-2.5 w-2.5 ${j < Math.floor(p.rating) ? "fill-accent text-accent" : "text-muted"}`} />)}
                </div>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">{p.category}</p>
                <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-accent font-bold text-sm">₹{p.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{p.originalPrice.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Size guide modal */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="max-w-md">
          <DialogTitle className="font-bold">Size Guide (inches)</DialogTitle>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-2 font-medium">Size</th><th className="text-center py-2 font-medium">Chest</th>
                <th className="text-center py-2 font-medium">Waist</th><th className="text-center py-2 font-medium">Length</th>
              </tr></thead>
              <tbody>
                {product.sizeGuide.map(s => (
                  <tr key={s.size} className={`border-b border-border ${selectedSize === s.size ? "bg-accent/10" : ""}`}>
                    <td className="py-2.5 font-medium">{s.size}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{s.chest}"</td>
                    <td className="py-2.5 text-center text-muted-foreground">{s.waist}"</td>
                    <td className="py-2.5 text-center text-muted-foreground">{s.length}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image zoom */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-4xl p-1">
          <DialogTitle className="sr-only">Image Zoom</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}><ChevronLeft className="h-5 w-5" /></Button>
            <img src={product.images[selectedImage]} alt={product.name} className="w-full rounded-lg" />
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}><ChevronRight className="h-5 w-5" /></Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </Layout>
  );
};

export default ProductDetail;
