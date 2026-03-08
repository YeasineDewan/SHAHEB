import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const product = {
  id: "1",
  name: "Classic Oxford Shirt",
  price: 2499,
  originalPrice: 3199,
  description: "Crafted from premium 100% Egyptian cotton, this Oxford shirt features a timeless design with meticulous attention to detail. The perfect blend of comfort and sophistication for the modern gentleman.",
  images: [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=750&fit=crop",
  ],
  category: "Shirts",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["White", "Sky Blue", "Navy"],
  rating: 4.5,
  reviews: 128,
  inStock: true,
  features: [
    "100% Egyptian cotton fabric",
    "Button-down collar",
    "Regular fit for all body types",
    "Machine washable",
    "Pre-shrunk material",
  ],
};

const relatedProducts = [
  { id: "7", name: "Cotton Linen Shirt", price: 1799, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop", category: "Shirts" },
  { id: "11", name: "Polo T-Shirt", price: 999, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop", category: "Shirts" },
  { id: "6", name: "Formal Blazer", price: 6999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&h=400&fit=crop", category: "Blazers" },
  { id: "2", name: "Slim Fit Chinos", price: 1999, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop", category: "Trousers" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    toast({ title: "Added to cart!", description: `${product.name} (${selectedSize}) × ${quantity}` });
  };

  return (
    <Layout>
      <div className="container px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-foreground">Home</Link> <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-foreground">Products</Link> <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary mb-3">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Badge className="bg-accent text-accent-foreground mb-3">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-accent">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              <Badge variant="destructive">-{discount}%</Badge>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Size selection */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-[44px] px-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" className="rounded-lg" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full text-base" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 border-t border-border pt-6">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: ShieldCheck, label: "Genuine Product" },
                { icon: RotateCcw, label: "15-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="features" className="mt-12">
          <TabsList className="w-full justify-start border-b bg-transparent rounded-none p-0 h-auto">
            <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">Features</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="pt-6">
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {f}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <p className="text-muted-foreground text-sm">Reviews coming soon.</p>
          </TabsContent>
        </Tabs>

        {/* Related */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="group block">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">{p.category}</p>
                <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
                <p className="text-accent font-bold text-sm">₹{p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default ProductDetail;
