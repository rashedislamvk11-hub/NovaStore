import React from "react";
import { 
  Star, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ShoppingBag,
  CheckCircle2,
  Play,
  Film,
  Sparkles,
  Facebook,
  Send,
  MessageCircle,
  Copy,
  Check
} from "lucide-react";
import { Product, Review } from "../types";
import ReviewsSection from "./ReviewsSection";

interface ProductDetailsViewProps {
  product: Product;
  allProducts: Product[];
  reviews: Review[];
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  onSubmitReview: (reviewData: { rating: number; comment: string; reviewImage?: string }) => void;
  isUserVerifiedForProduct: boolean;
}

export default function ProductDetailsView({
  product,
  allProducts,
  reviews,
  isWishlisted,
  onToggleWishlist,
  onBack,
  onBuyNow,
  onSubmitReview,
  isUserVerifiedForProduct
}: ProductDetailsViewProps) {
  const [activeImage, setActiveImage] = React.useState(product.image);
  const [zoomStyle, setZoomStyle] = React.useState({ transform: 'scale(1)', transformOrigin: 'center' });
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Sync active image if product changes
  React.useEffect(() => {
    setActiveImage(product.image);
  }, [product]);

  // Zoom Lens Hover Effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center'
    });
  };

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const productUrl = `${window.location.origin}/#product/${product.id}`;
  const shareText = `NovaStore এ চমৎকার পণ্যটি "${product.name}" দেখুন!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="product-details-container" className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Return Key navigation */}
      <button
        id="details-back-btn"
        onClick={onBack}
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/40 text-slate-300 hover:text-white transition-all text-xs font-semibold uppercase mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>মার্কেটপ্লেসে ফিরে যান</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        
        {/* Left Side: Images & Gallery Zoom */}
        <div className="space-y-4">
          <div 
            id="zoom-lens-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 cursor-zoom-in"
          >
            <img 
              src={activeImage} 
              alt={product.name}
              referrerPolicy="no-referrer"
              style={zoomStyle}
              className="h-full w-full object-cover transition-transform duration-100 ease-out"
            />
            {/* Promo Sale Badge */}
            <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-gold-600 text-white rounded-lg shadow-gold-glow">
              {discountPercent}% ছাড়
            </span>
          </div>

          {/* Gallery sliders row */}
          <div className="grid grid-cols-4 gap-3">
            {product.gallery.map((img, index) => (
              <button
                id={`gallery-thumb-${index}`}
                key={index}
                onClick={() => setActiveImage(img)}
                className={`aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border transition-all ${
                  activeImage === img 
                    ? "border-gold-400 ring-2 ring-gold-400/20" 
                    : "border-white/5 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Custom Metadata Details */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold-400">
              {product.category}
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Star review summaries */}
          <div className="flex items-center space-x-2.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "text-slate-700"}`} />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({product.reviewCount} টি কাস্টমার রিভিউ)</span>
          </div>

          <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
            {product.description}
          </p>

          {/* Feature checklist */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400">
              প্যাকেজের সাথে যা যা পাচ্ছেন:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo video player if optional present */}
          {product.demoVideo && (
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center space-x-1.5">
                <Film className="h-4 w-4" />
                <span>পণ্যটির ডেমো ভিডিও দেখুন</span>
              </span>
              <video controls className="w-full rounded-lg border border-white/5 bg-slate-950">
                <source src={product.demoVideo} type="video/mp4" />
                আপনার ব্রাউজারটি ভিডিও সমর্থন করে না।
              </video>
            </div>
          )}

          {/* Pricing Card Section */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-slate-500 line-through">আগের মূল্য: ৳{product.price}</span>
              <div className="flex items-baseline justify-center sm:justify-start space-x-2">
                <span className="font-display font-extrabold text-3xl text-gold-400">৳{product.salePrice}</span>
                <span className="text-xs font-bold text-emerald-400 uppercase">সাশ্রয় ৳{product.price - product.salePrice}</span>
              </div>
            </div>

            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                id="details-wishlist-toggle"
                onClick={() => onToggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-all ${
                  isWishlisted 
                    ? "bg-red-500/10 border-red-500/30 text-red-500" 
                    : "border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </button>

              <button
                id="details-share-toggle"
                onClick={() => setShowShareModal(!showShareModal)}
                className="p-4 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                id="details-acquire-btn"
                onClick={() => onBuyNow(product)}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white font-bold tracking-widest text-xs uppercase shadow-gold-glow hover:scale-[1.01] transition-transform"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>এখনই কিনুন</span>
              </button>
            </div>
          </div>

          {/* Modal direct inline share link */}
          {showShareModal && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-gold-500/20 space-y-3 animate-fade-in">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">শেয়ার লিঙ্ক</span>
              <div className="grid grid-cols-4 gap-2">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
                  <Facebook className="h-4 w-4 text-blue-500 mb-1" />
                  <span className="text-[9px]">Facebook</span>
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + productUrl)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4 text-green-500 mb-1" />
                  <span className="text-[9px]">WhatsApp</span>
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
                  <Send className="h-4 w-4 text-sky-400 mb-1" />
                  <span className="text-[9px]">Telegram</span>
                </a>
                <button onClick={handleCopyLink} className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
                  {copied ? <Check className="h-4 w-4 text-green-500 mb-1" /> : <Copy className="h-4 w-4 text-gold-400 mb-1" />}
                  <span className="text-[9px]">{copied ? 'কপি হয়েছে' : 'লিঙ্ক কপি'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* REVIEWS COMPONENT ATTACHMENT */}
      <ReviewsSection
        productId={product.id}
        reviews={reviews}
        onSubmitReview={onSubmitReview}
        isUserVerifiedForProduct={isUserVerifiedForProduct}
      />

      {/* RELATED RECOMMENDATIONS ROW */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/5">
          <h3 className="font-display font-extrabold text-xl text-slate-100 tracking-tight mb-6 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-gold-400" />
            <span>গ্রাহকদের পছন্দের অন্যান্য পণ্য</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div 
                key={rel.id} 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Simple hack: reload active details
                  setActiveImage(rel.image);
                  // Quick trigger back-forward logic
                  onBack();
                  setTimeout(() => onBuyNow(rel), 150);
                }}
                className="group p-3 rounded-xl bg-slate-900 border border-white/5 hover:border-gold-500/20 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <img src={rel.image} className="aspect-video w-full object-cover rounded-lg mb-3" />
                <h4 className="font-display font-bold text-sm text-slate-200 line-clamp-1 group-hover:text-gold-400 transition-colors">
                  {rel.name}
                </h4>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-slate-500 font-mono">{rel.category}</span>
                  <span className="font-display font-extrabold text-gold-400">৳{rel.salePrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
