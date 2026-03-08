import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const popularSearches = ["Shirts", "Kurta", "Blazer", "Jacket", "Chinos", "eBook"];

const SearchPage = () => {
  const [query, setQuery] = useState("");

  return (
    <Layout>
      <div className="container px-4 py-12 md:py-20 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground text-sm">Find products, categories, and more</p>
        </motion.div>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-12 h-13 text-base rounded-full"
            autoFocus
          />
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(term => (
              <Link
                key={term}
                to={`/products?search=${term.toLowerCase()}`}
                className="inline-flex items-center gap-1 bg-secondary px-4 py-2 rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {term} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
