import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { 
  Product, 
  Order, 
  Review, 
  UserProfile, 
  WebsiteSettings, 
  PaymentSettings, 
  BannerSettings 
} from "./types";

// Default Luxury Seeds
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-novastore-ui",
    name: "NovaStore UI - Luxury Dashboard Kit",
    description: "An ultra-premium dark-mode dashboard toolkit designed for high-end SaaS applications. Built with React, Tailwind CSS, and Framer Motion, it features interactive charts, pristine glassmorphism components, and flawless responsive layouts.",
    features: [
      "25+ Premium Dark Dashboard Screens",
      "Interactive Recharts Analytics & Revenue Graphs",
      "Gorgeous Custom Glassmorphism UI Components",
      "Complete User Authentication & Profile Mockups",
      "100% Fluid Responsive Desktop & Mobile Layouts",
      "Lifetime Updates and Elite Developer Support"
    ],
    price: 129,
    salePrice: 79,
    category: "UI Templates",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80"
    ],
    demoVideo: "https://www.w3schools.com/html/mov_bbb.mp4",
    downloadLink: "https://github.com/reactjs/reactjs.org",
    tags: ["React", "Tailwind", "NextJS", "Dashboard", "Admin"],
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: "prod-presets",
    name: "Cinematic Platinum Lightroom Presets",
    description: "Unleash the full potential of your photography with 35 master-crafted Lightroom Presets. Specifically designed for professional travel, fashion, and lifestyle photographers seeking rich contrast, golden skin tones, and deep cinematic shadows.",
    features: [
      "35 Professional Lightroom Desktop & Mobile Presets (.xmp & .dng)",
      "Engineered for RAW, JPEG, and iPhone photos",
      "Detailed PDF Installation Guide with Video Tutorial",
      "Optimized for Golden Hour, Editorial, and Architectural photography",
      "Instant Direct Download immediately after payment",
      "Royalty-free use on unlimited social media accounts"
    ],
    price: 49,
    salePrice: 24,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
    ],
    downloadLink: "https://www.adobe.com/products/photoshop-lightroom.html",
    tags: ["Lightroom", "Presets", "Photography", "Mobile", "LUTs"],
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: "prod-ascent",
    name: "Ascent - Premium SaaS Landing Page",
    description: "A breathtaking SaaS marketing and landing page template coded from scratch with luxury visual elements. Implements interactive parallax scrolls, modern grid alignments, high-performance page scores, and built-in lead generation funnels.",
    features: [
      "Ultra-Fast Next.js & Tailwind CSS Architecture",
      "Elegant CSS/Framer Motion Entrance Animations",
      "Interactive Pricing Toggle & Custom Testimonial Slider",
      "Lead Capture Form integrated with modern API layouts",
      "Fully Responsive Bento Grid Showcase Section",
      "Optimized for 100/100 Lighthouse Performance Scores"
    ],
    price: 89,
    salePrice: 39,
    category: "Websites",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
    ],
    downloadLink: "https://vitejs.dev",
    tags: ["Websites", "SaaS", "NextJS", "Tailwind", "Responsive"],
    rating: 4.7,
    reviewCount: 32,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  },
  {
    id: "prod-vapor",
    name: "Vapor Synthwave - Complete Sound Pack",
    description: "An absolute retro-futuristic powerhouse of high-fidelity synth patches, drum machine patterns, and cinematic audio loops. Includes everything needed to produce top-tier Retrowave, Synthwave, Cyberpunk, and cinematic dark wave music tracks.",
    features: [
      "500+ Royalty-Free High-Fidelity WAV Files (24-bit)",
      "80 Analog Synthesizer Patches (Serum, Massive, Vital)",
      "120 Punchy Retro Drum Machine Hits and Fills",
      "100% Royalty-Free License for Commercial Music & Game Releases",
      "Carefully labeled with BPM & Key indicators",
      "Instant Digital Download package (.zip format)"
    ],
    price: 69,
    salePrice: 35,
    category: "Audio & Music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
    ],
    downloadLink: "https://file-examples.com/storage/fe9df29e4b672776c5b04bd/2017/11/file_example_MP3_5MG.mp3",
    tags: ["Music", "Sound Effects", "Vaporwave", "Synthwave", "Samples"],
    rating: 5.0,
    reviewCount: 56,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true
  },
  {
    id: "prod-vanguard",
    name: "Vanguard - Executive CV & Resume Template",
    description: "An incredibly sophisticated, modern, and high-impact CV resume template tailored for executives and elite developers. Engineered with flawless typographic hierarchy, perfect margins, and a layout that effortlessly passes corporate ATS scanners.",
    features: [
      "Includes editable formats for Figma, MS Word (.docx), and Pages",
      "100% ATS-Friendly layout tested on enterprise HR systems",
      "Complete set of matching Cover Letter & References templates",
      "Rich guide on high-impact executive phrasing and action verbs",
      "Elegant custom-made social icon font assets",
      "Free lifetime layout updates and design support"
    ],
    price: 29,
    salePrice: 12,
    category: "Templates",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    downloadLink: "https://figma.com",
    tags: ["Resume", "CV", "Figma", "Executive", "Corporate"],
    rating: 4.9,
    reviewCount: 78,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
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
};

const DEFAULT_PAYMENT: PaymentSettings = {
  bkashNumber: "+8801700112233",
  bkashImage: "https://images.unsplash.com/photo-1627375464114-15967df6613c?auto=format&fit=crop&w=300&q=80", // Standard abstract red/pink gradient represent
  nagadNumber: "+8801899887766",
  nagadImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80", // Orange abstract representative
  rocketNumber: "+8801544332211",
  rocketImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&q=80" // Violet gradient representative
};

const DEFAULT_BANNER: BannerSettings = {
  videoBannerUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-background-42171-large.mp4",
  sliderImages: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1600&q=80"
  ],
  lottieAnimationUrl: "https://assets10.lottiefiles.com/packages/lf20_5n8yofyg.json",
  headline: "ULTRA-PREMIUM DIGITAL PRODUCTS FOR THE VISIONARY",
  subheadline: "Deploy luxury-grade interfaces, cinematic Lightroom presets, high-end sound designs, and executive templates in seconds.",
  ctaText: "EXPLORE THE COLLECTION"
};

// Database seeding function
export async function seedDatabaseIfEmpty() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (productsSnapshot.empty) {
      console.log("Seeding products...");
      for (const prod of SEED_PRODUCTS) {
        await setDoc(doc(db, "products", prod.id), prod);
      }
    }
    
    // Seed Settings
    const settingsDoc = await getDoc(doc(db, "settings", "general"));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, "settings", "general"), DEFAULT_SETTINGS);
    }

    const paymentDoc = await getDoc(doc(db, "settings", "payment"));
    if (!paymentDoc.exists()) {
      await setDoc(doc(db, "settings", "payment"), DEFAULT_PAYMENT);
    }

    const bannerDoc = await getDoc(doc(db, "settings", "banner"));
    if (!bannerDoc.exists()) {
      await setDoc(doc(db, "settings", "banner"), DEFAULT_BANNER);
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database seeding encountered a non-fatal error: ", error);
  }
}

// PRODUCT OPERATIONS
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      return SEED_PRODUCTS;
    }
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.warn("Falling back to local static seed products", error);
    return SEED_PRODUCTS;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  } catch (error) {
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  await setDoc(doc(db, "products", product.id), product);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// ORDER OPERATIONS
export async function getOrders(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    // Return mock empty or parse from localstorage if Firestore permissions prevent reading
    const local = localStorage.getItem("aura_orders");
    return local ? JSON.parse(local) : [];
  }
}

export async function createOrder(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, "orders", order.id), order);
  } catch (error) {
    console.warn("Writing order to localStorage as fallback");
  }
  // Always back up in localStorage for extreme reliability
  const current = localStorage.getItem("aura_orders");
  const parsed = current ? JSON.parse(current) : [];
  parsed.unshift(order);
  localStorage.setItem("aura_orders", JSON.stringify(parsed));
}

export async function updateOrderStatus(orderId: string, status: Order['status'], downloadLink?: string): Promise<void> {
  try {
    const docRef = doc(db, "orders", orderId);
    const updateData: any = { status };
    if (downloadLink) {
      updateData.downloadLink = downloadLink;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.warn("Updating order in localStorage fallback");
  }
  
  const current = localStorage.getItem("aura_orders");
  if (current) {
    const parsed: Order[] = JSON.parse(current);
    const updated = parsed.map(o => {
      if (o.id === orderId) {
        return { ...o, status, ...(downloadLink ? { downloadLink } : {}) };
      }
      return o;
    });
    localStorage.setItem("aura_orders", JSON.stringify(updated));
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "orders", id));
  } catch (error) {}
  const current = localStorage.getItem("aura_orders");
  if (current) {
    const parsed: Order[] = JSON.parse(current);
    const filtered = parsed.filter(o => o.id !== id);
    localStorage.setItem("aura_orders", JSON.stringify(filtered));
  }
}

// REVIEW OPERATIONS
export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    let q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    if (productId) {
      q = query(collection(db, "reviews"), where("productId", "==", productId), orderBy("createdAt", "desc"));
    }
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });
    return reviews;
  } catch (error) {
    const local = localStorage.getItem("aura_reviews");
    const parsed: Review[] = local ? JSON.parse(local) : [];
    return productId ? parsed.filter(r => r.productId === productId) : parsed;
  }
}

export async function addReview(review: Review): Promise<void> {
  try {
    await setDoc(doc(db, "reviews", review.id), review);
  } catch (error) {}
  const local = localStorage.getItem("aura_reviews");
  const parsed = local ? JSON.parse(local) : [];
  parsed.unshift(review);
  localStorage.setItem("aura_reviews", JSON.stringify(parsed));
}

export async function updateReview(reviewId: string, updates: Partial<Review>): Promise<void> {
  try {
    await updateDoc(doc(db, "reviews", reviewId), updates);
  } catch (error) {}
  const local = localStorage.getItem("aura_reviews");
  if (local) {
    const parsed: Review[] = JSON.parse(local);
    const updated = parsed.map(r => r.id === reviewId ? { ...r, ...updates } : r);
    localStorage.setItem("aura_reviews", JSON.stringify(updated));
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (error) {}
  const local = localStorage.getItem("aura_reviews");
  if (local) {
    const parsed: Review[] = JSON.parse(local);
    const filtered = parsed.filter(r => r.id !== reviewId);
    localStorage.setItem("aura_reviews", JSON.stringify(filtered));
  }
}

// WEBSITE SETTINGS
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docSnap = await getDoc(doc(db, "settings", "general"));
    if (docSnap.exists()) {
      const data = docSnap.data() as WebsiteSettings;
      localStorage.setItem("aura_settings_general", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("Firestore getWebsiteSettings error:", error);
  }
  const local = localStorage.getItem("aura_settings_general");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return DEFAULT_SETTINGS;
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  localStorage.setItem("aura_settings_general", JSON.stringify(settings));
  try {
    await setDoc(doc(db, "settings", "general"), settings);
  } catch (error) {
    console.error("Firestore saveWebsiteSettings error:", error);
  }
}

// PAYMENT SETTINGS
export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const docSnap = await getDoc(doc(db, "settings", "payment"));
    if (docSnap.exists()) {
      const data = docSnap.data() as PaymentSettings;
      localStorage.setItem("aura_settings_payment", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("Firestore getPaymentSettings error:", error);
  }
  const local = localStorage.getItem("aura_settings_payment");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return DEFAULT_PAYMENT;
}

export async function savePaymentSettings(settings: PaymentSettings): Promise<void> {
  localStorage.setItem("aura_settings_payment", JSON.stringify(settings));
  try {
    await setDoc(doc(db, "settings", "payment"), settings);
  } catch (error) {
    console.error("Firestore savePaymentSettings error:", error);
  }
}

// BANNER SETTINGS
export async function getBannerSettings(): Promise<BannerSettings> {
  try {
    const docSnap = await getDoc(doc(db, "settings", "banner"));
    if (docSnap.exists()) {
      const data = docSnap.data() as BannerSettings;
      localStorage.setItem("aura_settings_banner", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error("Firestore getBannerSettings error:", error);
  }
  const local = localStorage.getItem("aura_settings_banner");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return DEFAULT_BANNER;
}

export async function saveBannerSettings(settings: BannerSettings): Promise<void> {
  localStorage.setItem("aura_settings_banner", JSON.stringify(settings));
  try {
    await setDoc(doc(db, "settings", "banner"), settings);
  } catch (error) {
    console.error("Firestore saveBannerSettings error:", error);
  }
}

// CUSTOMER/USER OPERATIONS
export async function getProfiles(): Promise<UserProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      profiles.push({ uid: doc.id, ...doc.data() } as UserProfile);
    });
    return profiles;
  } catch (error) {
    const local = localStorage.getItem("aura_users");
    return local ? JSON.parse(local) : [];
  }
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  try {
    const searchKey = uid.trim().toLowerCase();
    if (searchKey.includes("@")) {
      const q = query(collection(db, "users"), where("email", "==", searchKey));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    }
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Firestore getProfile error:", error);
    const local = localStorage.getItem("aura_users");
    if (local) {
      const parsed: UserProfile[] = JSON.parse(local);
      const searchKey = uid.trim().toLowerCase();
      if (searchKey.includes("@")) {
        return parsed.find(u => u.email.toLowerCase() === searchKey) || null;
      }
      return parsed.find(u => u.uid === uid) || null;
    }
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, "users", profile.uid), profile);
  } catch (error) {}
  const local = localStorage.getItem("aura_users");
  const parsed: UserProfile[] = local ? JSON.parse(local) : [];
  const index = parsed.findIndex(u => u.uid === profile.uid);
  if (index >= 0) {
    parsed[index] = profile;
  } else {
    parsed.push(profile);
  }
  localStorage.setItem("aura_users", JSON.stringify(parsed));
}

export async function updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, "users", uid), data);
  } catch (error) {}
  const local = localStorage.getItem("aura_users");
  if (local) {
    const parsed: UserProfile[] = JSON.parse(local);
    const updated = parsed.map(u => u.uid === uid ? { ...u, ...data } : u);
    localStorage.setItem("aura_users", JSON.stringify(updated));
  }
}

export async function deleteProfile(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (error) {}
  const local = localStorage.getItem("aura_users");
  if (local) {
    const parsed: UserProfile[] = JSON.parse(local);
    const filtered = parsed.filter(u => u.uid !== uid);
    localStorage.setItem("aura_users", JSON.stringify(filtered));
  }
}
