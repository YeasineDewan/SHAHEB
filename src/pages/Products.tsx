import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, X, ChevronDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allProducts = [
  { id: "1", name: "Classic Oxford Shirt", price: 2499, originalPrice: 3199, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "shirts", rating: 4.5 },
  { id: "2", name: "Slim Fit Chinos", price: 1999, originalPrice: 2699, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop", category: "trousers", rating: 4.3 },
  { id: "3", name: "Leather Jacket", price: 5999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jackets", rating: 4.8 },
  { id: "4", name: "Premium Kurta Set", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", category: "ethnic", rating: 4.6 },
  { id: "5", name: "Style Guide eBook", price: 499, originalPrice: 999, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop", category: "digital", rating: 4.9 },
  { id: "6", name: "Formal Blazer", price: 6999, originalPrice: 9999, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop", category: "jackets", rating: 4.7 },
  { id: "7", name: "Cotton Linen Shirt", price: 1799, originalPrice: 2499, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop", category: "shirts", rating: 4.4 },
  { id: "8", name: "Designer Kurta", price: 2999, originalPrice: 4499, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop", category: "ethnic", rating: 4.5 },
  { id: "9", name: "Cargo Joggers", price: 1499, originalPrice: 2199, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop", category: "trousers", rating: 4.2 },
  { id: "10", name: "Casual Denim Jacket", price: 3999, originalPrice: 5499, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "jackets", rating: 4.6 },
  { id: "11", name: "Polo T-Shirt", price: 999, originalPrice: 1499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop", category: "shirts", rating: 4.1 },
  { id: "12", name: "Grooming Guide PDF", price: 299, originalPrice: 599, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop", category: "digital", rating: 4.7 },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "shirts", label: "Shirts" },
  { value: "trousers", label: "Trousers" },
  { value: "jackets", label: "Jackets & Blazers" },
  { value: "ethnic", label: "Ethnic Wear" },
  { value: "digital", label: "Digital Products" },
  { value: "accessories", label: "Accessories" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const activeCategory = searchParams.get("category") || "all";
  const [sortBy, setSortBy] = useState("popular");

  const filtered = useMemo(() => {
    let result = allProducts;
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sortBy]);

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp; Products
          {activeCategory !== "all" && <> &nbsp;/&nbsp; <span className="capitalize">{activeCategory}</span></>}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Desktop sidebar filters */}
          <aside className="hidden md:block w-56 shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSearchParams(cat.value === "all" ? {} : { category: cat.value })}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat.value
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Price Range</h3>
              <div className="space-y-1">
                {["Under ₹1,000", "₹1,000 – ₹3,000", "₹3,000 – ₹5,000", "Above ₹5,000"].map(range => (
                  <button key={range} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Search & sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low → High</SelectItem>
                    <SelectItem value="price-high">Price: High → Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="rounded-full md:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-3 md:hidden scrollbar-hide">
              {categories.map(cat => (
                <Badge
                  key={cat.value}
                  variant={activeCategory === cat.value ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 ${
                    activeCategory === cat.value ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => setSearchParams(cat.value === "all" ? {} : { category: cat.value })}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-4">{filtered.length} products found</p>

            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-5">
              {filtered.map((product, i) => {
                const discount = Math.round((1 - product.price / product.originalPrice) * 100);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/products/${product.id}`} className="group block">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2.5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        {discount > 0 && (
                          <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">-{discount}%</Badge>
                        )}
                        <Button size="icon" className="absolute bottom-2 right-2 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-all h-9 w-9">
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 capitalize">{product.category}</p>
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
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Products;
