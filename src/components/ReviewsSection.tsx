import React from "react";
import { Star, Check, MessageSquare, AlertCircle, Image as ImageIcon, Send } from "lucide-react";
import { Review } from "../types";

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  onSubmitReview: (reviewData: { rating: number; comment: string; reviewImage?: string }) => void;
  isUserVerifiedForProduct: boolean;
}

export default function ReviewsSection({
  productId,
  reviews,
  onSubmitReview,
  isUserVerifiedForProduct
}: ReviewsSectionProps) {
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [reviewImage, setReviewImage] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  // Statistics calculation
  const approvedReviews = reviews.filter(r => r.status === "Approved");
  const totalCount = approvedReviews.length;
  
  const avgRating = totalCount > 0 
    ? parseFloat((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
    : 5.0;

  const starPercentages = [5, 4, 3, 2, 1].map(stars => {
    if (totalCount === 0) return 0;
    const count = approvedReviews.filter(r => r.rating === stars).length;
    return Math.round((count / totalCount) * 100);
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("অনুগ্রহ করে প্রথমে আপনার মতামত লিখুন।");
      return;
    }
    onSubmitReview({ rating, comment, reviewImage });
    setComment("");
    setReviewImage("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div id="reviews-widget" className="w-full mt-12 pt-10 border-t border-white/5">
      <h3 className="font-display font-extrabold text-2xl text-slate-100 tracking-tight mb-8">
        গ্রাহকদের রিভিউ ও মতামত
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Aggregates Panel */}
        <div className="p-6 rounded-2xl glass-dark border border-white/5 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-display font-extrabold text-gold-400">
            {avgRating}
          </span>
          <div className="flex items-center text-amber-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${i < Math.floor(avgRating) ? "fill-amber-400" : "text-slate-700"}`} 
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 mb-6 font-mono uppercase tracking-wider">
            {totalCount} টি ভেরিফাইড মতামতের গড়
          </p>

          {/* Rating Distribution Bars */}
          <div className="w-full space-y-3">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center space-x-3 w-full">
                <span className="text-xs font-semibold text-slate-400 w-3 font-mono">{stars}</span>
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <div className="h-2 flex-grow bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-gold-400 rounded-full"
                    style={{ width: `${starPercentages[index]}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-500 w-8 text-right">
                  {starPercentages[index]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Listing & Submission Form Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Write Review Form */}
          {isUserVerifiedForProduct ? (
            <form onSubmit={handleFormSubmit} className="p-6 rounded-2xl glass-dark border border-gold-500/20 shadow-premium relative">
              <h4 className="font-display font-bold text-lg text-slate-100 mb-4">
                পণ্যটি সম্পর্কে আপনার রিভিউ দিন
              </h4>

              {/* Dynamic Interactive Stars */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-medium text-slate-400">রেটিং স্কোর:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      id={`rating-star-input-${star}`}
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star 
                        className={`h-6 w-6 transition-all ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400 text-glow" 
                            : "text-slate-700"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text comment */}
              <div className="mb-4">
                <textarea
                  id="review-comment-textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="পণ্যটি সম্পর্কে আপনার মূল্যবান মতামত লিখুন..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-sm"
                />
              </div>

              {/* Showcase image */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                  <ImageIcon className="h-4.5 w-4.5 text-gold-400" />
                  <span>স্ক্রিনশট সংযুক্ত করুন (ঐচ্ছিক)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {reviewImage && (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-gold-500/30">
                    <img src={reviewImage} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setReviewImage("")}
                      className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      মুছুন
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  <Check className="h-4 w-4" />
                  <span>আপনার রিভিউটি সফলভাবে জমা দেওয়া হয়েছে এবং এটি এডমিন অনুমোদনের অপেক্ষায় আছে।</span>
                </div>
              )}

              <button
                id="submit-review-btn"
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:shadow-lg transition-all"
              >
                <Send className="h-4 w-4" />
                <span>রিভিউ জমা দিন</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-slate-400 text-xs flex items-center space-x-2.5">
              <AlertCircle className="h-5 w-5 text-gold-400 flex-shrink-0" />
              <span>শুধুমাত্র পণ্যটি ক্রয়কারী ভেরিফাইড গ্রাহকরাই রিভিউ দিতে পারবেন।</span>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-5">
            {approvedReviews.length === 0 ? (
              <div className="text-center py-8 border border-white/5 rounded-2xl bg-white/[0.02]">
                <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">এই পণ্যটির জন্য এখনও কোনো ভেরিফাইড রিভিউ দেওয়া হয়নি।</p>
              </div>
            ) : (
              approvedReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl glass-dark border border-white/5 space-y-3 relative overflow-hidden transition-all hover:border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-slate-100">
                          {rev.userName}
                        </span>
                        {rev.isVerified && (
                          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wide">
                            <Check className="h-2.5 w-2.5" />
                            <span>ভেরিফাইড ক্রেতা</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400" : "text-slate-700"}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Review showcase image */}
                  {rev.reviewImage && (
                    <div className="mt-2 relative inline-block max-w-[200px] rounded-lg overflow-hidden border border-white/10">
                      <img src={rev.reviewImage} alt="User Showcase" className="w-full object-cover max-h-[150px]" />
                    </div>
                  )}

                  {/* Admin replies */}
                  {rev.reply && (
                    <div className="mt-4 p-4 rounded-xl bg-gold-500/5 border border-gold-500/10 space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                          👑 NovaStore এডমিন রিপ্লাই
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 italic">
                        "{rev.reply}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
