export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  salePrice: number;
  category: string;
  image: string;
  gallery: string[];
  demoVideo?: string;
  downloadLink: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt?: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  customerName: string;
  customerEmail: string;
  whatsappNumber: string;
  transactionId: string;
  paymentScreenshot: string; // Base64 or URL
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  status: 'Pending' | 'Paid' | 'Confirmed' | 'Delivered';
  createdAt: string;
  downloadInstructions?: string;
  downloadLink?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  reviewImage?: string; // Optional image upload
  reply?: string; // Admin response
  status: 'Pending' | 'Approved';
  isVerified: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  whatsappNumber: string;
  role: 'customer' | 'admin';
  blocked: boolean;
  createdAt: string;
}

export interface PaymentSettings {
  bkashNumber: string;
  bkashImage: string;
  nagadNumber: string;
  nagadImage: string;
  rocketNumber: string;
  rocketImage: string;
}

export interface WebsiteSettings {
  websiteName: string;
  websiteLogo: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  footerContent: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BannerSettings {
  videoBannerUrl: string;
  sliderImages: string[];
  lottieAnimationUrl: string;
  headline: string;
  subheadline: string;
  ctaText: string;
}
