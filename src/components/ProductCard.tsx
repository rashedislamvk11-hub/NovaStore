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
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden glass-dark border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-premium shadow-lg bg-slate-900/40"
    >
      {/* Top Media Anchor - Increased height for main focus */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Soft shadow cover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Promo badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500 to-gold-600 text-white rounded shadow-gold-glow">
            {discountPercent}% ছাড়
          </span>
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-indigo-600 text-white rounded">
              সেরা বিক্রেতা
            </span>
          )}
        </div>

        {/* Floating actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col space-y-1.5">
          {/* Wishlist Toggle */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-md border transition-all duration-300 ${
              isWishlisted 
                ? "bg-red-500/20 border-red-500/50 text-red-500 scale-105" 
                : "bg-slate-900/55 border-white/10 hover:border-white/30 text-white hover:bg-slate-900/85"
            }`}
          >
            <Heart className={`h-3.5 sm:h-4 w-3.5 sm:w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>

          {/* Direct Share Trigger */}
          <button
            id={`share-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(!showShareModal);
            }}
            className="p-2 rounded-lg backdrop-blur-md bg-slate-900/55 border border-white/10 text-white hover:border-white/30 hover:bg-slate-900/85 transition-all duration-300"
          >
            <Share2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 justify-between space-y-2">
        <div className="space-y-1">
          {/* Product taxonomy */}
          <span className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider text-gold-400 uppercase">
            {product.category}
          </span>

          {/* Title - max 2 lines, clean size */}
          <h3 
            className="font-display font-bold text-xs sm:text-sm lg:text-base text-slate-100 hover:text-white transition-colors line-clamp-2 leading-tight cursor-pointer"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>
        </div>

        <div className="space-y-2 pt-1">
          {/* Prices */}
          <div className="flex items-baseline space-x-2">
            <span className="font-display font-extrabold text-sm sm:text-base lg:text-lg text-gold-400">
              ৳{product.salePrice}
            </span>
            <span className="text-[10px] sm:text-xs line-through text-slate-500">
              ৳{product.price}
            </span>
          </div>

          {/* Order Button - Full-width, premium, highly visible */}
          <button
            id={`buy-btn-${product.id}`}
            onClick={() => onBuyNow(product)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-gold-glow hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>অর্ডার করুন</span>
          </button>
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
