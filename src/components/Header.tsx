import React from "react";
import { 
  ShoppingBag, 
  User, 
  ShieldAlert, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import { WebsiteSettings } from "../types";

interface HeaderProps {
  settings: WebsiteSettings;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentRole: 'customer' | 'admin' | null;
  setCurrentView: (view: string) => void;
  currentView: string;
  cartCount: number;
}

export default function Header({
  settings,
  darkMode,
  setDarkMode,
  currentRole,
  setCurrentView,
  currentView,
  cartCount
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full transition-all duration-300 glass-dark border-b border-white/5 dark:border-white/5 light:glass-light light:border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            id="header-brand"
            onClick={() => { setCurrentView("home"); setMobileMenuOpen(false); }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            {settings.websiteLogo && (settings.websiteLogo.startsWith("data:") || settings.websiteLogo.startsWith("http")) ? (
              <img 
                src={settings.websiteLogo} 
                alt={settings.websiteName} 
                className="h-10 w-auto object-contain max-w-[180px] group-hover:scale-105 transition-all duration-300" 
              />
            ) : (
              <>
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-600 shadow-gold-glow group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-gold-400 via-amber-500 to-gold-200 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                  {settings.websiteLogo || settings.websiteName.split(" ")[0] || "NovaStore"}
                </span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              id="nav-home"
              onClick={() => setCurrentView("home")}
              className={`font-medium text-sm tracking-wide uppercase transition-colors ${
                currentView === "home" 
                  ? "text-gold-400 dark:text-gold-400" 
                  : "text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-600 light:hover:text-black"
              }`}
            >
              প্রিমিয়াম কালেকশন
            </button>
            <button 
              id="nav-categories"
              onClick={() => {
                setCurrentView("home");
                setTimeout(() => {
                  document.getElementById("products-catalog")?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="font-medium text-sm tracking-wide uppercase text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-600 light:hover:text-black transition-colors"
            >
              ক্যাটাগরি সমূহ
            </button>
            <button 
              id="nav-faq"
              onClick={() => {
                setCurrentView("home");
                setTimeout(() => {
                  document.getElementById("faq-section")?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="font-medium text-sm tracking-wide uppercase text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-600 light:hover:text-black transition-colors"
            >
              প্রশ্নোত্তর (FAQ)
            </button>
          </nav>

          {/* Controls Panel */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-white/10 dark:border-white/10 light:border-black/5 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-all text-slate-300 dark:text-slate-300 light:text-slate-600"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold-300" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>

            {/* Dashboard Redirect */}
            <button
              id="dashboard-view-btn"
              onClick={() => setCurrentView("dashboard")}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                currentView === "dashboard"
                  ? "bg-gold-500/10 border-gold-400 text-gold-400"
                  : "border-white/10 dark:border-white/10 light:border-black/5 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 text-slate-200 dark:text-slate-200 light:text-slate-700"
              }`}
            >
              <User className="h-4 w-4" />
              <span>ড্যাশবোর্ড</span>
            </button>

            {/* Admin Dashboard */}
            <button
              id="admin-view-btn"
              onClick={() => setCurrentView("admin")}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold tracking-wide ${
                currentView === "admin"
                  ? "bg-red-500/10 border-red-500 text-red-400"
                  : "border-red-500/30 hover:bg-red-500/5 text-red-400 dark:text-red-400"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>এডমিন হাব</span>
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              id="mobile-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-600"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-white/10 dark:border-white/10 light:border-black/5 text-slate-300 dark:text-slate-300 light:text-slate-600 hover:bg-white/5 dark:hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Grid */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-white/5 dark:border-white/5 light:border-black/5 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 pt-3 pb-6 space-y-4">
            <button
              id="m-nav-home"
              onClick={() => { setCurrentView("home"); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
            >
              প্রিমিয়াম কালেকশন
            </button>
            <button
              id="m-nav-dashboard"
              onClick={() => { setCurrentView("dashboard"); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
            >
              কাস্টমার ড্যাশবোর্ড
            </button>
            <button
              id="m-nav-admin"
              onClick={() => { setCurrentView("admin"); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl font-medium text-red-400 dark:text-red-400 hover:bg-red-500/5"
            >
              এডমিন কন্ট্রোল প্যানেল
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
