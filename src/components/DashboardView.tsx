import React from "react";
import { 
  User, 
  ShoppingBag, 
  Download, 
  Clock, 
  MapPin, 
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  TrendingUp,
  FileText,
  CheckCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Order, UserProfile } from "../types";

interface DashboardViewProps {
  orders: Order[];
  currentUser: UserProfile | null;
  onLogin: (email: string, role?: 'customer' | 'admin', password?: string) => void;
  onLogout: () => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

export default function DashboardView({
  orders,
  currentUser,
  onLogin,
  onLogout,
  onUpdateProfile
}: DashboardViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState(currentUser?.name || "");
  const [whatsapp, setWhatsapp] = React.useState(currentUser?.whatsappNumber || "");
  const [activeTab, setActiveTab] = React.useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [selectedInvoice, setSelectedInvoice] = React.useState<Order | null>(null);

  const [loginError, setLoginError] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState(false);

  // Sync profile edits when user loaded
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setWhatsapp(currentUser.whatsappNumber);
    }
  }, [currentUser]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, whatsappNumber: whatsapp });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await onLogin(email.trim(), undefined, password);
    } catch (err: any) {
      setLoginError(err.message || "লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoRole: 'customer' | 'admin') => {
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await onLogin(demoEmail, demoRole);
    } catch (err: any) {
      setLoginError(err.message || "লগইন ব্যর্থ হয়েছে।");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Paid': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'Confirmed': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'Delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  // Login Page rendering if no user logged in
  if (!currentUser) {
    return (
      <div id="auth-screen" className="max-w-md mx-auto my-16 p-8 rounded-2xl glass-dark border border-white/5 shadow-premium text-center">
        <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-gold-500 to-amber-600 rounded-xl flex items-center justify-center shadow-gold-glow mb-4">
          <User className="h-6 w-6 text-white" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100 tracking-tight mb-2">
          সুরক্ষিত লগইন
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6 leading-relaxed">
          আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন এবং আপনার কেনা পণ্য ডাউনলোড করুন ও অর্ডার ট্র্যাকিং করুন।
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            id="auth-email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError("");
            }}
            placeholder="আপনার ইমেইল এড্রেস লিখুন"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-sm"
            required
          />
          {email.trim().toLowerCase() === "rashedislamvk11@gmail.com" && (
            <input
              id="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              placeholder="এডমিন পাসওয়ার্ড লিখুন"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-sm animate-fade-in"
              required
            />
          )}

          {loginError && (
            <p className="text-xs text-red-400 font-semibold text-center py-1 bg-red-500/10 border border-red-500/20 rounded-lg animate-pulse">
              ⚠️ {loginError}
            </p>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoggingIn ? "প্রবেশ করা হচ্ছে..." : "ড্যাশবোর্ডে প্রবেশ করুন"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="h-px bg-white/5 w-1/3" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ঝটপট ডেমো</span>
          <span className="h-px bg-white/5 w-1/3" />
        </div>

        {/* VIP switch controls for lightning fast reviewing */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="quick-buyer-login-btn"
            disabled={isLoggingIn}
            onClick={() => handleQuickDemoLogin("patron@luxurymarket.com", "customer")}
            className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide transition-all disabled:opacity-50"
          >
            ক্রেতা ডেমো প্রোফাইল
          </button>
          <button
            id="quick-admin-login-btn"
            disabled={isLoggingIn}
            onClick={() => handleQuickDemoLogin("curator@luxurymarket.com", "admin")}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold tracking-wide transition-all disabled:opacity-50"
          >
            এডমিনিস্ট্রেটর প্যানেল
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="customer-dashboard-grid" className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Dynamic welcome card banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-dark border border-white/5 mb-10 shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-amber-500/5 to-transparent animate-pulse-glow" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-gold-600 p-0.5 flex items-center justify-center shadow-gold-glow flex-shrink-0">
              <div className="h-full w-full bg-slate-950 rounded-2.5xl flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-gold-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">
                  স্বাগতম, {currentUser.name || "সম্মানিত গ্রাহক"}
                </h1>
                {currentUser.role === "admin" && (
                  <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wide">
                    <ShieldCheck className="h-3 w-3" />
                    <span>এডমিন</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                মেম্বার আইডি: <span className="font-mono text-gold-400 uppercase">{currentUser.uid.slice(0, 12)}</span>
              </p>
            </div>
          </div>

          <button
            id="dashboard-logout-btn"
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all text-xs font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span>লগ আউট</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Panel */}
        <div className="space-y-4">
          <button
            id="tab-orders-trigger"
            onClick={() => { setActiveTab('orders'); setSelectedInvoice(null); }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
              activeTab === 'orders'
                ? "bg-gradient-to-r from-amber-500/10 to-gold-500/5 border-gold-400 text-gold-400"
                : "border-white/5 bg-slate-950/20 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">আমার কেনাকাটা</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
              {orders.length}
            </span>
          </button>

          <button
            id="tab-profile-trigger"
            onClick={() => { setActiveTab('profile'); setSelectedInvoice(null); }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
              activeTab === 'profile'
                ? "bg-gradient-to-r from-amber-500/10 to-gold-500/5 border-gold-400 text-gold-400"
                : "border-white/5 bg-slate-950/20 text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">প্রোফাইল তথ্য</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </button>
        </div>

        {/* Main Workspace Frame */}
        <div className="lg:col-span-3">
          
          {selectedInvoice ? (
            /* PRINTABLE LUXURY INVOICE LAYOUT */
            <div id="invoice-details" className="p-6 sm:p-8 rounded-2xl glass-dark border border-white/5 relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-slate-200">রসিদ (ইনভয়েস)</h3>
                  <p className="text-xs font-mono text-slate-500">REF: {selectedInvoice.id.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-xs font-semibold text-gold-400 hover:text-gold-300"
                >
                  তালিকায় ফিরে যান
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs mb-6">
                <div>
                  <h4 className="font-semibold text-slate-400 mb-1">ক্রেতার নাম</h4>
                  <p className="text-slate-200 font-bold">{selectedInvoice.customerName}</p>
                  <p className="text-slate-400">{selectedInvoice.customerEmail}</p>
                  <p className="text-slate-400 font-mono">{selectedInvoice.whatsappNumber}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold text-slate-400 mb-1">লেনদেনের তথ্য</h4>
                  <p className="text-slate-200">পদ্ধতি: <span className="font-bold">{selectedInvoice.paymentMethod}</span></p>
                  <p className="text-slate-400 font-mono">TXN: {selectedInvoice.transactionId}</p>
                  <p className="text-slate-500">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/[0.02] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3">ডিজিটাল পণ্য</th>
                      <th className="px-4 py-3 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    <tr>
                      <td className="px-4 py-4 flex items-center space-x-3">
                        <img src={selectedInvoice.productImage} className="h-10 w-10 object-cover rounded-md" />
                        <span className="font-bold">{selectedInvoice.productName}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-display font-extrabold text-gold-400">৳{selectedInvoice.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-white/[0.01] p-4 rounded-xl border border-white/5">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedInvoice.status)}`}>
                    অবস্থা: {
                      selectedInvoice.status === 'Pending' ? 'পেন্ডিং' :
                      selectedInvoice.status === 'Paid' ? 'পরিশোধিত' :
                      selectedInvoice.status === 'Confirmed' ? 'নিশ্চিত' : 'ডেলিভারি সম্পন্ন'
                    }
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-400">মোট পরিশোধিত: <span className="text-lg font-extrabold text-gold-400 font-display">৳{selectedInvoice.price}</span></span>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            /* ACQUISITIONS / ORDERS LIST */
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 rounded-2xl glass-dark border border-white/5">
                  <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300">এখনও কোনো কেনাকাটা করা হয়নি</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    আপনি এখনও কোনো ডিজিটাল পণ্য ক্রয় করেননি। আমাদের চমৎকার পণ্যগুলো দেখতে মার্কেটপ্লেসে ঘুরে আসুন!
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-5 sm:p-6 rounded-2xl glass-dark border border-white/5 hover:border-white/10 transition-all space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={ord.productImage} className="h-14 w-14 object-cover rounded-xl border border-white/10" />
                        <div>
                          <h3 className="font-display font-extrabold text-base text-slate-100">
                            {ord.productName}
                          </h3>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span>অর্ডার আইডি: {ord.id.slice(0, 12)}</span>
                            <span>•</span>
                            <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-auto">
                        <button
                          id={`view-invoice-${ord.id}`}
                          onClick={() => setSelectedInvoice(ord)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 text-[11px] font-semibold text-slate-400 hover:text-white transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>রসিদ</span>
                        </button>
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                          {
                            ord.status === 'Pending' ? 'পেন্ডিং' :
                            ord.status === 'Paid' ? 'পরিশোধিত' :
                            ord.status === 'Confirmed' ? 'নিশ্চিত' : 'ডেলিভারি সম্পন্ন'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Stepper tracking progress */}
                    <div className="py-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">
                        <span>অর্ডার সম্পন্ন</span>
                        <span>পেমেন্ট যাচাইকরণ</span>
                        <span>ডেলিভারি প্রস্তুতি</span>
                        <span>ডেলিভারি সম্পন্ন</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden relative flex">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 rounded-full transition-all duration-1000"
                          style={{
                            width: ord.status === 'Pending' ? '25%' :
                                   ord.status === 'Paid' ? '50%' :
                                   ord.status === 'Confirmed' ? '75%' : '100%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Delivery download linkage block if approved */}
                    {ord.status === 'Confirmed' || ord.status === 'Delivered' ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center space-x-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>ডেলিভারি সফল হয়েছে</span>
                          </span>
                          <p className="text-xs text-slate-400">
                            {ord.downloadInstructions || "আপনার ফাইলটি ডাউনলোড করার জন্য নিচের বাটনে ক্লিক করুন।"}
                          </p>
                        </div>
                        {ord.downloadLink ? (
                          <a
                            id={`download-asset-${ord.id}`}
                            href={ord.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-transform"
                          >
                            <Download className="h-4 w-4" />
                            <span>ফাইল ডাউনলোড করুন</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">কোনো ডাউনলোড লিঙ্ক পাওয়া যায়নি, দয়া করে এডমিনের সাথে যোগাযোগ করুন।</span>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start space-x-3 text-xs text-slate-400">
                        <Clock className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-300">পেমেন্ট ভেরিফিকেশন পেন্ডিং আছে</p>
                          <p className="text-slate-500">এডমিন আপনার পেমেন্ট স্ক্রিনশট এবং ট্রানজেকশন আইডি যাচাই করছেন। ভেরিফাই হওয়া মাত্রই আপনার ডাউনলোড লিঙ্ক আনলক হয়ে যাবে।</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* USER PROFILE FORM */
            <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 rounded-2xl glass-dark border border-white/5 space-y-6">
              <h3 className="font-display font-extrabold text-xl text-slate-100 tracking-tight">
                প্রোফাইল তথ্য আপডেট করুন
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">ইমেইল (পরিবর্তনযোগ্য নয়)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Display Name</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">হোয়াটসঅ্যাপ নম্বর</label>
                  <input
                    id="profile-whatsapp-input"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-sm font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5">পেমেন্ট নিশ্চিত হওয়ার পর স্বয়ংক্রিয়ভাবে আপনার ডিজিটাল প্রোডাক্ট ডেলিভারি এবং তথ্য পাওয়ার জন্য হোয়াটসঅ্যাপ নম্বরটি আবশ্যক।</p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center animate-pulse">
                  ✓ আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।
                </div>
              )}

              <button
                id="save-profile-btn"
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:shadow-lg transition-all"
              >
                <span>সংরক্ষণ করুন</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
