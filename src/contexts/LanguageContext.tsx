import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "bn" | "en";

const translations = {
  // Navbar & Navigation
  "nav.home": { bn: "হোম", en: "Home" },
  "nav.products": { bn: "পণ্যসমূহ", en: "Products" },
  "nav.about": { bn: "আমাদের সম্পর্কে", en: "About Us" },
  "nav.contact": { bn: "যোগাযোগ", en: "Contact" },
  "nav.faq": { bn: "জিজ্ঞাসা", en: "FAQ" },
  "nav.login": { bn: "লগইন", en: "Login" },
  "nav.dashboard": { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  "nav.cart": { bn: "কার্ট", en: "Cart" },
  "nav.profile": { bn: "প্রোফাইল", en: "Profile" },
  "nav.category": { bn: "ক্যাটেগরি", en: "Category" },

  // Categories
  "cat.shirts": { bn: "শার্ট", en: "Shirts" },
  "cat.trousers": { bn: "ট্রাউজার্স", en: "Trousers" },
  "cat.ethnic": { bn: "এথনিক পোশাক", en: "Ethnic Wear" },
  "cat.jackets": { bn: "জ্যাকেট ও ব্লেজার", en: "Jackets & Blazers" },
  "cat.accessories": { bn: "এক্সেসরিজ", en: "Accessories" },
  "cat.digital": { bn: "ডিজিটাল পণ্য", en: "Digital Products" },

  // Announcements
  "announce.free_shipping": { bn: "৳৯৯৯+ অর্ডারে বিনামূল্যে শিপিং", en: "Free shipping on orders ৳999+" },
  "announce.summer": { bn: "🔥 গ্রীষ্মকালীন কালেকশন ২০২৬ — এখন লাইভ!", en: "🔥 Summer Collection 2026 — Now Live!" },
  "announce.discount": { bn: "কোড SHAHEB20 ব্যবহার করে প্রথম অর্ডারে ২০% ছাড়", en: "Use code SHAHEB20 for 20% off your first order" },
  "announce.friday": { bn: "প্রতি শুক্রবার নতুন পণ্য — সাথে থাকুন!", en: "New arrivals every Friday — Stay tuned!" },
  "announce.premium": { bn: "💎 প্রিমিয়াম সদস্যরা আগে অ্যাক্সেস পান", en: "💎 Premium members get early access" },

  // Hero
  "hero.badge": { bn: "নতুন কালেকশন ২০২৬", en: "New Collection 2026" },
  "hero.title1": { bn: "আপনার", en: "Redefine Your" },
  "hero.style": { bn: "স্টাইল", en: "Style" },
  "hero.title2": { bn: "নতুনভাবে সাজান SHAHEB এর সাথে", en: "with SHAHEB" },
  "hero.desc": { bn: "প্রিমিয়াম পুরুষদের পোশাক ও এক্সক্লুসিভ ডিজিটাল কন্টেন্ট। মানসম্পন্ন ফ্যাশন, আসল কারুশিল্প, আপনার দোরগোড়ায়।", en: "Premium men's fashion & exclusive digital content. Quality fashion, real craftsmanship, at your doorstep." },
  "hero.browse": { bn: "পণ্য দেখুন", en: "Browse Products" },
  "hero.story": { bn: "আমাদের গল্প", en: "Our Story" },
  "hero.customers": { bn: "সন্তুষ্ট গ্রাহক", en: "Happy Customers" },
  "hero.products": { bn: "পণ্যসমূহ", en: "Products" },
  "hero.rating": { bn: "গড় রেটিং", en: "Avg Rating" },

  // Products page
  "products.title": { bn: "সকল পণ্য", en: "All Products" },
  "products.found": { bn: "টি পণ্য পাওয়া গেছে", en: "products found" },
  "products.search": { bn: "পণ্য অনুসন্ধান করুন...", en: "Search products..." },
  "products.sort.popular": { bn: "সবচেয়ে জনপ্রিয়", en: "Most Popular" },
  "products.sort.newest": { bn: "নতুনতম", en: "Newest First" },
  "products.sort.priceLow": { bn: "মূল্য: কম → বেশি", en: "Price: Low → High" },
  "products.sort.priceHigh": { bn: "মূল্য: বেশি → কম", en: "Price: High → Low" },
  "products.categories": { bn: "ক্যাটেগরি", en: "Categories" },
  "products.priceRange": { bn: "মূল্য সীমা", en: "Price Range" },
  "products.clearFilters": { bn: "সব ফিল্টার মুছুন", en: "Clear All Filters" },
  "products.noProducts": { bn: "কোন পণ্য পাওয়া যায়নি", en: "No products found" },
  "products.noProductsDesc": { bn: "ফিল্টার বা সার্চ পরিবর্তন করে দেখুন।", en: "Try adjusting your filters or search query." },
  "products.addToCart": { bn: "কার্টে যোগ করুন", en: "Add to Cart" },
  "products.addedToCart": { bn: "কার্টে যোগ হয়েছে!", en: "Added to cart!" },
  "products.addedToWishlist": { bn: "উইশলিস্টে যোগ হয়েছে!", en: "Added to wishlist!" },
  "products.quickView": { bn: "দ্রুত দেখুন", en: "Quick View" },
  "products.allCategories": { bn: "সকল ক্যাটেগরি", en: "All Categories" },
  "products.continueShopping": { bn: "কেনাকাটা চালিয়ে যান", en: "Continue Shopping" },

  // Product Detail
  "product.inStock": { bn: "স্টকে আছে", en: "In Stock" },
  "product.outOfStock": { bn: "স্টক শেষ", en: "Out of Stock" },
  "product.color": { bn: "রঙ", en: "Color" },
  "product.size": { bn: "সাইজ", en: "Size" },
  "product.quantity": { bn: "পরিমাণ", en: "Quantity" },
  "product.addToCart": { bn: "কার্টে যোগ করুন", en: "Add to Cart" },
  "product.buyNow": { bn: "এখনই কিনুন", en: "Buy Now" },
  "product.selectSize": { bn: "সাইজ নির্বাচন করুন", en: "Please select a size" },
  "product.description": { bn: "বিবরণ", en: "Description" },
  "product.related": { bn: "আপনার পছন্দ হতে পারে", en: "You May Also Like" },
  "product.notFound": { bn: "পণ্য পাওয়া যায়নি", en: "Product Not Found" },
  "product.notFoundDesc": { bn: "আপনার খোঁজা পণ্যটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।", en: "The product you're looking for doesn't exist or has been removed." },
  "product.freeDelivery": { bn: "ফ্রি ডেলিভারি", en: "Free Delivery" },
  "product.ordersAbove": { bn: "৳৯৯৯+ অর্ডারে", en: "Orders ৳999+" },
  "product.genuine": { bn: "আসল পণ্য", en: "Genuine Product" },
  "product.authentic": { bn: "১০০% অথেনটিক", en: "100% Authentic" },
  "product.easyReturns": { bn: "সহজ রিটার্ন", en: "Easy Returns" },
  "product.returnDays": { bn: "১৫ দিন", en: "15 Days" },
  "product.linkCopied": { bn: "লিঙ্ক কপি হয়েছে!", en: "Link copied to clipboard!" },
  "product.save": { bn: "সেভ", en: "Save" },

  // Cart
  "cart.title": { bn: "শপিং কার্ট", en: "Shopping Cart" },
  "cart.empty": { bn: "আপনার কার্ট খালি", en: "Your cart is empty" },
  "cart.emptyDesc": { bn: "এখনো কিছু যোগ করেননি। আমাদের কালেকশন ঘুরে দেখুন!", en: "Looks like you haven't added anything yet. Start exploring our collection!" },
  "cart.items": { bn: "টি আইটেম", en: "items" },
  "cart.total": { bn: "মোট", en: "total" },
  "cart.addMore": { bn: "আরো যোগ করুন", en: "Add more for free shipping" },
  "cart.freeShipping": { bn: "আপনি ফ্রি শিপিং পাচ্ছেন!", en: "You qualify for free shipping!" },
  "cart.orderSummary": { bn: "অর্ডার সারাংশ", en: "Order Summary" },
  "cart.subtotal": { bn: "সাবটোটাল", en: "Subtotal" },
  "cart.couponDiscount": { bn: "কুপন ছাড়", en: "Coupon Discount" },
  "cart.shipping": { bn: "শিপিং", en: "Shipping" },
  "cart.free": { bn: "ফ্রি", en: "Free" },
  "cart.proceedToCheckout": { bn: "চেকআউটে যান", en: "Proceed to Checkout" },
  "cart.secureCheckout": { bn: "সিকিউর চেকআউট", en: "Secure Checkout" },
  "cart.returns": { bn: "১৫-দিনের রিটার্ন", en: "15-Day Returns" },
  "cart.enterCoupon": { bn: "কুপন কোড লিখুন", en: "Enter coupon code" },
  "cart.apply": { bn: "প্রয়োগ", en: "Apply" },
  "cart.removed": { bn: "কার্ট থেকে সরানো হয়েছে", en: "Item removed from cart" },
  "cart.invalidCoupon": { bn: "অবৈধ কুপন কোড", en: "Invalid coupon code" },
  "cart.minOrder": { bn: "ন্যূনতম অর্ডার প্রয়োজন", en: "Minimum order required" },
  "cart.couponApplied": { bn: "কুপন প্রয়োগ হয়েছে!", en: "Coupon applied!" },
  "cart.discount": { bn: "ছাড়", en: "discount" },

  // Checkout
  "checkout.title": { bn: "চেকআউট", en: "Checkout" },
  "checkout.step.shipping": { bn: "শিপিং", en: "Shipping" },
  "checkout.step.payment": { bn: "পেমেন্ট", en: "Payment" },
  "checkout.step.review": { bn: "রিভিউ", en: "Review" },
  "checkout.shippingAddress": { bn: "শিপিং ঠিকানা", en: "Shipping Address" },
  "checkout.firstName": { bn: "নাম *", en: "First Name *" },
  "checkout.lastName": { bn: "পদবি", en: "Last Name" },
  "checkout.email": { bn: "ইমেইল", en: "Email" },
  "checkout.address": { bn: "ঠিকানা *", en: "Address *" },
  "checkout.city": { bn: "শহর *", en: "City *" },
  "checkout.postalCode": { bn: "পোস্ট কোড *", en: "Postal Code *" },
  "checkout.state": { bn: "বিভাগ *", en: "State/Division *" },
  "checkout.phone": { bn: "ফোন *", en: "Phone *" },
  "checkout.backToCart": { bn: "কার্টে ফিরে যান", en: "Back to Cart" },
  "checkout.continueToPayment": { bn: "পেমেন্টে যান", en: "Continue to Payment" },
  "checkout.paymentMethod": { bn: "পেমেন্ট পদ্ধতি", en: "Payment Method" },
  "checkout.bkash": { bn: "বিকাশ", en: "bKash" },
  "checkout.bkashDesc": { bn: "বিকাশ মোবাইল পেমেন্ট", en: "bKash mobile payment" },
  "checkout.nagad": { bn: "নগদ", en: "Nagad" },
  "checkout.nagadDesc": { bn: "নগদ মোবাইল পেমেন্ট", en: "Nagad mobile payment" },
  "checkout.cod": { bn: "ক্যাশ অন ডেলিভারি", en: "Cash on Delivery" },
  "checkout.codDesc": { bn: "পণ্য পেয়ে পেমেন্ট করুন", en: "Pay when you receive" },
  "checkout.card": { bn: "কার্ড পেমেন্ট", en: "Credit / Debit Card" },
  "checkout.cardDesc": { bn: "ভিসা, মাস্টারকার্ড", en: "Visa, Mastercard" },
  "checkout.back": { bn: "পিছনে", en: "Back" },
  "checkout.reviewOrder": { bn: "অর্ডার রিভিউ", en: "Review Order" },
  "checkout.edit": { bn: "সম্পাদনা", en: "Edit" },
  "checkout.payment": { bn: "পেমেন্ট", en: "Payment" },
  "checkout.items": { bn: "আইটেমসমূহ", en: "Items" },
  "checkout.estimatedDelivery": { bn: "আনুমানিক ডেলিভারি: ৩-৫ কার্যদিবস", en: "Estimated delivery: 3-5 business days" },
  "checkout.standardShipping": { bn: "স্ট্যান্ডার্ড শিপিং", en: "Standard shipping" },
  "checkout.placeOrder": { bn: "অর্ডার দিন", en: "Place Order" },
  "checkout.placingOrder": { bn: "অর্ডার হচ্ছে...", en: "Placing Order..." },
  "checkout.orderConfirmed": { bn: "অর্ডার নিশ্চিত হয়েছে!", en: "Order Confirmed!" },
  "checkout.orderSuccess": { bn: "আপনার অর্ডার সফলভাবে প্লেস করা হয়েছে।", en: "Your order has been placed successfully." },
  "checkout.orderId": { bn: "অর্ডার আইডি", en: "Order ID" },
  "checkout.viewOrders": { bn: "অর্ডার দেখুন", en: "View Orders" },
  "checkout.bkashNumber": { bn: "বিকাশ নম্বর", en: "bKash Number" },
  "checkout.nagadNumber": { bn: "নগদ নম্বর", en: "Nagad Number" },
  "checkout.trxId": { bn: "ট্রানজেকশন আইডি", en: "Transaction ID" },
  "checkout.paymentInstructions.bkash": { bn: "০১XXXXXXXXX নম্বরে বিকাশ করুন এবং ট্রানজেকশন আইডি দিন", en: "Send bKash to 01XXXXXXXXX and provide the transaction ID" },
  "checkout.paymentInstructions.nagad": { bn: "০১XXXXXXXXX নম্বরে নগদ করুন এবং ট্রানজেকশন আইডি দিন", en: "Send Nagad to 01XXXXXXXXX and provide the transaction ID" },
  "checkout.orderPlacedSuccess": { bn: "🎉 অর্ডার সফলভাবে দেওয়া হয়েছে!", en: "🎉 Order Placed Successfully!" },
  "checkout.orderConfirmedDesc": { bn: "অর্ডার নিশ্চিত হয়েছে।", en: "Order confirmed." },
  "checkout.orderFailed": { bn: "অর্ডার ব্যর্থ হয়েছে", en: "Failed to place order" },
  "checkout.orderFailedDesc": { bn: "আবার চেষ্টা করুন অথবা আগে লগইন করুন।", en: "Please try again or log in first." },
  "checkout.ssl": { bn: "২৫৬-বিট SSL এনক্রিপ্টেড · ১০০% নিরাপদ", en: "256-bit SSL encrypted · 100% secure" },
  "checkout.emptyCart": { bn: "আপনার কার্ট খালি", en: "Your cart is empty" },
  "checkout.browseProducts": { bn: "পণ্য দেখুন", en: "Browse Products" },
  "checkout.fillField": { bn: "পূরণ করুন", en: "Please fill in" },

  // Footer
  "footer.desc": { bn: "প্রিমিয়াম পুরুষদের ফ্যাশন ও ডিজিটাল কন্টেন্ট। আধুনিক ভদ্রলোকদের জন্য মানসম্পন্ন ও স্টাইলিশ পণ্য।", en: "Premium men's fashion & digital content. Quality & stylish products for the modern gentleman." },
  "footer.shop": { bn: "কেনাকাটা", en: "Shop" },
  "footer.allProducts": { bn: "সকল পণ্য", en: "All Products" },
  "footer.help": { bn: "সাহায্য", en: "Help" },
  "footer.contact": { bn: "যোগাযোগ", en: "Contact" },
  "footer.faq": { bn: "সাধারণ জিজ্ঞাসা", en: "FAQ" },
  "footer.trackOrder": { bn: "অর্ডার ট্র্যাক", en: "Track Order" },
  "footer.aboutUs": { bn: "আমাদের সম্পর্কে", en: "About Us" },
  "footer.contactInfo": { bn: "যোগাযোগ", en: "Contact" },
  "footer.rights": { bn: "সর্বস্বত্ব সংরক্ষিত।", en: "All rights reserved." },
  "footer.privacy": { bn: "গোপনীয়তা নীতি", en: "Privacy Policy" },
  "footer.terms": { bn: "শর্তাবলী", en: "Terms & Conditions" },
  "footer.refund": { bn: "রিফান্ড নীতি", en: "Refund Policy" },

  // Bottom Nav
  "bottom.home": { bn: "হোম", en: "Home" },
  "bottom.products": { bn: "পণ্য", en: "Products" },
  "bottom.cart": { bn: "কার্ট", en: "Cart" },
  "bottom.profile": { bn: "প্রোফাইল", en: "Profile" },

  // Auth
  "auth.login": { bn: "লগইন", en: "Login" },
  "auth.signup": { bn: "অ্যাকাউন্ট তৈরি", en: "Sign Up" },
  "auth.email": { bn: "ইমেইল ঠিকানা", en: "Email Address" },
  "auth.password": { bn: "পাসওয়ার্ড", en: "Password" },
  "auth.name": { bn: "পুরো নাম", en: "Full Name" },
  "auth.forgotPassword": { bn: "পাসওয়ার্ড ভুলে গেছেন?", en: "Forgot Password?" },
  "auth.noAccount": { bn: "অ্যাকাউন্ট নেই?", en: "Don't have an account?" },
  "auth.hasAccount": { bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?", en: "Already have an account?" },
  "auth.resetPassword": { bn: "পাসওয়ার্ড রিসেট করুন", en: "Reset Password" },
  "auth.resetDesc": { bn: "আপনার ইমেইল দিন এবং আমরা একটি রিসেট লিঙ্ক পাঠাব।", en: "Enter your email and we'll send you a reset link." },
  "auth.sendResetLink": { bn: "রিসেট লিঙ্ক পাঠান", en: "Send Reset Link" },

  // Search
  "search.title": { bn: "অনুসন্ধান", en: "Search" },
  "search.desc": { bn: "পণ্য, ক্যাটেগরি এবং আরো অনেক কিছু খুঁজুন", en: "Search products, categories and more" },
  "search.placeholder": { bn: "পণ্য অনুসন্ধান করুন...", en: "Search products..." },
  "search.popular": { bn: "জনপ্রিয় অনুসন্ধান", en: "Popular Searches" },

  // General
  "general.currency": { bn: "৳", en: "৳" },
  "general.browseProducts": { bn: "পণ্য দেখুন", en: "Browse Products" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("shaheb_lang");
    return (saved === "en" || saved === "bn") ? saved : "bn";
  });

  useEffect(() => {
    localStorage.setItem("shaheb_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
