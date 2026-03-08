import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, Heart, Star, X, Grid3X3, List, ChevronDown, Eye, Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images: string[] | null;
  category: string;
  colors: string[] | null;
  is_active: boolean | null;
  slug: string;
  created_at: string;
  stock: number | null;
}

const categoryLabels: Record<string, string> = {
  shirts: "Shirts",
  trousers: "Trousers",
  jackets: "Jackets & Blazers",
  ethnic: "Ethnic Wear",
  digital: "Digital Products",
  accessories: "Accessories",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const activeCategory = searchParams.get("category") || "all";
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, original_price, images, category, colors, is_active, slug, created_at, stock")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Derive categories from data
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const cats = [{ value: "all", label: "All Categories", count: products.length }];
    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      cats.push({ value: cat, label: categoryLabels[cat] || cat, count });
    });
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }, [products, activeCategory, search, sortBy, priceRange, onlyNew, onlyBestseller]);

  const activeFiltersCount = [activeCategory !== "all", priceRange[0] > 0 || priceRange[1] < 10000].filter(Boolean).length;

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 10000]);
    setOnlyNew(false);
    setOnlyBestseller(false);
    setSearch("");
  };

  const getImage = (p: Product, idx = 0) => p.images?.[idx] || "/placeholder.svg";
  const getDiscount = (p: Product) => p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-0.5">
          {categories.map(cat => (
            <button key={cat.value}
              onClick={() => setSearchParams(cat.value === "all" ? {} : { category: cat.value })}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeCategory === cat.value ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
              }`}>
              <span>{cat.label}</span>
              <span className="text-[10px] bg-secondary rounded-full px-2 py-0.5">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider value={priceRange} min={0} max={10000} step={100} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="ghost" className="w-full text-sm text-destructive" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  const ProductSkeleton = () => (
    <div className="space-y-2.5">
      <Skeleton className="aspect-[3/4] rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );

  return (
    <Layout>
      <div className="bg-secondary/50 border-b border-border">
        <div className="container px-4 py-6 md:py-8">
          <div className="text-xs text-muted-foreground mb-2">
            <Link to="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp; Products
            {activeCategory !== "all" && <> &nbsp;/&nbsp; <span className="capitalize text-foreground">{activeCategory}</span></>}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {activeCategory === "all" ? "All Products" : categories.find(c => c.value === activeCategory)?.label}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{filtered.length} products found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 md:py-8">
        <div className="flex gap-8">
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-32 bg-card border border-border rounded-xl p-5">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-full h-10" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 rounded-full h-10 hidden sm:flex">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low → High</SelectItem>
                  <SelectItem value="price-high">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden sm:flex border border-border rounded-full overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="icon" className="rounded-full md:hidden relative" onClick={() => setShowMobileFilters(true)}>
                <Filter className="h-4 w-4" />
                {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[9px] rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
              </Button>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeCategory !== "all" && (
                  <Badge variant="secondary" className="rounded-full gap-1 pr-1 capitalize">
                    {activeCategory} <button onClick={() => setSearchParams({})}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-3 md:hidden scrollbar-hide">
              {categories.map(cat => (
                <Badge key={cat.value} variant={activeCategory === cat.value ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 ${activeCategory === cat.value ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => setSearchParams(cat.value === "all" ? {} : { category: cat.value })}>
                  {cat.label}
                </Badge>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-semibold mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <Button variant="outline" className="rounded-full" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {filtered.map((product, i) => {
                  const discount = getDiscount(product);
                  const isHovered = hoveredId === product.id;
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                      onMouseEnter={() => setHoveredId(product.id)} onMouseLeave={() => setHoveredId(null)}>
                      <div className="group relative">
                        <Link to={`/products/${product.slug}`} className="block">
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-2.5">
                            <img src={isHovered ? getImage(product, 1) : getImage(product, 0)} alt={product.name}
                              className="w-full h-full object-cover transition-all duration-500" loading="lazy" />
                            {discount > 0 && <Badge variant="destructive" className="absolute top-2 left-2 text-[10px]">-{discount}%</Badge>}
                          </div>
                        </Link>
                        <div className="absolute bottom-[calc(2.5rem+2.5rem)] right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={(e) => { e.preventDefault(); setQuickView(product); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={(e) => { e.preventDefault(); toast({ title: "Added to wishlist!" }); }}>
                            <Heart className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" className="h-8 w-8 rounded-full shadow-md bg-accent text-accent-foreground" onClick={(e) => { e.preventDefault(); toast({ title: "Added to cart!" }); }}>
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Link to={`/products/${product.slug}`}>
                          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {product.colors.map(c => <span key={c} className="text-[9px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{c}</span>)}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-accent font-bold text-sm">₹{product.price.toLocaleString()}</span>
                            {product.original_price && <span className="text-xs text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>}
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product, i) => {
                  const discount = getDiscount(product);
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/products/${product.slug}`} className="group flex gap-4 bg-card border border-border rounded-xl p-3 hover:shadow-md transition-shadow">
                        <div className="w-28 h-36 md:w-32 md:h-40 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img src={getImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider capitalize">{product.category}</p>
                          <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                          {product.colors && product.colors.length > 0 && <p className="text-xs text-muted-foreground mt-1.5">{product.colors.join(", ")}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-accent font-bold">₹{product.price.toLocaleString()}</span>
                            {product.original_price && <span className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>}
                            {discount > 0 && <Badge variant="destructive" className="text-[10px]">-{discount}%</Badge>}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-xs h-8"
                              onClick={(e) => { e.preventDefault(); toast({ title: "Added to cart!" }); }}>
                              <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full text-xs h-8"
                              onClick={(e) => { e.preventDefault(); toast({ title: "Added to wishlist!" }); }}>
                              <Heart className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Dialog open={!!quickView} onOpenChange={() => setQuickView(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Quick View</DialogTitle>
          {quickView && (
            <div className="grid md:grid-cols-2">
              <div className="aspect-square bg-secondary">
                <img src={getImage(quickView)} alt={quickView.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <Badge className="bg-accent text-accent-foreground text-[10px] mb-2 capitalize">{quickView.category}</Badge>
                <h2 className="text-xl font-bold mb-2">{quickView.name}</h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-accent">₹{quickView.price.toLocaleString()}</span>
                  {quickView.original_price && <span className="text-muted-foreground line-through">₹{quickView.original_price.toLocaleString()}</span>}
                </div>
                {quickView.colors && quickView.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Colors:</p>
                    <div className="flex gap-2">{quickView.colors.map(c => <Badge key={c} variant="outline" className="rounded-full">{c}</Badge>)}</div>
                  </div>
                )}
                <div className="flex gap-2 mt-6">
                  <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" onClick={() => { toast({ title: "Added to cart!" }); setQuickView(null); }}>
                    <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link to={`/products/${quickView.slug}`} onClick={() => setQuickView(null)}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile filter drawer */}
      <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <DialogContent className="max-w-sm h-[85vh] overflow-y-auto">
          <DialogTitle className="font-bold text-lg mb-4">Filters</DialogTitle>
          <FilterSidebar />
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full mt-4" onClick={() => setShowMobileFilters(false)}>
            Show {filtered.length} Results
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </Layout>
  );
};

export default Products;
