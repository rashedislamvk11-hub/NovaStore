import React from "react";
import { 
  Star, 
  Share2, 
  Heart, 
  ArrowRight, 
  ShoppingBag,
  Check,
  Copy,
  Facebook,
  Send,
  MessageCircle
} from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onBuyNow,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const productUrl = `${window.location.origin}/#product/${product.id}`;
  const shareText = `ডিজিটাল পণ্য: দেখুন চমৎকার "${product.name}" মাত্র ৳${product.salePrice} এ!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden glass-dark border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-gold-500/30 hover:shadow-premium shadow-lg"
    >
      {/* Top Media Anchor */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Soft shadow cover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Promo badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-gold-600 text-white rounded-md shadow-gold-glow">
            {discountPercent}% ছাড়
          </span>
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-indigo-600 text-white rounded-md">
              সেরা বিক্রেতা
            </span>
          )}
        </div>

        {/* Floating actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {/* Wishlist Toggle */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              isWishlisted 
                ? "bg-red-500/20 border-red-500/50 text-red-500" 
                : "bg-slate-900/40 border-white/10 hover:border-white/30 text-white hover:bg-slate-900/60"
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>

          {/* Direct Share Trigger */}
          <button
            id={`share-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(!showShareModal);
            }}
            className="p-2.5 rounded-xl backdrop-blur-md bg-slate-900/40 border border-white/10 text-white hover:border-white/30 hover:bg-slate-900/60 transition-all"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col flex-grow p-4">
        {/* Product taxonomy */}
        <span className="font-mono text-[10px] font-semibold tracking-wider text-gold-400 uppercase mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 
          className="font-display font-bold text-base text-slate-100 group-hover:text-white transition-colors line-clamp-1 mb-1 cursor-pointer"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        {/* High-level snippet */}
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 line-clamp-2 flex-grow mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Ratings aggregate */}
        <div className="flex items-center space-x-1.5 mb-4">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400" : "text-slate-600 dark:text-slate-600 light:text-slate-300"}`} 
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-slate-300 dark:text-slate-300 light:text-slate-600">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500">
            ({product.reviewCount} টি রিভিউ)
          </span>
        </div>

        {/* Price & Primary Trigger Grid */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 dark:border-white/5 light:border-black/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] line-through text-slate-500">
              ৳{product.price}
            </span>
            <span className="font-display font-extrabold text-lg text-gold-400 dark:text-gold-400">
              ৳{product.salePrice}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              id={`details-btn-${product.id}`}
              onClick={() => onViewDetails(product)}
              className="p-2.5 rounded-xl border border-white/10 dark:border-white/10 light:border-black/5 text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/5 dark:hover:bg-white/5 transition-all"
              title="বিস্তারিত দেখুন"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id={`buy-btn-${product.id}`}
              onClick={() => onBuyNow(product)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-xs font-bold tracking-wider uppercase shadow-gold-glow hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Actions Sheet overlay */}
      {showShareModal && (
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-slate-950/95 dark:bg-slate-950/95 border-t border-gold-500/20 backdrop-blur-md rounded-b-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
              শেয়ার করুন
            </span>
            <button 
              onClick={() => setShowShareModal(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              বন্ধ করুন
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Facebook className="h-4.5 w-4.5 mb-1.5 text-blue-500" />
              <span className="text-[9px]">Facebook</span>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + productUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <MessageCircle className="h-4.5 w-4.5 mb-1.5 text-green-500" />
              <span className="text-[9px]">WhatsApp</span>
            </a>

            {/* Telegram */}
            <a 
              href={`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Send className="h-4.5 w-4.5 mb-1.5 text-sky-400" />
              <span className="text-[9px]">Telegram</span>
            </a>

            {/* Messenger */}
            <a 
              href={`https://www.facebook.com/dialog/send?app_id=123456789&link=${encodeURIComponent(productUrl)}&redirect_uri=${encodeURIComponent(productUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <MessageCircle className="h-4.5 w-4.5 mb-1.5 text-indigo-400" />
              <span className="text-[9px]">Messenger</span>
            </a>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-400/20 transition-all text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>লিঙ্ক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>লিঙ্ক কপি করুন</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
