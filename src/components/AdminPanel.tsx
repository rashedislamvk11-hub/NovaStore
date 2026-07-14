import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Layers, 
  Sliders, 
  CreditCard, 
  Settings as SettingsIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Search, 
  UserX, 
  UserCheck, 
  MessageSquare, 
  AlertCircle,
  FileImage,
  Send,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Product, 
  Order, 
  Review, 
  UserProfile, 
  WebsiteSettings, 
  PaymentSettings, 
  BannerSettings 
} from "../types";

interface AdminPanelProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, roleOverride?: 'customer' | 'admin', password?: string) => Promise<void>;
  onLogout: () => void;
  products: Product[];
  orders: Order[];
  reviews: Review[];
  customers: UserProfile[];
  websiteSettings: WebsiteSettings;
  paymentSettings: PaymentSettings;
  bannerSettings: BannerSettings;
  
  onSaveProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], downloadLink?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateReview: (reviewId: string, updates: Partial<Review>) => void;
  onDeleteReview: (reviewId: string) => void;
  onUpdateCustomer: (uid: string, data: Partial<UserProfile>) => void;
  onDeleteCustomer: (uid: string) => void;
  onSaveWebsiteSettings: (s: WebsiteSettings) => void;
  onSavePaymentSettings: (p: PaymentSettings) => void;
  onSaveBannerSettings: (b: BannerSettings) => void;
}

export default function AdminPanel({
  currentUser,
  onLogin,
  onLogout,
  products,
  orders,
  reviews,
  customers,
  websiteSettings,
  paymentSettings,
  bannerSettings,
  onSaveProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateReview,
  onDeleteReview,
  onUpdateCustomer,
  onDeleteCustomer,
  onSaveWebsiteSettings,
  onSavePaymentSettings,
  onSaveBannerSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'products' | 'orders' | 'customers' | 'reviews' | 'customizer'>('overview');
  
  // Admin local login state
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) return;
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await onLogin(adminEmail.trim(), 'admin', adminPassword);
    } catch (err: any) {
      setLoginError("লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Products Management state
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  const [prodName, setProdName] = React.useState("");
  const [prodDesc, setProdDesc] = React.useState("");
  const [prodPrice, setProdPrice] = React.useState(0);
  const [prodSalePrice, setProdSalePrice] = React.useState(0);
  const [prodCategory, setProdCategory] = React.useState("");
  const [prodImage, setProdImage] = React.useState("");
  const [prodGallery, setProdGallery] = React.useState<string[]>([]);
  const [prodDemoVideo, setProdDemoVideo] = React.useState("");
  const [prodDownload, setProdDownload] = React.useState("");
  const [prodTags, setProdTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [featureInput, setFeatureInput] = React.useState("");
  const [prodFeatures, setProdFeatures] = React.useState<string[]>([]);

  // Search filter
  const [customerSearch, setCustomerSearch] = React.useState("");
  
  // Customizer form state
  const [customWebSettings, setCustomWebSettings] = React.useState<WebsiteSettings>({ ...websiteSettings });
  const [customPaySettings, setCustomPaySettings] = React.useState<PaymentSettings>({ ...paymentSettings });
  const [customBannerSettings, setCustomBannerSettings] = React.useState<BannerSettings>({ ...bannerSettings });

  // Form success indicators
  const [saveWebSuccess, setSaveWebSuccess] = React.useState(false);
  const [savePaySuccess, setSavePaySuccess] = React.useState(false);
  const [saveBannerSuccess, setSaveBannerSuccess] = React.useState(false);
  const [logoUploadError, setLogoUploadError] = React.useState("");

  React.useEffect(() => {
    setCustomWebSettings({ ...websiteSettings });
  }, [websiteSettings]);

  React.useEffect(() => {
    setCustomPaySettings({ ...paymentSettings });
  }, [paymentSettings]);

  React.useEffect(() => {
    setCustomBannerSettings({ ...bannerSettings });
  }, [bannerSettings]);

  // Reviews replies state
  const [replyText, setReplyText] = React.useState<{ [key: string]: string }>({});
  const [repliedReviewId, setRepliedReviewId] = React.useState<string | null>(null);

  // Calculations for KPI Cards
  const totalSalesVal = orders.filter(o => o.status === 'Confirmed' || o.status === 'Delivered').reduce((sum, o) => sum + o.price, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  
  // Recharts Chart Data Mock (Daily aggregates)
  const revenueChartData = [
    { name: "Mon", sales: totalSalesVal * 0.1 || 120 },
    { name: "Tue", sales: totalSalesVal * 0.15 || 180 },
    { name: "Wed", sales: totalSalesVal * 0.12 || 140 },
    { name: "Thu", sales: totalSalesVal * 0.22 || 260 },
    { name: "Fri", sales: totalSalesVal * 0.25 || 310 },
    { name: "Sat", sales: totalSalesVal * 0.35 || 420 },
    { name: "Sun", sales: totalSalesVal || 500 }
  ];

  // Helper: Open whatsapp delivery message
  const triggerWhatsAppAutomaticDelivery = (order: Order) => {
    const formattedNum = order.whatsappNumber.replace(/[\s\+\-]/g, "");
    
    const message = `👑 *NovaStore PREMIUM ACCESS GRANTED* 👑\n\nDear ${order.customerName},\n\nWe have verified your payment for the premium digital asset: *${order.productName}*.\n\n*INSTRUCTIONS FOR DOWNLOAD:*\n1. Click the download button in your customer dashboard.\n2. Or download directly via this private elite link:\n   ${order.downloadLink || "https://novastore.com/dashboard"}\n\n*Thank you for acquiring our luxury assets.*\n\nBest Regards,\nCurator, NovaStore Marketplace`;
    
    const waUrl = `https://wa.me/${formattedNum}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // Sync settings inputs when loaded
  React.useEffect(() => {
    setCustomWebSettings({ ...websiteSettings });
    setCustomPaySettings({ ...paymentSettings });
    setCustomBannerSettings({ ...bannerSettings });
  }, [websiteSettings, paymentSettings, bannerSettings]);

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: prodName,
      description: prodDesc,
      features: prodFeatures,
      price: Number(prodPrice),
      salePrice: Number(prodSalePrice),
      category: prodCategory,
      image: prodImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      gallery: prodGallery.length > 0 ? prodGallery : [prodImage],
      demoVideo: prodDemoVideo,
      downloadLink: prodDownload,
      tags: prodTags,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 0,
      isFeatured: editingProduct?.isFeatured || false,
      isNewArrival: editingProduct?.isNewArrival || true,
      isBestSeller: editingProduct?.isBestSeller || false
    };
    onSaveProduct(newProd);
    resetProductForm();
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsAddingProduct(true);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdSalePrice(p.salePrice);
    setProdCategory(p.category);
    setProdImage(p.image);
    setProdGallery(p.gallery);
    setProdDemoVideo(p.demoVideo || "");
    setProdDownload(p.downloadLink);
    setProdTags(p.tags);
    setProdFeatures(p.features);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setProdName("");
    setProdDesc("");
    setProdPrice(0);
    setProdSalePrice(0);
    setProdCategory("");
    setProdImage("");
    setProdGallery([]);
    setProdDemoVideo("");
    setProdDownload("");
    setProdTags([]);
    setProdFeatures([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !prodTags.includes(tagInput.trim())) {
      setProdTags([...prodTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !prodFeatures.includes(featureInput.trim())) {
      setProdFeatures([...prodFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl glass-dark border border-red-500/20 font-sans shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-block p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3 text-3xl">
            🛡️
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100">অ্যাডমিন প্যানেল লগইন</h2>
          <p className="text-xs text-slate-400 mt-2">পণ্য পরিবর্তন এবং অর্ডার ভেরিফাই করতে লগইন করুন</p>
        </div>

        <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">অ্যাডমিন ইমেইল</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:border-red-500 text-sm focus:outline-none"
              placeholder="যেমন: rashedislamvk11@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">সিকিউরিটি কি / পাসওয়ার্ড</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-slate-200 focus:border-red-500 text-sm focus:outline-none"
              placeholder="যেমন: Rashed@700"
              required
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-400 text-center font-semibold">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            {isLoggingIn ? "লগইন করা হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="h-px bg-white/5 w-1/3" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ঝটপট অ্যাডমিন ডেমো</span>
          <span className="h-px bg-white/5 w-1/3" />
        </div>

        <button
          type="button"
          onClick={() => onLogin("rashedislamvk11@gmail.com", "admin", "Rashed@700")}
          className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold tracking-wide transition-all text-center"
        >
          অ্যাডমিন ডেমো লগইন করুন (rashedislamvk11@gmail.com)
        </button>
      </div>
    );
  }

  return (
    <div id="admin-workspace-grid" className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-100 tracking-tight flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">🛡️</span>
            <span>NovaStore এডমিন কন্ট্রোল</span>
          </h1>
          <p className="text-xs text-slate-400">প্রোডাক্ট যোগ করুন, পেমেন্ট ও অর্ডার ভেরিফাই করুন, হোয়াটসঅ্যাপ ডেলিভারি ও রসিদ কন্ট্রোল করুন।</p>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {([
            { id: 'overview', label: 'ওভারভিউ' },
            { id: 'products', label: 'প্রোডাক্ট' },
            { id: 'orders', label: 'অর্ডার' },
            { id: 'customers', label: 'গ্রাহক' },
            { id: 'reviews', label: 'রিভিউ' },
            { id: 'customizer', label: 'সেটিংস' }
          ] as const).map((tab) => (
            <button
              id={`tab-${tab.id}-btn`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase border transition-all ${
                activeTab === tab.id
                  ? "bg-red-500/15 border-red-500 text-red-400 shadow-md"
                  : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Widgets Row */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl glass-dark border border-white/5 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">মোট বিক্রয়</span>
            <h3 className="font-display font-extrabold text-2xl text-gold-400 mt-1">৳{totalSalesVal}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">সফল লেনদেন</span>
          </div>

          <div className="p-5 rounded-2xl glass-dark border border-white/5 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">মোট অর্ডার</span>
            <h3 className="font-display font-extrabold text-2xl text-amber-400 mt-1">{orders.length}</h3>
            <span className="text-[10px] text-amber-500 block mt-1">{pendingOrdersCount} টি পেন্ডিং পেমেন্ট ভেরিফিকেশন</span>
          </div>

          <div className="p-5 rounded-2xl glass-dark border border-white/5 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">মোট কাস্টমার</span>
            <h3 className="font-display font-extrabold text-2xl text-indigo-400 mt-1">{customers.length}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">নিবন্ধিত মেম্বার</span>
          </div>

          <div className="p-5 rounded-2xl glass-dark border border-white/5 relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">ডেলিভারি সম্পন্ন</span>
            <h3 className="font-display font-extrabold text-2xl text-emerald-400 mt-1">{deliveredOrdersCount}</h3>
            <span className="text-[10px] text-emerald-500 block mt-1">সফলভাবে ডেলিভারি হয়েছে</span>
          </div>
        </div>
      )}

      {/* WORKSPACE AREA */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
          
          {/* Revenue Analytics Graph */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-dark border border-white/5">
            <h3 className="font-display font-bold text-lg text-slate-100 mb-5">বিক্রয় ও আর্থিক গ্রাফ বিশ্লেষণ</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.08)" }} 
                    labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Logs Feed */}
          <div className="p-6 rounded-2xl glass-dark border border-white/5">
            <h3 className="font-display font-bold text-lg text-slate-100 mb-5">সাম্প্রতিক কার্যক্রম</h3>
            <div className="space-y-4 max-h-[260px] overflow-y-auto">
              {orders.length === 0 ? (
                <p className="text-xs text-slate-500">এখনো কোনো কার্যক্রম বা অর্ডার রেকর্ড করা হয়নি।</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="flex items-start space-x-3 text-xs border-b border-white/5 pb-3">
                    <div className="p-1 bg-white/5 rounded-md text-[10px] font-mono text-gold-400">TXN</div>
                    <div>
                      <p className="text-slate-300 font-semibold">{ord.customerName} - {ord.productName} অর্ডার করেছেন</p>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">রেফারেন্স: {ord.id.slice(0, 10)} • {ord.status === 'Pending' ? 'পেন্ডিং' : ord.status === 'Paid' ? 'পেইড' : ord.status === 'Confirmed' ? 'কনফার্মড' : 'ডেলিভারড'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* PRODUCTS CONFIG TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-950/20 p-4 rounded-xl border border-white/5">
            <span className="text-sm font-semibold text-slate-300">মার্কেটপ্লেস ক্যাটালগ ({products.length} টি পণ্য)</span>
            <button
              id="add-product-btn"
              onClick={() => { resetProductForm(); setIsAddingProduct(true); }}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-700 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন প্রোডাক্ট যোগ করুন</span>
            </button>
          </div>

          {isAddingProduct ? (
            <form onSubmit={handleSaveProductForm} className="p-6 rounded-2xl glass-dark border border-red-500/20 space-y-6 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-200">
                {editingProduct ? "প্রোডাক্ট সংশোধন করুন" : "নতুন প্রোডাক্ট যুক্ত করুন"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">প্রোডাক্টের নাম</label>
                  <input
                    id="form-product-name"
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">প্রধান প্রদর্শন চিত্র (Showcase Image)</label>
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                    <input
                      id="form-product-image"
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="flex-grow px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="ছবির ইউআরএল অথবা ফাইল আপলোড করুন..."
                    />
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl cursor-pointer hover:bg-slate-900/80 transition-colors shrink-0">
                      <FileImage className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ফাইল আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProdImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {prodImage && (
                    <div className="mt-2 flex items-center space-x-3 bg-slate-900/50 p-2 rounded-xl border border-white/5 max-w-fit">
                      <img src={prodImage} className="h-10 w-10 object-cover rounded-lg" alt="Preview" />
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{prodImage.startsWith("data:") ? "আপলোড করা ছবি" : prodImage}</span>
                      <button type="button" onClick={() => setProdImage("")} className="text-red-400 hover:text-red-300 text-xs font-semibold px-2">মুছে ফেলুন</button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">বিস্তারিত বিবরণ (Description)</label>
                  <textarea
                    id="form-product-desc"
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">পূর্বের মূল্য (টাকা ৳)</label>
                  <input
                    id="form-product-price"
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">বিক্রয় মূল্য (টাকা ৳)</label>
                  <input
                    id="form-product-saleprice"
                    type="number"
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">ডিজিটাল ক্যাটাগরি</label>
                  <input
                    id="form-product-category"
                    type="text"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                    placeholder="যেমন: UI Templates, Photography, Audio..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">ফাইল ডাউনলোড করার সরাসরি লিঙ্ক (Google Drive/Mega Link)</label>
                  <input
                    id="form-product-download"
                    type="text"
                    value={prodDownload}
                    onChange={(e) => setProdDownload(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm font-mono"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                </div>

                {/* Tags management */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">কাস্টম ট্যাগ সমূহ</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="যেমন: React, Next.js"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {prodTags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded-md flex items-center space-x-1.5">
                        <span>{tag}</span>
                        <X className="h-3 w-3 text-red-400 cursor-pointer" onClick={() => setProdTags(prodTags.filter(t => t !== tag))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bullet features */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">প্রধান ফিচার সমূহ (চেকলিস্ট)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="flex-grow px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="যেমন: ১৫+ রেডি-মেড স্ক্রিন"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {prodFeatures.map(feat => (
                      <div key={feat} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-slate-300 text-xs">
                        <span>{feat}</span>
                        <X className="h-3 w-3 text-red-400 cursor-pointer" onClick={() => setProdFeatures(prodFeatures.filter(f => f !== feat))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 justify-end pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={resetProductForm}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase text-slate-300"
                >
                  বাতিল করুন
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase shadow-lg"
                >
                  {editingProduct ? "পরিবর্তন সংরক্ষণ করুন" : "প্রোডাক্ট পাবলিশ করুন"}
                </button>
              </div>
            </form>
          ) : (
            /* PRODUCTS DIRECTORY TABLE */
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-950/40 text-slate-400 font-mono text-[10px] uppercase border-b border-white/5">
                  <tr>
                    <th className="p-4">প্রোডাক্টের ছবি ও নাম</th>
                    <th className="p-4">ক্যাটাগরি</th>
                    <th className="p-4 text-right">পূর্বের মূল্য</th>
                    <th className="p-4 text-right">বিক্রয় মূল্য</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 flex items-center space-x-3">
                        <img src={p.image} className="h-12 w-12 object-cover rounded-lg border border-white/10" />
                        <div>
                          <p className="font-bold text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">আইডি: {p.id}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-medium">{p.category}</td>
                      <td className="p-4 text-right font-mono">৳{p.price}</td>
                      <td className="p-4 text-right font-mono font-bold text-gold-400">৳{p.salePrice}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            id={`edit-prod-${p.id}`}
                            onClick={() => startEditProduct(p)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            id={`delete-prod-${p.id}`}
                            onClick={() => { if(confirm("আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি মার্কেটপ্লেস থেকে মুছে ফেলতে চান?")) onDeleteProduct(p.id); }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ORDERS LIFE MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <h3 className="font-display font-bold text-lg text-slate-200">চেকআউট ট্রানজেকশন তালিকা</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-10 text-center">কোনো অর্ডার এখনো ট্রানজেকশন তালিকায় জমা হয়নি।</p>
          ) : (
            <div className="space-y-5">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl glass-dark border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-3">
                      <img src={ord.productImage} className="h-10 w-10 object-cover rounded-md" />
                      <div>
                        <h4 className="font-display font-bold text-slate-100">{ord.productName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">আইডি: {ord.id} • {ord.paymentMethod} • মূল্য: {ord.price} টাকা</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">স্ট্যাটাস: {ord.status === 'Pending' ? 'পেন্ডিং' : ord.status === 'Paid' ? 'পেইড' : ord.status === 'Confirmed' ? 'কনফার্মড' : 'ডেলিভারড'}</span>
                      <button
                        id={`delete-order-${ord.id}`}
                        onClick={() => { if(confirm("অর্ডারটি মুছে ফেলতে চান?")) onDeleteOrder(ord.id); }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                    <div>
                      <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1">গ্রাহকের তথ্য</h5>
                      <p className="font-bold text-slate-200">{ord.customerName}</p>
                      <p className="text-slate-400">{ord.customerEmail}</p>
                      <p className="text-slate-400 font-mono">{ord.whatsappNumber}</p>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1">পেমেন্ট ভেরিফিকেশন</h5>
                      <p className="font-mono text-slate-200">ট্রানজেকশন আইডি (TxID): {ord.transactionId}</p>
                      {ord.paymentScreenshot && (
                        <a 
                          href={ord.paymentScreenshot} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-1.5 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                          <FileImage className="h-3.5 w-3.5 text-gold-400" />
                          <span>পেমেন্ট স্ক্রিনশট / রসিদ</span>
                        </a>
                      )}
                    </div>

                    {/* Operational controls */}
                    <div className="flex flex-col space-y-2 justify-center">
                      <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-1">স্ট্যাটাস কন্ট্রোল</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {ord.status === 'Pending' && (
                          <button
                            id={`approve-order-btn-${ord.id}`}
                            onClick={() => onUpdateOrderStatus(ord.id, 'Paid')}
                            className="py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-[10px] uppercase"
                          >
                            পেমেন্ট অ্যাপ্রুভ করুন
                          </button>
                        )}
                        {(ord.status === 'Pending' || ord.status === 'Paid') && (
                          <button
                            id={`confirm-order-btn-${ord.id}`}
                            onClick={() => {
                              onUpdateOrderStatus(ord.id, 'Confirmed', products.find(p => p.name === ord.productName)?.downloadLink);
                            }}
                            className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] uppercase"
                          >
                            অर्डर কনফার্ম করুন
                          </button>
                        )}
                        {(ord.status === 'Confirmed' || ord.status === 'Delivered') && (
                          <button
                            id={`whatsapp-delivery-btn-${ord.id}`}
                            onClick={() => triggerWhatsAppAutomaticDelivery(ord)}
                            className="py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] uppercase flex items-center justify-center space-x-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>হোয়াটসঅ্যাপ মেসেজ</span>
                          </button>
                        )}
                        {ord.status !== 'Delivered' && (
                          <button
                            id={`deliver-order-btn-${ord.id}`}
                            onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                            className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] uppercase"
                          >
                            ডেলিভারি সম্পন্ন করুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PATRONS/CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between bg-slate-950/20 p-4 rounded-xl border border-white/5">
            <h3 className="font-display font-bold text-base text-slate-200">নিবন্ধিত গ্রাহকদের তালিকা</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                id="customer-search-input"
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="গ্রাহকদের খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 rounded-xl border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/40 text-slate-400 font-mono text-[10px] uppercase border-b border-white/5">
                <tr>
                  <th className="p-4">গ্রাহক</th>
                  <th className="p-4">হোয়াটসঅ্যাপ নম্বর</th>
                  <th className="p-4">অবস্থা</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {customers
                  .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()))
                  .map(cust => (
                    <tr key={cust.uid} className="hover:bg-white/[0.01]">
                      <td className="p-4">
                        <p className="font-bold text-slate-100">{cust.name}</p>
                        <p className="text-slate-500 font-mono">{cust.email}</p>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{cust.whatsappNumber || "N/A"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${cust.blocked ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                          {cust.blocked ? 'ব্লকড' : 'সক্রিয়'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            id={`block-customer-${cust.uid}`}
                            onClick={() => onUpdateCustomer(cust.uid, { blocked: !cust.blocked })}
                            className={`p-1.5 rounded-lg border transition-colors ${cust.blocked ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10'}`}
                            title={cust.blocked ? "আনব্লক করুন" : "ব্লক করুন"}
                          >
                            {cust.blocked ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                          </button>
                          <button
                            id={`delete-customer-${cust.uid}`}
                            onClick={() => { if(confirm("আপনি কি নিশ্চিতভাবে এই গ্রাহকের প্রোফাইলটি চিরতরে মুছে ফেলতে চান?")) onDeleteCustomer(cust.uid); }}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS MODERATION TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-display font-bold text-lg text-slate-200">গ্রাহকদের মতামত ও রিভিউ মডারেশন</h3>
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">কোনো রিভিউ সাবমিট করা হয়নি।</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 rounded-2xl glass-dark border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-200">{rev.userName} <span className="text-[10px] text-slate-500 font-mono">({rev.userEmail})</span></h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">প্রোডাক্ট আইডি: {rev.productId}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${rev.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
                        {rev.status === 'Approved' ? 'অনুমোদিত' : 'পেন্ডিং'}
                      </span>
                      {rev.status === 'Pending' && (
                        <button
                          id={`approve-review-${rev.id}`}
                          onClick={() => onUpdateReview(rev.id, { status: 'Approved' })}
                          className="p-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-600/20"
                          title="রিভিউ অনুমোদন করুন"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        id={`delete-review-${rev.id}`}
                        onClick={() => onDeleteReview(rev.id)}
                        className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

                  {/* Inline reply submission */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">অ্যাডমিন উত্তর</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyText[rev.id] || rev.reply || ""}
                        onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                        placeholder="উত্তরের কথাগুলো লিখুন..."
                        className="flex-grow px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none"
                      />
                      <button
                        id={`submit-reply-${rev.id}`}
                        onClick={() => {
                          onUpdateReview(rev.id, { reply: replyText[rev.id] || "" });
                          setRepliedReviewId(rev.id);
                          setTimeout(() => setRepliedReviewId(null), 3000);
                        }}
                        className={`px-4 py-1.5 border rounded-xl text-xs font-semibold transition-all ${
                          repliedReviewId === rev.id 
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                        }`}
                      >
                        {repliedReviewId === rev.id ? "পোস্ট হয়েছে ✓" : "পোস্ট করুন"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WEB CUSTOMIZER TAB */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          
          {/* General settings form */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              onSaveWebsiteSettings(customWebSettings); 
              setSaveWebSuccess(true);
              setTimeout(() => setSaveWebSuccess(false), 4000);
            }} 
            className="p-6 rounded-2xl glass-dark border border-white/5 space-y-5"
          >
            <h3 className="font-display font-bold text-lg text-slate-200">সাধারণ ব্রান্ড ইনফরমেশন</h3>

            {saveWebSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-pulse">
                ✓ সাধারণ সেটিংস ও ব্রান্ড ইনফরমেশন সফলভাবে সংরক্ষণ করা হয়েছে!
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">মার্কেটপ্লেস লোগো টেক্সট</label>
                <input
                  type="text"
                  value={customWebSettings.websiteName}
                  onChange={(e) => setCustomWebSettings({ ...customWebSettings, websiteName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">মার্কেটপ্লেস লোগো (টেক্সট, ইমোজি অথবা ছবি)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customWebSettings.websiteLogo}
                    onChange={(e) => setCustomWebSettings({ ...customWebSettings, websiteLogo: e.target.value })}
                    placeholder="যেমন: 👑 NovaStore"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                  />
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 cursor-pointer transition-all">
                      <FileImage className="h-4 w-4 text-gold-400" />
                      <span className="text-[10px] font-bold uppercase">লোগো ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setLogoUploadError("লোগোর সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                              setTimeout(() => setLogoUploadError(""), 4000);
                              return;
                            }
                            setLogoUploadError("");
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomWebSettings({ ...customWebSettings, websiteLogo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {logoUploadError && (
                      <p className="text-[11px] text-red-400 font-semibold animate-pulse">⚠️ {logoUploadError}</p>
                    )}
                    {customWebSettings.websiteLogo && (
                      <button
                        type="button"
                        onClick={() => setCustomWebSettings({ ...customWebSettings, websiteLogo: "" })}
                        className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-[10px] font-bold uppercase transition-all"
                      >
                        লোগো মুছে ফেলুন
                      </button>
                    )}
                  </div>
                  {customWebSettings.websiteLogo && (customWebSettings.websiteLogo.startsWith("data:") || customWebSettings.websiteLogo.startsWith("http")) && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-white/5 inline-block">
                      <p className="text-[10px] text-slate-500 uppercase mb-1.5 font-bold">লোগো প্রিভিউ:</p>
                      <img src={customWebSettings.websiteLogo} alt="Logo Preview" className="h-10 w-auto object-contain max-w-[150px]" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">গ্রাহক সাপোর্ট ইমেইল</label>
                <input
                  type="email"
                  value={customWebSettings.email}
                  onChange={(e) => setCustomWebSettings({ ...customWebSettings, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">হটলাইন সাপোর্ট নম্বর (Hotline Phone)</label>
                <input
                  type="text"
                  value={customWebSettings.contactNumber || ""}
                  onChange={(e) => setCustomWebSettings({ ...customWebSettings, contactNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">হোয়াটসঅ্যাপ হেল্পলাইন নম্বর</label>
                <input
                  type="text"
                  value={customWebSettings.whatsappNumber}
                  onChange={(e) => setCustomWebSettings({ ...customWebSettings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">ফুটার কপিরাইট টেক্সট</label>
                <textarea
                  rows={2}
                  value={customWebSettings.footerContent}
                  onChange={(e) => setCustomWebSettings({ ...customWebSettings, footerContent: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide">
              ব্রান্ড আইডেন্টিটি আপডেট করুন
            </button>
          </form>

          {/* Payment gateways form */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              onSavePaymentSettings(customPaySettings); 
              setSavePaySuccess(true);
              setTimeout(() => setSavePaySuccess(false), 4000);
            }}
            className="p-6 rounded-2xl glass-dark border border-white/5 space-y-5"
          >
            <h3 className="font-display font-bold text-lg text-slate-200">পেমেন্ট গেটওয়ে সেটিংস</h3>

            {savePaySuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-pulse">
                ✓ পেমেন্ট অ্যাকাউন্ট সফলভাবে আপডেট করা হয়েছে!
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">বিকাশ (bKash) পার্সোনাল/মার্চেন্ট নম্বর</label>
                <input
                  type="text"
                  value={customPaySettings.bkashNumber}
                  onChange={(e) => setCustomPaySettings({ ...customPaySettings, bkashNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
                <div className="mt-2 flex items-center space-x-3">
                  {customPaySettings.bkashImage && (
                    <img src={customPaySettings.bkashImage} className="h-10 w-16 object-contain rounded-lg border border-white/10 bg-slate-950" />
                  )}
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 text-center transition-all text-[11px] font-semibold">
                    <span>বিকাশ লোগো আপলোড</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("লোগোর সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCustomPaySettings({ ...customPaySettings, bkashImage: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {customPaySettings.bkashImage && (
                    <button
                      type="button"
                      onClick={() => setCustomPaySettings({ ...customPaySettings, bkashImage: "" })}
                      className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">নগদ (Nagad) পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  value={customPaySettings.nagadNumber}
                  onChange={(e) => setCustomPaySettings({ ...customPaySettings, nagadNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
                <div className="mt-2 flex items-center space-x-3">
                  {customPaySettings.nagadImage && (
                    <img src={customPaySettings.nagadImage} className="h-10 w-16 object-contain rounded-lg border border-white/10 bg-slate-950" />
                  )}
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 text-center transition-all text-[11px] font-semibold">
                    <span>নগদ লোগো আপলোড</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("লোগোর সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCustomPaySettings({ ...customPaySettings, nagadImage: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {customPaySettings.nagadImage && (
                    <button
                      type="button"
                      onClick={() => setCustomPaySettings({ ...customPaySettings, nagadImage: "" })}
                      className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">রকেট (Rocket) পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  value={customPaySettings.rocketNumber}
                  onChange={(e) => setCustomPaySettings({ ...customPaySettings, rocketNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
                <div className="mt-2 flex items-center space-x-3">
                  {customPaySettings.rocketImage && (
                    <img src={customPaySettings.rocketImage} className="h-10 w-16 object-contain rounded-lg border border-white/10 bg-slate-950" />
                  )}
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 text-center transition-all text-[11px] font-semibold">
                    <span>রকেট লোগো আপলোড</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("লোগোর সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCustomPaySettings({ ...customPaySettings, rocketImage: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {customPaySettings.rocketImage && (
                    <button
                      type="button"
                      onClick={() => setCustomPaySettings({ ...customPaySettings, rocketImage: "" })}
                      className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide">
              পেমেন্ট তথ্য আপডেট করুন
            </button>
          </form>

          {/* Banner Customize Form */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              onSaveBannerSettings(customBannerSettings); 
              setSaveBannerSuccess(true);
              setTimeout(() => setSaveBannerSuccess(false), 4000);
            }}
            className="p-6 rounded-2xl glass-dark border border-white/5 space-y-5 lg:col-span-2"
          >
            <h3 className="font-display font-bold text-lg text-slate-200">হিরো ব্যানার এবং হেডলাইন স্লাইডার সেটিংস</h3>

            {saveBannerSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-pulse">
                ✓ হিরো ব্যানার লেআউট ও হেডলাইন সফলভাবে আপডেট করা হয়েছে!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">ইন্টারেক্টিভ ভিডিও ব্যানার লিংক (URL)</label>
                <input
                  type="text"
                  value={customBannerSettings.videoBannerUrl}
                  onChange={(e) => setCustomBannerSettings({ ...customBannerSettings, videoBannerUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">লোটি (Lottie) অ্যানিমেশন ফাইল লিংক (JSON URL)</label>
                <input
                  type="text"
                  value={customBannerSettings.lottieAnimationUrl}
                  onChange={(e) => setCustomBannerSettings({ ...customBannerSettings, lottieAnimationUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold uppercase mb-1">প্রধান আকর্ষণীয় হেডলাইন</label>
                <input
                  type="text"
                  value={customBannerSettings.headline}
                  onChange={(e) => setCustomBannerSettings({ ...customBannerSettings, headline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-bold uppercase mb-1">সাবহেডলাইন বিবরণী</label>
                <textarea
                  rows={2}
                  value={customBannerSettings.subheadline}
                  onChange={(e) => setCustomBannerSettings({ ...customBannerSettings, subheadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide">
              হিরো ব্যানার তথ্য আপডেট করুন
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
