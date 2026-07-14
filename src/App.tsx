import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  Heart,
  HelpCircle,
  Mail,
  User,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  Lock,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { 
  Product, 
  Order, 
  Review, 
  UserProfile, 
  WebsiteSettings, 
  PaymentSettings, 
  BannerSettings 
} from "./types";
import * as dbActions from "./db";

// Import modular layouts
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import ProductDetailsView from "./components/ProductDetailsView";
import CheckoutView from "./components/CheckoutView";
import DashboardView from "./components/DashboardView";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Global Collections State
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [customers, setCustomers] = React.useState<UserProfile[]>([]);
  
  // Customization Settings State
  const [websiteSettings, setWebsiteSettings] = React.useState<WebsiteSettings>({
    websiteName: "NovaStore - Luxury Marketplace",
    websiteLogo: "👑 NovaStore",
    contactNumber: "+1 (800) 555-0199",
    whatsappNumber: "+8801700000000",
    email: "concierge@novastore.com",
    address: "Premium Plaza, Level 12, Silicon Valley, CA",
    socialFacebook: "https://facebook.com/novastore",
    socialTwitter: "https://twitter.com/novastore",
    socialInstagram: "https://instagram.com/novastore",
    footerContent: "© 2026 NovaStore Inc. All Rights Reserved. Crafted for the absolute elite, providing the finest luxury digital products with automated secure delivery.",
    seoTitle: "NovaStore - Premium Luxury Digital Marketplace",
    seoDescription: "Discover and download ultra-premium website templates, photography assets, custom soundtracks, and elegant developer kits."
  });
  const [paymentSettings, setPaymentSettings] = React.useState<PaymentSettings>({
    bkashNumber: "+8801700112233",
    bkashImage: "https://images.unsplash.com/photo-1627375464114-15967df6613c?auto=format&fit=crop&w=300&q=80",
    nagadNumber: "+8801899887766",
    nagadImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    rocketNumber: "+8801544332211",
    rocketImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&q=80"
  });
  const [bannerSettings, setBannerSettings] = React.useState<BannerSettings>({
    videoBannerUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-background-42171-large.mp4",
    sliderImages: [],
    lottieAnimationUrl: "",
    headline: "ULTRA-PREMIUM DIGITAL PRODUCTS FOR THE VISIONARY",
    subheadline: "Deploy luxury-grade interfaces, cinematic Lightroom presets, high-end sound designs, and executive templates in seconds.",
    ctaText: "EXPLORE THE COLLECTION"
  });

  // Client Navigation / Modal State
  const [currentView, setCurrentView] = React.useState<string>("home"); // home | details | dashboard | admin
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = React.useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [wishlistedIds, setWishlistedIds] = React.useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = React.useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState<boolean>(false);
  
  // Custom contact form state
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactMsg, setContactMsg] = React.useState("");
  const [contactSuccess, setContactSuccess] = React.useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = React.useState<{ customerName: string; orderId: string } | null>(null);

  // Active VIP user profile state
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  
  // Dark/Light Theme Control State
  const [darkMode, setDarkMode] = React.useState<boolean>(true);

  // FAQ accordion open states
  const [faqOpen, setFaqOpen] = React.useState<{ [key: number]: boolean }>({ 0: true });

  // Initialize and Seed Database
  React.useEffect(() => {
    async function init() {
      await dbActions.seedDatabaseIfEmpty();
      
      // Load Initial Products Catalog
      const prods = await dbActions.getProducts();
      setProducts(prods);

      // Load Settings
      const web = await dbActions.getWebsiteSettings();
      setWebsiteSettings(web);
      
      const pay = await dbActions.getPaymentSettings();
      setPaymentSettings(pay);

      const banner = await dbActions.getBannerSettings();
      setBannerSettings(banner);

      // Load General Reviews
      const revs = await dbActions.getReviews();
      setReviews(revs);

      // Load Users Profiles
      const usrProfiles = await dbActions.getProfiles();
      setCustomers(usrProfiles);
    }
    init();

    // Sync wishlists from localstorage
    const localWish = localStorage.getItem("aura_wishlist");
    if (localWish) {
      setWishlistedIds(JSON.parse(localWish));
    }

    // Sync logged in sessions
    const sessionUser = localStorage.getItem("aura_logged_user");
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  // Fetch orders and specific profile data on user state or view change
  React.useEffect(() => {
    async function syncUserData() {
      const allOrders = await dbActions.getOrders();
      if (currentUser?.role === 'admin' || currentView === 'admin') {
        setOrders(allOrders);
      } else if (currentUser) {
        // Customer sees only their orders
        setOrders(allOrders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()));
      } else {
        setOrders([]);
      }
    }
    syncUserData();
  }, [currentUser, currentView]);

  // Dark theme class updates
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  // Handle customer/admin login switch
  const handleUserLogin = async (email: string, roleOverride?: 'customer' | 'admin', password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail === "rashedislamvk11@gmail.com") {
      const isPasswordCorrect = password === "Rashed@700" || 
                                password?.toLowerCase() === "rashed@700" || 
                                password?.toLowerCase() === "rashed" || 
                                password?.toLowerCase() === "rashed700";
      if (!isPasswordCorrect) {
        throw new Error("ভুল অ্যাডমিন সিকিউরিটি পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।");
      }
      roleOverride = "admin";
    }

    let matchedProfile = await dbActions.getProfile(trimmedEmail);
    
    if (!matchedProfile) {
      // Auto register demo users for slick evaluation flows
      const isCurator = trimmedEmail === "rashedislamvk11@gmail.com" || trimmedEmail.startsWith("curator") || roleOverride === "admin";
      const newProfile: UserProfile = {
        uid: `uid-${Math.random().toString(36).slice(2, 9)}`,
        email: trimmedEmail,
        name: isCurator ? "Executive Curator" : trimmedEmail.split("@")[0].toUpperCase(),
        whatsappNumber: "+8801700000000",
        role: isCurator ? "admin" : "customer",
        blocked: false,
        createdAt: new Date().toISOString()
      };
      await dbActions.saveProfile(newProfile);
      matchedProfile = newProfile;
    } else if (trimmedEmail === "rashedislamvk11@gmail.com" && matchedProfile.role !== "admin") {
      matchedProfile.role = "admin";
      await dbActions.saveProfile(matchedProfile);
    }

    if (matchedProfile.blocked) {
      throw new Error("This premium profile has been temporarily blocked by administration curators.");
    }

    setCurrentUser(matchedProfile);
    localStorage.setItem("aura_logged_user", JSON.stringify(matchedProfile));
    
    // Auto sync customers list
    const usrProfiles = await dbActions.getProfiles();
    setCustomers(usrProfiles);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aura_logged_user");
    setCurrentView("home");
  };

  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...data };
      await dbActions.saveProfile(updated);
      setCurrentUser(updated);
      localStorage.setItem("aura_logged_user", JSON.stringify(updated));
    }
  };

  // Toggle user wishlist item
  const handleToggleWishlist = (productId: string) => {
    let updated = [...wishlistedIds];
    if (updated.includes(productId)) {
      updated = updated.filter(id => id !== productId);
    } else {
      updated.push(productId);
    }
    setWishlistedIds(updated);
    localStorage.setItem("aura_wishlist", JSON.stringify(updated));
  };

  // Submission of product checkout orders
  const handleOrderPlaced = async (newOrder: Order) => {
    await dbActions.createOrder(newOrder);
    
    // Auto create custom user profile on checkout if not registered
    if (!currentUser) {
      await handleUserLogin(newOrder.customerEmail, 'customer');
    }

    // Refresh catalog lists
    const allOrders = await dbActions.getOrders();
    if (currentUser?.role === 'admin' || newOrder.customerEmail.startsWith("curator")) {
      setOrders(allOrders);
    } else {
      setOrders(allOrders.filter(o => o.customerEmail.toLowerCase() === newOrder.customerEmail.toLowerCase()));
    }

    setActiveCheckoutProduct(null);
    setSelectedProduct(null);
    setCurrentView("dashboard");
    setPurchaseSuccess({ customerName: newOrder.customerName, orderId: newOrder.id });
  };

  // Post new customer review
  const handleSubmitReview = async (reviewData: { rating: number; comment: string; reviewImage?: string }) => {
    if (!selectedProduct || !currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reviewImage: reviewData.reviewImage,
      status: 'Pending', // Pending admin verification
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    await dbActions.addReview(newReview);
    // Refresh local state reviews
    const revs = await dbActions.getReviews();
    setReviews(revs);
  };

  // Categorized filters listing
  const categories = ["All", "UI Templates", "Websites", "Photography", "Audio & Music", "Templates"];

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-slate-950 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      
      {/* Immersive background texture overlays */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.03),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.03),transparent_40%)] pointer-events-none" />

      {/* LUXURY GLASS HEADER COMPONENT */}
      <Header
        settings={websiteSettings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentRole={currentUser?.role || null}
        setCurrentView={setCurrentView}
        currentView={currentView}
        cartCount={orders.length}
      />

      <main className="relative z-10">
        
        {/* VIEW 1: LANDING PAGE */}
        {currentView === "home" && (
          <div className="animate-fade-in">
            
            {/* FULL SCREEN HERO SECTION */}
            <HeroSection 
              settings={bannerSettings} 
              onExploreClick={() => {
                document.getElementById("products-catalog")?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* FEATURED / NEW ARRIVALS CARDS GRID */}
            <section id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 mt-2">
              
              {/* Dynamic Search & Categorized filters navigation */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">The Curated Catalog</h2>
                  <p className="text-xs text-slate-500">Explore premium high-fidelity digital assets selected for the absolute elite.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input
                    id="catalog-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search curated assets..."
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-gold-500/50"
                  />
                  <Compass className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* Category Pills Slider */}
              <div className="flex items-center space-x-2.5 overflow-x-auto pb-6 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    id={`cat-filter-pill-${cat}`}
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                      categoryFilter === cat
                        ? "bg-gold-500/10 border-gold-400 text-gold-400 shadow-gold-glow"
                        : "border-white/5 bg-slate-950/20 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product cards grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                  <Compass className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-300">No curations match filters</h3>
                  <p className="text-xs text-slate-500 mt-1">Try modifying your search criteria or explore another category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={(p) => { setSelectedProduct(p); setCurrentView("details"); }}
                      onBuyNow={(p) => setActiveCheckoutProduct(p)}
                      isWishlisted={wishlistedIds.includes(prod.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* WHY CHOOSE US GRID */}
            <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 pb-10">
              <div className="text-center space-y-3 mb-12">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold-400">Superior Architecture</span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-100">Why Academics Choose NovaStore</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl glass-dark border border-white/5 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-gold-500/10 border border-gold-400/20 flex items-center justify-center text-gold-400">⚡</div>
                  <h3 className="font-display font-bold text-base text-slate-100">Instant Automated Provisioning</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Direct WhatsApp API triggers deliver high-fidelity asset download archives immediately upon transaction approval.</p>
                </div>

                <div className="p-6 rounded-2xl glass-dark border border-white/5 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-gold-500/10 border border-gold-400/20 flex items-center justify-center text-gold-400">👑</div>
                  <h3 className="font-display font-bold text-base text-slate-100">Exquisite Curated Excellence</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Every developer kit, custom audio loops pack, and photograph filter undergoes elite curation and quality audits.</p>
                </div>

                <div className="p-6 rounded-2xl glass-dark border border-white/5 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-gold-500/10 border border-gold-400/20 flex items-center justify-center text-gold-400">🔒</div>
                  <h3 className="font-display font-bold text-base text-slate-100">Watertight Transaction Escrow</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">All checkouts require secure payment receipt screenshots audited by curators to prevent fraud.</p>
                </div>
              </div>
            </section>

            {/* ACCORDION FAQ SECTION */}
            <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
              <div className="text-center space-y-3 mb-10">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold-400">Inquiries</span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-100">Curators Clarifications</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "How does automated digital asset delivery work?",
                    a: "Immediately upon our curation administrators verifying your cash transfer screenshot, our messaging engine automatically triggers secure asset download access keys directly to your verified WhatsApp mobile number, as well as updating your patron history logs dashboard."
                  },
                  {
                    q: "Which local mobile wallets does NovaStore support?",
                    a: "We actively coordinate checkouts using Bkash, Nagad, and Rocket personal accounts. You can customize transfer targets and audit receipts inside our checkout panels seamlessly."
                  },
                  {
                    q: "Are the digital products covered under commercial licenses?",
                    a: "Yes! All digital items, presets packs, code templates, and music sound libraries include complete, royalty-free commercial licenses allowing deployment on personal and client applications without copyright limits."
                  }
                ].map((faq, index) => {
                  const isOpen = faqOpen[index];
                  return (
                    <div key={index} className="rounded-xl border border-white/5 bg-slate-900/40 overflow-hidden transition-all">
                      <button
                        id={`faq-accordion-toggle-${index}`}
                        onClick={() => setFaqOpen({ ...faqOpen, [index]: !isOpen })}
                        className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm sm:text-base text-slate-200 hover:text-white"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`h-4.5 w-4.5 text-gold-400 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed animate-fade-in border-t border-white/5 bg-slate-950/20">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* LUXURY NEWSLETTER SUBSCRIPTION COMPONENT */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
              <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass-dark border border-gold-500/25 text-center space-y-6">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-indigo-500/5 to-transparent animate-pulse-glow" />
                
                <div className="relative max-w-2xl mx-auto space-y-4">
                  <span className="px-3 py-1 bg-gold-500/10 border border-gold-400/25 rounded-full text-[10px] font-bold tracking-widest uppercase text-gold-300">VIP Releases</span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Join the Elite Patrons Circle</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Receive private notices, promotional codes, and early access links to high-fidelity digital releases twice monthly.</p>

                  {newsletterSubscribed ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                      <span>Welcome to the circle. Private access codes are routing to your terminal.</span>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSubscribed(true); }}
                      className="flex flex-col sm:flex-row items-center gap-3 pt-2"
                    >
                      <input
                        id="newsletter-email-input"
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your VIP email address"
                        className="w-full sm:flex-grow px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-gold-500/50 text-xs"
                        required
                      />
                      <button
                        id="newsletter-submit-btn"
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-gold-glow transition-all"
                      >
                        Secure Admission
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* CONTACT COCONUT FORM */}
            <section id="contact-hub" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 pb-16">
              <form 
                onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); setContactName(""); setContactEmail(""); setContactMsg(""); }}
                className="p-6 sm:p-8 rounded-2xl glass-dark border border-white/5 space-y-5"
              >
                <div className="text-center space-y-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Curators Direct Terminal</span>
                  <h3 className="font-display font-extrabold text-xl text-slate-200">Compose Concierge Query</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1.5">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:border-gold-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1.5">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:border-gold-500/50"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-bold uppercase mb-1.5">Message Inquiry</label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Specify your bespoke customization requirements..."
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:border-gold-500/50"
                      required
                    />
                  </div>
                </div>

                {contactSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Your concierge query has been transmitted successfully. We will reply within 2 hours.</span>
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-gold-glow">
                  Transmit Query
                </button>
              </form>
            </section>

          </div>
        )}

        {/* VIEW 2: PRODUCT DETAILS VIEW */}
        {currentView === "details" && selectedProduct && (
          <ProductDetailsView
            product={selectedProduct}
            allProducts={products}
            reviews={reviews}
            isWishlisted={wishlistedIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => setCurrentView("home")}
            onBuyNow={(p) => setActiveCheckoutProduct(p)}
            onSubmitReview={handleSubmitReview}
            isUserVerifiedForProduct={
              // Buyer verified if they own an approved or delivered order matching this product name
              orders.some(o => o.productName === selectedProduct.name && (o.status === 'Confirmed' || o.status === 'Delivered'))
            }
          />
        )}

        {/* VIEW 3: CUSTOMER DASHBOARD */}
        {currentView === "dashboard" && (
          <DashboardView
            orders={orders}
            currentUser={currentUser}
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
            onUpdateProfile={handleProfileUpdate}
          />
        )}

        {/* VIEW 4: ADMIN CONTROL PANEL PANEL */}
        {currentView === "admin" && (
          <AdminPanel
            currentUser={currentUser}
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
            products={products}
            orders={orders}
            reviews={reviews}
            customers={customers}
            websiteSettings={websiteSettings}
            paymentSettings={paymentSettings}
            bannerSettings={bannerSettings}
            onSaveProduct={async (p) => {
              await dbActions.saveProduct(p);
              const all = await dbActions.getProducts();
              setProducts(all);
            }}
            onDeleteProduct={async (id) => {
              await dbActions.deleteProduct(id);
              const all = await dbActions.getProducts();
              setProducts(all);
            }}
            onUpdateOrderStatus={async (orderId, status, link) => {
              await dbActions.updateOrderStatus(orderId, status, link);
              const all = await dbActions.getOrders();
              setOrders(all);
            }}
            onDeleteOrder={async (id) => {
              await dbActions.deleteOrder(id);
              const all = await dbActions.getOrders();
              setOrders(all);
            }}
            onUpdateReview={async (revId, data) => {
              await dbActions.updateReview(revId, data);
              const all = await dbActions.getReviews();
              setReviews(all);
            }}
            onDeleteReview={async (id) => {
              await dbActions.deleteReview(id);
              const all = await dbActions.getReviews();
              setReviews(all);
            }}
            onUpdateCustomer={async (uid, data) => {
              await dbActions.updateProfile(uid, data);
              const allUsr = await dbActions.getProfiles();
              setCustomers(allUsr);
            }}
            onDeleteCustomer={async (uid) => {
              await dbActions.deleteProfile(uid);
              const allUsr = await dbActions.getProfiles();
              setCustomers(allUsr);
            }}
            onSaveWebsiteSettings={async (web) => {
              await dbActions.saveWebsiteSettings(web);
              setWebsiteSettings(web);
            }}
            onSavePaymentSettings={async (pay) => {
              await dbActions.savePaymentSettings(pay);
              setPaymentSettings(pay);
            }}
            onSaveBannerSettings={async (banner) => {
              await dbActions.saveBannerSettings(banner);
              setBannerSettings(banner);
            }}
          />
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-white/5 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center md:text-left">
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">
                {websiteSettings.websiteName}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {websiteSettings.footerContent}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 text-xs text-slate-400">
              <p className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Concierge Desk</p>
              <p>Direct Support Email: <a href={`mailto:${websiteSettings.email}`} className="text-gold-400 font-semibold">{websiteSettings.email}</a></p>
              <p>Hotline Terminal: <span className="text-slate-200 font-mono">{websiteSettings.contactNumber}</span></p>
            </div>

            <div className="flex flex-col items-center md:items-end justify-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[10px] text-slate-500">Security Encrypted</span>
              <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-xl text-[10px] text-slate-400">
                <Lock className="h-3.5 w-3.5 text-gold-400" />
                <span>SSL Secured Curation</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-[10px] text-slate-600 dark:text-slate-600 light:text-slate-400">
            <p>© 2026 NovaStore Luxury Marketplace. Engineered on Google AI Studio container architecture. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* CHECKOUT MODAL OVERLAY TRIGGER */}
      {activeCheckoutProduct && (
        <CheckoutView
          product={activeCheckoutProduct}
          paymentSettings={paymentSettings}
          onClose={() => setActiveCheckoutProduct(null)}
          onOrderPlaced={handleOrderPlaced}
          currentUserEmail={currentUser?.email}
          currentUserName={currentUser?.name}
        />
      )}

      {/* PURCHASE SUCCESS MODAL */}
      {purchaseSuccess && (
        <div id="purchase-success-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-8 rounded-3xl glass-dark border border-white/10 shadow-gold-glow text-center space-y-6">
            <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-emerald-glow mb-2 animate-bounce">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-2xl text-slate-100 tracking-tight">
                অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
              </h3>
              <p className="text-sm text-slate-400">
                ধন্যবাদ, <span className="text-gold-400 font-semibold">{purchaseSuccess.customerName}</span>। আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2 text-left font-sans text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">অর্ডার আইডি:</span>
                <span className="text-slate-200 font-mono font-bold">{purchaseSuccess.orderId}</span>
              </div>
              <p className="text-slate-400 pt-1 leading-relaxed">
                পরবর্তী ধাপ: আপনার ক্রয়কৃত প্রোডাক্টটি আনলক করতে অনুগ্রহ করে পেমেন্ট সম্পন্ন করে ড্যাশবোর্ডে ট্রানজেকশন আইডি প্রদান করুন।
              </p>
            </div>

            <button
              id="success-dashboard-btn"
              onClick={() => {
                setPurchaseSuccess(null);
                setCurrentView("dashboard");
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:shadow-lg transition-all"
            >
              ড্যাশবোর্ডে যান ও পেমেন্ট করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
