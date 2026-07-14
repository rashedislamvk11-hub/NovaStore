import React from "react";
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ArrowRight, 
  HelpCircle,
  FileText,
  CreditCard
} from "lucide-react";
import { Product, PaymentSettings, Order } from "../types";

interface CheckoutViewProps {
  product: Product;
  paymentSettings: PaymentSettings;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export default function CheckoutView({
  product,
  paymentSettings,
  onClose,
  onOrderPlaced,
  currentUserEmail = "",
  currentUserName = ""
}: CheckoutViewProps) {
  const [selectedGateway, setSelectedGateway] = React.useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [custName, setCustName] = React.useState(currentUserName);
  const [custEmail, setCustEmail] = React.useState(currentUserEmail);
  const [whatsapp, setWhatsapp] = React.useState("");
  const [txnId, setTxnId] = React.useState("");
  const [screenshot, setScreenshot] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-fill names if customer already logged in
  React.useEffect(() => {
    if (currentUserName) setCustName(currentUserName);
    if (currentUserEmail) setCustEmail(currentUserEmail);
  }, [currentUserName, currentUserEmail]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError("পেমেন্ট স্ক্রিনশটের সাইজ ৩ মেগাবাইটের বেশি হতে পারবে না।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !whatsapp.trim() || !txnId.trim() || !screenshot) {
      setError("অনুগ্রহ করে আপনার নাম, ইমেইল, হোয়াটসঅ্যাপ নম্বর, ট্রানজেকশন আইডি দিন এবং স্ক্রিনশট আপলোড করুন।");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.salePrice,
      customerName: custName,
      customerEmail: custEmail,
      whatsappNumber: whatsapp,
      transactionId: txnId,
      paymentScreenshot: screenshot,
      paymentMethod: selectedGateway,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      downloadInstructions: "NovaStore আপনার পেমেন্ট যাচাই করছে। কিছুক্ষণের মধ্যেই আপনার ডাউনলোড লিঙ্কটি এখানে এবং আপনার হোয়াটসঅ্যাপে পাঠিয়ে দেওয়া হবে।"
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 1500);
  };

  const getGatewayNumber = () => {
    switch (selectedGateway) {
      case 'bKash': return paymentSettings.bkashNumber;
      case 'Nagad': return paymentSettings.nagadNumber;
      case 'Rocket': return paymentSettings.rocketNumber;
      default: return "";
    }
  };

  const getGatewayImage = () => {
    switch (selectedGateway) {
      case 'bKash': return paymentSettings.bkashImage;
      case 'Nagad': return paymentSettings.nagadImage;
      case 'Rocket': return paymentSettings.rocketImage;
      default: return "";
    }
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="checkout-dialog"
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl glass-dark border border-gold-500/25 overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-premium animate-fade-in my-4"
      >
        
        {/* Left column: Product Summary & Payment instructions */}
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-950/50 border-b md:border-b-0 md:border-r border-white/5 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold-400">অর্ডার বিবরণী</span>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <img src={product.image} className="h-14 w-14 sm:h-20 sm:w-20 object-cover rounded-xl sm:rounded-2xl border border-white/10 flex-shrink-0" />
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase">{product.category}</span>
              <h3 className="font-display font-extrabold text-sm sm:text-base lg:text-lg text-slate-100 leading-snug truncate">{product.name}</h3>
              <p className="font-display font-black text-base sm:text-xl text-gold-400">৳{product.salePrice}</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-white/5">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
              <CreditCard className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gold-400" />
              <span>ধাপে ধাপে পেমেন্ট নির্দেশনাবলী</span>
            </h4>

            {/* Gateway selection toggles */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {(['bKash', 'Nagad', 'Rocket'] as const).map((gw) => {
                const imgUrl = gw === 'bKash' ? paymentSettings.bkashNumber && paymentSettings.bkashImage : gw === 'Nagad' ? paymentSettings.nagadNumber && paymentSettings.nagadImage : paymentSettings.rocketNumber && paymentSettings.rocketImage;
                return (
                  <button
                    id={`gateway-select-${gw}`}
                    key={gw}
                    type="button"
                    onClick={() => setSelectedGateway(gw)}
                    className={`py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all flex flex-col items-center justify-center space-y-1 ${
                      selectedGateway === gw
                        ? "bg-gradient-to-tr from-amber-500 to-gold-600 text-white border-gold-400 shadow-md"
                        : "border-white/5 bg-slate-900/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {imgUrl ? (
                      <img src={imgUrl as string} className="h-4 sm:h-6 w-8 sm:w-12 object-contain rounded" />
                    ) : null}
                    <span>{gw}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment guide cards */}
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.01] border border-white/5 space-y-2.5 sm:space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-slate-300">অ্যাকাউন্টের ধরন: <span className="text-gold-400">পার্সোনাল</span></span>
                {getGatewayImage() && (
                  <img src={getGatewayImage()} className="h-6 sm:h-8 w-10 sm:w-12 object-cover rounded border border-white/10" />
                )}
              </div>
              <p className="text-sm sm:text-base font-mono font-extrabold text-slate-100 bg-slate-900/80 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/5 text-center tracking-widest select-all">
                {getGatewayNumber()}
              </p>
              <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed space-y-1 sm:space-y-1.5">
                <p>১. আপনার মোবাইল ব্যাংকিং অ্যাপ বা ডায়াল কোড ব্যবহার করুন।</p>
                <p>২. আমাদের উপরে দেওয়া নম্বরে <span className="font-bold text-gold-400">৳{product.salePrice}</span> টাকা সেন্ড মানি বা ক্যাশ আউট করুন।</p>
                <p>৩. পেমেন্ট সফল হওয়ার পর স্ক্রিনশট নিন এবং ডানপাশের ফর্মে আপলোড করুন।</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form input fields & screenshot uploader */}
        <form onSubmit={handlePlaceOrder} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="hidden md:flex items-center justify-between pb-2 sm:pb-3 border-b border-white/5">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">নিরাপদ চেকআউট পোর্টাল</span>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 text-[10px] sm:text-xs">
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1 sm:mb-1.5">আপনার পুরো নাম</label>
              <input
                id="checkout-name-input"
                type="text"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-gold-500/50 text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1 sm:mb-1.5">আপনার ইমেইল</label>
              <input
                id="checkout-email-input"
                type="email"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                placeholder="আপনার সচল ইমেইল এড্রেস লিখুন"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:border-gold-500/50 text-xs sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1 sm:mb-1.5">হোয়াটসঅ্যাপ নম্বর</label>
                <input
                  id="checkout-whatsapp-input"
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+88017XXXXXXXX"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-mono focus:outline-none focus:border-gold-500/50 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1 sm:mb-1.5">ট্রানজেকশন আইডি (TxID)</label>
                <input
                  id="checkout-txnid-input"
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="যেমন: 8K3H98J2L"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-slate-900 border border-white/10 text-slate-200 font-mono uppercase placeholder-slate-600 focus:outline-none focus:border-gold-500/50 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Receipt Screenshot upload */}
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1 sm:mb-1.5">পেমেন্টের স্ক্রিনশট আপলোড করুন</label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-gold-400/40 rounded-xl sm:rounded-2xl py-3.5 sm:py-5 px-3 sm:px-4 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all">
                  <Upload className="h-4.5 w-4.5 sm:h-6 sm:w-6 text-gold-400 mb-1.5 sm:mb-2" />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 text-center">
                    {screenshot ? "ছবি পাওয়া গেছে! পরিবর্তন করতে ক্লিক করুন..." : "ক্লিক করে স্ক্রিনশট ফাইল আপলোড করুন"}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 mt-0.5">JPG, PNG সর্বোচ্চ ৩ মেগাবাইট</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </label>
                {screenshot && (
                  <div className="mt-2.5 relative inline-block rounded-lg sm:rounded-xl overflow-hidden border border-gold-500/30 shadow-premium">
                    <img src={screenshot} alt="Screenshot receipt preview" className="max-h-16 sm:max-h-24 object-contain" />
                    <button
                      type="button"
                      onClick={() => setScreenshot("")}
                      className="absolute top-1 right-1 p-0.5 sm:p-1 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            id="place-order-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 sm:py-4 mt-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-gold-glow hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>অর্ডার প্রসেস হচ্ছে...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                <span>অর্ডার নিশ্চিত করুন</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
