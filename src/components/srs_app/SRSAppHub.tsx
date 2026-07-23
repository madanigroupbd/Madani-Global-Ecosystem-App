import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  LayoutDashboard,
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  Bell,
  User,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Lock,
  LogOut,
  Send,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Copy,
  Download,
  AlertCircle,
  Phone,
  Mail,
  Key,
  Shield,
  Sliders,
  Sparkles,
  BarChart3,
  Layers,
  Database,
  Code,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types Definition
export type LangMode = 'bn' | 'en';
export type ThemeMode = 'dark' | 'light';
export type UserRole = 'FREE' | 'PREMIUM' | 'ADMIN';
export type AppViewTab = 'home' | 'services' | 'notifications' | 'profile' | 'support';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  avatar: string;
  is2FAEnabled: boolean;
  pushEnabled: boolean;
  subscriptionExpiry: string;
}

export interface ServiceItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'fintech' | 'health' | 'commerce' | 'legal' | 'edu';
  categoryLabelBn: string;
  categoryLabelEn: string;
  descBn: string;
  descEn: string;
  priceBdt: number;
  priceUsd: number;
  isPremiumOnly: boolean;
  iconName: string;
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'alert' | 'system' | 'promo';
}

export interface TransactionRecord {
  id: string;
  trxId: string;
  serviceTitle: string;
  provider: 'bKash' | 'Nagad' | 'Rocket' | 'Stripe Cards';
  amountBdt: number;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  invoiceNo: string;
}

export interface ServiceRequest {
  id: string;
  userName: string;
  userPhone: string;
  serviceTitle: string;
  amount: number;
  gateway: string;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export const SRSAppHub: React.FC = () => {
  // Main Navigation Modes: 'mobile' (Interactive Mobile App Frame) vs 'admin' (Centralized Web Admin Panel)
  const [activePlatformView, setActivePlatformView] = useState<'mobile' | 'admin'>('mobile');

  // App Level Preferences
  const [lang, setLang] = useState<LangMode>('bn');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('srs_app_theme') as ThemeMode) || 'dark';
  });

  // Save theme state
  useEffect(() => {
    localStorage.setItem('srs_app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Onboarding State
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('srs_onboarding_done') === 'true';
  });
  const [onboardingSlide, setOnboardingSlide] = useState<number>(0);

  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'otp' | 'email' | 'google'>('otp');
  const [loginPhone, setLoginPhone] = useState<string>('01711223344');
  const [loginOtp, setLoginOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(60);

  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'আহমেদ হাসান (Ahmed Hassan)',
    email: 'ahmed.hassan@example.com',
    phone: '+880 1711-223344',
    address: 'মিরপুর-১০, ঢাকা, বাংলাদেশ (Mirpur-10, Dhaka)',
    role: 'PREMIUM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    is2FAEnabled: true,
    pushEnabled: true,
    subscriptionExpiry: '2027-12-31'
  });

  // Mobile Bottom Navigation Tab
  const [activeMobileTab, setActiveMobileTab] = useState<AppViewTab>('home');

  // Service Catalog Data
  const [services] = useState<ServiceItem[]>([
    {
      id: 'srv-1',
      titleBn: 'জিরো-চার্জ ক্যাশ আউট ও এমএফএস',
      titleEn: 'Zero-Charge Cash Out & MFS',
      category: 'fintech',
      categoryLabelBn: 'ফিনটেক ও ব্যাংকিং',
      categoryLabelEn: 'Fintech & Banking',
      descBn: 'বিকাশ, নগদ ও রকেটে ফ্রি ক্যাশআউট সুবিধা',
      descEn: 'Free cashout facility for bKash, Nagad & Rocket',
      priceBdt: 0,
      priceUsd: 0,
      isPremiumOnly: false,
      iconName: 'Wallet'
    },
    {
      id: 'srv-2',
      titleBn: 'অনলাইন বিশেষজ্ঞ ডাক্তার কনসালটেশন',
      titleEn: 'Online Specialist Doctor Consultation',
      category: 'health',
      categoryLabelBn: 'স্বাস্থ্য ও চিকিৎসা',
      categoryLabelEn: 'Health & Medical',
      descBn: '২৪/৭ নিবন্ধিত এমবিবিএস ডাক্তারের সরাসরি অ্যাপয়েন্টমেন্ট',
      descEn: '24/7 direct appointment with registered MBBS doctors',
      priceBdt: 300,
      priceUsd: 3,
      isPremiumOnly: false,
      iconName: 'HeartPulse'
    },
    {
      id: 'srv-3',
      titleBn: 'ই-কমার্স কারখানাজাত পণ্য অর্ডার',
      titleEn: 'Direct Factory E-Commerce Order',
      category: 'commerce',
      categoryLabelBn: 'ই-কমার্স ও কারখানা',
      categoryLabelEn: 'E-Commerce & Factory',
      descBn: 'পাইকারী মূল্যে ইউনিক গ্রোসারী ও খাদ্য সামগ্রী সরবরাহ',
      descEn: 'Wholesale grocery & food supply direct from factory',
      priceBdt: 1200,
      priceUsd: 10,
      isPremiumOnly: false,
      iconName: 'ShoppingBag'
    },
    {
      id: 'srv-4',
      titleBn: 'সাইবার আইনি সহায়তা ও মোবাইল ট্র্যাকিং',
      titleEn: 'Cyber Legal Aid & Mobile IMEI Audit',
      category: 'legal',
      categoryLabelBn: 'সাইবার ও আইনি সহায়তা',
      categoryLabelEn: 'Cyber & Legal Cell',
      descBn: 'জরুরী হ্যাকিং রিকভারি, আইএমইআই ও লিগ্যাল কাউন্সিলিং',
      descEn: 'Emergency hack recovery, IMEI audit & legal counsel',
      priceBdt: 500,
      priceUsd: 5,
      isPremiumOnly: true,
      iconName: 'ShieldCheck'
    },
    {
      id: 'srv-5',
      titleBn: 'বিনামূল্য ফ্রিল্যান্সিং ও কোডিং কোর্স',
      titleEn: 'Free Freelancing & Coding Academy',
      category: 'edu',
      categoryLabelBn: 'শিক্ষা ও স্কিলস',
      categoryLabelEn: 'Education & Skills',
      descBn: 'ওয়েব ডেভেলপমেন্ট, পাইথন ও গ্লোবাল আউটসোর্সিং গাইড',
      descEn: 'Web dev, Python & global outsourcing guidelines',
      priceBdt: 0,
      priceUsd: 0,
      isPremiumOnly: false,
      iconName: 'GraduationCap'
    }
  ]);

  // Notifications State (Push Messaging Inbox)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      titleBn: 'পেমেন্ট সফল হয়েছে!',
      titleEn: 'Payment Successful!',
      bodyBn: 'আপনার বিকাশ পেমেন্ট (৳৫০০) সফলভাবে সম্পন্ন হয়েছে। TrxID: BK987621',
      bodyEn: 'Your bKash payment (৳500) completed successfully. TrxID: BK987621',
      time: '১০ মিনিট আগে (10m ago)',
      isRead: false,
      type: 'order'
    },
    {
      id: 'notif-2',
      titleBn: 'সিকিউরিটি অ্যালার্ট',
      titleEn: 'Security Alert',
      bodyBn: 'নতুন ডিভাইসে আপনার একাউন্টে লগইন সনাক্ত করা হয়েছে।',
      bodyEn: 'New device login detected on your account.',
      time: '১ ঘণ্টা আগে (1h ago)',
      isRead: false,
      type: 'alert'
    },
    {
      id: 'notif-3',
      titleBn: 'প্রিমিয়াম অফার অ্যাক্টিভ',
      titleEn: 'Premium Offer Active',
      bodyBn: 'জিরো-চার্জ ক্যাশআউট সুবিধা এখন আপনার জন্য সচল রয়েছে।',
      bodyEn: 'Zero-charge cashout privilege is active for your account.',
      time: '১ দিন আগে (1 day ago)',
      isRead: true,
      type: 'promo'
    }
  ]);

  // Transactions State
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'tx-101',
      trxId: 'BK9876218',
      serviceTitle: 'সাইবার আইনি সহায়তা ও মোবাইল ট্র্যাকিং',
      provider: 'bKash',
      amountBdt: 500,
      date: '2026-07-22 16:30',
      status: 'SUCCESS',
      invoiceNo: 'INV-2026-001'
    },
    {
      id: 'tx-102',
      trxId: 'NG4432190',
      serviceTitle: 'অনলাইন বিশেষজ্ঞ ডাক্তার কনসালটেশন',
      provider: 'Nagad',
      amountBdt: 300,
      date: '2026-07-21 11:15',
      status: 'SUCCESS',
      invoiceNo: 'INV-2026-002'
    },
    {
      id: 'tx-103',
      trxId: 'ST8892100',
      serviceTitle: 'ই-কমার্স কারখানাজাত পণ্য অর্ডার',
      provider: 'Stripe Cards',
      amountBdt: 1200,
      date: '2026-07-20 19:40',
      status: 'PENDING',
      invoiceNo: 'INV-2026-003'
    }
  ]);

  // Service Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Stripe Cards'>('bKash');
  const [paymentPhone, setPaymentPhone] = useState<string>('01711223344');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Customer Support & FAQ State
  const [faqExpanded, setFaqExpanded] = useState<number | null>(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: lang === 'bn' ? 'আসসালামু আলাইকুম! মাদানী মোবাইল সাপোর্ট অ্যাসিস্ট্যান্টের কাছে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?' : 'Welcome to Madani Support Assistant! How can I help you today?',
      time: '12:00 PM'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Complaint / Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState<string>('general');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Admin Dashboard Management Data
  const [adminServiceRequests, setAdminServiceRequests] = useState<ServiceRequest[]>([
    { id: 'REQ-901', userName: 'কামরুল ইসলাম', userPhone: '01819000111', serviceTitle: 'সাইবার আইনি সাহায্য', amount: 500, gateway: 'bKash', date: '2026-07-22', status: 'PENDING' },
    { id: 'REQ-902', userName: 'সুমা আক্তার', userPhone: '01712000222', serviceTitle: 'ডাক্তার অ্যাপয়েন্টমেন্ট', amount: 300, gateway: 'Nagad', date: '2026-07-22', status: 'APPROVED' },
    { id: 'REQ-903', userName: 'জহির রায়হান', userPhone: '01913000333', serviceTitle: 'গ্রোসারী ডেলিভারি', amount: 1200, gateway: 'Stripe', date: '2026-07-21', status: 'APPROVED' }
  ]);

  // Admin User List
  const [adminUsers, setAdminUsers] = useState([
    { id: 'u-1', name: 'আহমেদ হাসান', phone: '01711223344', role: 'PREMIUM', status: 'ACTIVE', joined: '2026-01-15' },
    { id: 'u-2', name: 'ফাতেমা পারভীন', phone: '01812998877', role: 'FREE', status: 'ACTIVE', joined: '2026-02-10' },
    { id: 'u-3', name: 'মোঃ রফিকুল ইসলাম', phone: '01911445566', role: 'ADMIN', status: 'ACTIVE', joined: '2025-11-01' }
  ]);

  // Recharts Data for Admin Dashboard
  const dauChartData = [
    { day: 'Mon', freeUsers: 1200, premiumUsers: 850, total: 2050 },
    { day: 'Tue', freeUsers: 1450, premiumUsers: 980, total: 2430 },
    { day: 'Wed', freeUsers: 1600, premiumUsers: 1100, total: 2700 },
    { day: 'Thu', freeUsers: 1500, premiumUsers: 1250, total: 2750 },
    { day: 'Fri', freeUsers: 1900, premiumUsers: 1400, total: 3300 },
    { day: 'Sat', freeUsers: 2200, premiumUsers: 1650, total: 3850 },
    { day: 'Sun', freeUsers: 2100, premiumUsers: 1600, total: 3700 }
  ];

  const revenueChartData = [
    { gateway: 'bKash', bdt: 45000, percentage: 45 },
    { gateway: 'Nagad', bdt: 30000, percentage: 30 },
    { gateway: 'Rocket', bdt: 15000, percentage: 15 },
    { gateway: 'Stripe', bdt: 10000, percentage: 10 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  // Handle OTP Countdown Timer
  useEffect(() => {
    let timer: any;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  // OTP Login Handler
  const handleSendOtp = () => {
    if (!loginPhone) return;
    setOtpSent(true);
    setOtpTimer(60);
  };

  const handleVerifyOtp = () => {
    if (loginOtp.length >= 4 || loginOtp === '1234') {
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setOtpSent(false);
      setLoginOtp('');
    } else {
      alert(lang === 'bn' ? 'সঠিক ৪-সংখ্যার ওটিপি (1234) লিখুন।' : 'Please enter valid 4-digit OTP (1234).');
    }
  };

  // Service Booking Handler
  const handleExecutePayment = () => {
    if (!selectedService) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const newTrxId = 'TRX' + Math.floor(10000000 + Math.random() * 90000000);
      const newTrx: TransactionRecord = {
        id: 'tx-' + Date.now(),
        trxId: newTrxId,
        serviceTitle: lang === 'bn' ? selectedService.titleBn : selectedService.titleEn,
        provider: paymentGateway,
        amountBdt: selectedService.priceBdt,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'SUCCESS',
        invoiceNo: 'INV-' + Math.floor(10000 + Math.random() * 90000)
      };

      setTransactions((prev) => [newTrx, ...prev]);

      // Add Notification
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        titleBn: 'সার্ভিস অর্ডার সফল!',
        titleEn: 'Service Order Successful!',
        bodyBn: `${selectedService.titleBn} সফলভাবে প্রসেস হয়েছে। TrxID: ${newTrxId}`,
        bodyEn: `${selectedService.titleEn} processed successfully. TrxID: ${newTrxId}`,
        time: 'এখনই (Just now)',
        isRead: false,
        type: 'order'
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setPaymentSuccessMsg(
        lang === 'bn'
          ? `পেমেন্ট সফল হয়েছে! ট্রানজেকশন আইডেন্টিফায়ার: ${newTrxId}`
          : `Payment Successful! Transaction ID: ${newTrxId}`
      );

      setTimeout(() => {
        setSelectedService(null);
        setPaymentSuccessMsg(null);
      }, 2500);
    }, 1500);
  };

  // Support Chat Handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user' as const, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const botReply = {
        sender: 'bot' as const,
        text: lang === 'bn'
          ? 'ধন্যবাদ! আপনার জিজ্ঞাসার জন্য ধন্যবাদ। আমাদের সাপোর্ট এজেন্ট খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
          : 'Thank you for reaching out! Our support agent will assist you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  // Trigger test FCM alert
  const triggerPushAlert = () => {
    const alerts = [
      { titleBn: 'জরুরী বিজ্ঞপ্তি', titleEn: 'Urgent Notification', bodyBn: 'বিকাশ মেইনটেনেন্স আপডেট সম্পূর্ণ হয়েছে।', bodyEn: 'bKash system maintenance complete.' },
      { titleBn: 'নতুন সার্ভিস যোগ', titleEn: 'New Service Added', bodyBn: 'উন্নত সাইবার সাপোর্ট এখন সকলের জন্য উন্মুক্ত।', bodyEn: 'Advanced cyber support is now live for all users.' }
    ];
    const picked = alerts[Math.floor(Math.random() * alerts.length)];
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      titleBn: picked.titleBn,
      titleEn: picked.titleEn,
      bodyBn: picked.bodyBn,
      bodyEn: picked.bodyEn,
      time: 'এখনই (Just now)',
      isRead: false,
      type: 'alert'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Filter Services
  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'ALL' || srv.category === selectedCategory;
    const matchesSearch =
      srv.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.descBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.descEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* GLOBAL APPRECIATION TOP BAR & PLATFORM SWITCHER */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & App Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                  {lang === 'bn' ? 'মাদানী মোবাইল এন্টারপ্রাইজ পোর্টাল' : 'Madani Enterprise Mobile App'}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                  v2.5 Full-Stack SRS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {lang === 'bn' ? 'অ্যান্ড্রয়েড, আইওএস ও কেন্দ্রীয় ওয়েব অ্যাডমিন ড্যাশবোর্ড' : 'Android & iOS Mobile App + Central Web Admin Panel'}
              </p>
            </div>
          </div>

          {/* View Mode Switcher: Mobile App Frame vs Web Admin Panel */}
          <div className="flex items-center gap-2">
            
            {/* View Switcher Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActivePlatformView('mobile')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activePlatformView === 'mobile'
                    ? 'bg-emerald-600 text-white font-extrabold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile App'}</span>
              </button>

              <button
                onClick={() => setActivePlatformView('admin')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activePlatformView === 'admin'
                    ? 'bg-blue-600 text-white font-extrabold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'ওয়েব অ্যাডমিন' : 'Web Admin'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 hover:border-emerald-500 transition-all flex items-center gap-1.5"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 hover:scale-105 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Role Switcher for RBAC Testing */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono">
              <span className="text-[10px] text-slate-400 font-bold">Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as UserRole })}
                className="bg-slate-950 text-emerald-400 font-bold rounded px-1.5 py-0.5 focus:outline-none"
              >
                <option value="FREE">FREE User</option>
                <option value="PREMIUM">PREMIUM User</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ONBOARDING SLIDE OVERLAY FOR FIRST-TIME USERS */}
        {!hasCompletedOnboarding && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Slide Counter */}
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span>SRS MODULE 1: INTERACTIVE ONBOARDING</span>
                <span className="text-emerald-400">Step {onboardingSlide + 1} of 3</span>
              </div>

              {/* Onboarding Slides */}
              {onboardingSlide === 0 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-100">
                    {lang === 'bn' ? 'মাদানী মোবাইল এন্টারপ্রাইজে স্বাগতম' : 'Welcome to Madani Mobile Enterprise'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'bn' 
                      ? 'একটি মাত্র অ্যাপে ফিনটেক, স্বাস্থ্যসেবা, ই-কমার্স, আইনি সহায়তা এবং শিক্ষামূলক প্ল্যাটফর্মের পূর্ণ সুবিধা উপভোগ করুন।'
                      : 'Experience all-in-one fintech, healthcare, e-commerce, legal aid, and education in a single unified mobile platform.'}
                  </p>
                </div>
              )}

              {onboardingSlide === 1 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center mx-auto shadow-xl">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-100">
                    {lang === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট ও জিরো-চার্জ' : 'Instant Payment & Zero Charge'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'bn'
                      ? 'বিকাশ, নগদ, রকেট এবং আন্তর্জাতিক ক্রেডিট কার্ডের মাধ্যমে অতি দ্রুত ও নিরাপদ অর্থ লেনদেন করুন।'
                      : 'Seamless transaction processing via bKash, Nagad, Rocket, and international Stripe credit card gateways.'}
                  </p>
                </div>
              )}

              {onboardingSlide === 2 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-100">
                    {lang === 'bn' ? '২৪/৭ সাপোর্ট ও পুশ অ্যালার্ট' : '24/7 Support & FCM Push Alerts'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'bn'
                      ? 'রিয়েল-টাইম পুশ নোটিফিকেশন, কৃত্রিম বুদ্ধিমত্তা চালিত চ্যাটবট এবং ২৪/৭ সাপোর্ট টিম আপনার সেবায় নিয়োজিত।'
                      : 'Real-time FCM push alerts, AI chatbot assistance, and dedicated support for instant resolution.'}
                  </p>
                </div>
              )}

              {/* Dots Progress */}
              <div className="flex justify-center items-center gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setOnboardingSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      onboardingSlide === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Slide Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {onboardingSlide < 2 ? (
                  <>
                    <button
                      onClick={() => {
                        localStorage.setItem('srs_onboarding_done', 'true');
                        setHasCompletedOnboarding(true);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-slate-200"
                    >
                      {lang === 'bn' ? 'স্কিপ করুন' : 'Skip'}
                    </button>
                    <button
                      onClick={() => setOnboardingSlide((prev) => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.setItem('srs_onboarding_done', 'true');
                      setHasCompletedOnboarding(true);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-black text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'bn' ? 'শুরু করুন (Get Started)' : 'Get Started'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* PLATFORM VIEW 1: INTERACTIVE MOBILE APPLICATION FRAME */}
        {activePlatformView === 'mobile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / MOBILE FRAME CENTERPIECE */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Device Frame Simulation Container */}
              <div className={`mx-auto max-w-md w-full rounded-[40px] border-4 p-4 shadow-2xl transition-colors relative ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-100 shadow-emerald-950/20'
                  : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}>
                
                {/* Mobile Camera Notch & Speaker */}
                <div className="w-32 h-4 bg-slate-900 rounded-b-2xl mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
                  <div className="w-8 h-1 rounded-full bg-slate-800" />
                </div>

                {/* MOBILE HEADER BAR */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      className="w-9 h-9 rounded-xl object-cover border border-emerald-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{currentUser.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                          currentUser.role === 'PREMIUM'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {currentUser.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">+8801711***</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Mobile Action Icons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveMobileTab('notifications')}
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 relative hover:text-emerald-400"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadNotifCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400"
                      title="Auth Settings"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* MOBILE TAB 1: HOME DASHBOARD */}
                {activeMobileTab === 'home' && (
                  <div className="space-y-4">
                    
                    {/* Welcome Banner Card */}
                    <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/80 space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                            {lang === 'bn' ? 'স্বাগতম' : 'DASHBOARD'}
                          </span>
                          <h3 className="text-sm font-extrabold text-slate-100 mt-1">
                            {lang === 'bn' ? 'ডিজিটাল সেবার একক সমাধান' : 'Unified Digital Platform'}
                          </h3>
                        </div>
                        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {lang === 'bn'
                          ? 'আজকের সেরা পরিষেবা ও অফারগুলো দেখতে বেছে নিন।'
                          : 'Explore instant services, zero-charge cashout & medical appointments.'}
                      </p>
                    </div>

                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { id: 'fintech', labelBn: 'ক্যাশআউট', labelEn: 'Cash Out', icon: Wallet, color: 'text-emerald-400 bg-emerald-950' },
                        { id: 'health', labelBn: 'ডাক্তার', labelEn: 'Doctor', icon: HeartPulseIcon, color: 'text-rose-400 bg-rose-950' },
                        { id: 'commerce', labelBn: 'শপ অর্ডার', labelEn: 'Shop', icon: ShoppingBag, color: 'text-amber-400 bg-amber-950' },
                        { id: 'legal', labelBn: 'সাইবার সহায়তা', labelEn: 'Cyber Aid', icon: ShieldCheck, color: 'text-blue-400 bg-blue-950' }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedCategory(item.id);
                              setActiveMobileTab('services');
                            }}
                            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all flex flex-col items-center gap-1.5 group"
                          >
                            <div className={`p-2 rounded-xl ${item.color} border border-slate-800 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                              {lang === 'bn' ? item.labelBn : item.labelEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Recent Activity / Notice Board */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{lang === 'bn' ? 'সাম্প্রতিক নোটিশ ও কার্যক্রম' : 'Notice Board & Activity'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">LIVE UPDATE</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-200 text-[11px]">
                              {lang === 'bn' ? 'বিকাশ ও নগদ জিরো-চার্জ চালু' : 'bKash & Nagad zero-charge active'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {lang === 'bn' ? 'সকল প্রিমিয়াম মেম্বারদের জন্য শূন্য চার্জ ক্যাশআউট।' : 'Zero cashout charges for all premium users.'}
                            </p>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-200 text-[11px]">
                              {lang === 'bn' ? '২৪/৭ ফ্রি সাইবার সিকিউরিটি সেল' : '24/7 Free Cyber Security Cell'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {lang === 'bn' ? 'অ্যাকাউন্ট হ্যাকিং ও সিম হারানো সহায়তা।' : 'Account hack recovery & SIM loss guidance.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* MOBILE TAB 2: SERVICES CATALOG & SEARCH */}
                {activeMobileTab === 'services' && (
                  <div className="space-y-3">
                    
                    {/* Search & Category Filter Bar */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder={lang === 'bn' ? 'সার্ভিস খুঁজুন...' : 'Search services...'}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Categories Pill Horizontal Scroll */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold no-scrollbar">
                        {[
                          { id: 'ALL', labelBn: 'সব সার্ভিস', labelEn: 'All' },
                          { id: 'fintech', labelBn: 'ফিনটেক', labelEn: 'Fintech' },
                          { id: 'health', labelBn: 'স্বাস্থ্য', labelEn: 'Health' },
                          { id: 'commerce', labelBn: 'ই-কমার্স', labelEn: 'Commerce' },
                          { id: 'legal', labelBn: 'আইনি', labelEn: 'Legal' },
                          { id: 'edu', labelBn: 'শিক্ষা', labelEn: 'Edu' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                              selectedCategory === cat.id
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {lang === 'bn' ? cat.labelBn : cat.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services List Cards */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {filteredServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-3 hover:border-emerald-500/80 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-slate-100">
                                  {lang === 'bn' ? srv.titleBn : srv.titleEn}
                                </h4>
                                {srv.isPremiumOnly && (
                                  <span className="text-[8px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-1 py-0.2 rounded">
                                    PREMIUM
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {lang === 'bn' ? srv.descBn : srv.descEn}
                              </p>
                            </div>

                            <span className="text-xs font-extrabold font-mono text-emerald-400 shrink-0">
                              {srv.priceBdt === 0 ? 'FREE' : `৳${srv.priceBdt}`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                            <span className="text-[9px] text-slate-500 font-mono">
                              {lang === 'bn' ? srv.categoryLabelBn : srv.categoryLabelEn}
                            </span>

                            <button
                              onClick={() => {
                                if (srv.isPremiumOnly && currentUser.role === 'FREE') {
                                  alert(lang === 'bn' ? 'এই সার্ভিসটি শুধুমাত্র প্রিমিয়াম মেম্বারদের জন্য।' : 'This service is for Premium Members only.');
                                  return;
                                }
                                setSelectedService(srv);
                              }}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center gap-1"
                            >
                              <span>{lang === 'bn' ? 'বুক করুন' : 'Book Now'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* MOBILE TAB 3: NOTIFICATIONS INBOX */}
                {activeMobileTab === 'notifications' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'bn' ? 'ইনবক্স ও পুশ অ্যালার্ট' : 'Inbox & Push Alerts'}</span>
                      </h4>

                      <button
                        onClick={triggerPushAlert}
                        className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono font-bold hover:bg-emerald-900"
                      >
                        + Test FCM Push
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
                            );
                          }}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                            !n.isRead
                              ? 'bg-emerald-950/40 border-emerald-800 text-slate-100'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[11px] text-slate-100">
                              {lang === 'bn' ? n.titleBn : n.titleEn}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-1">
                            {lang === 'bn' ? n.bodyBn : n.bodyEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MOBILE TAB 4: PROFILE & SECURITY */}
                {activeMobileTab === 'profile' && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    
                    {/* User Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center space-y-2">
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="w-14 h-14 rounded-2xl mx-auto object-cover border-2 border-emerald-500 shadow-md"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{currentUser.name}</h4>
                        <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                      </div>

                      <div className="flex justify-center items-center gap-2 pt-1">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {currentUser.role} TIER
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Expires: {currentUser.subscriptionExpiry}
                        </span>
                      </div>
                    </div>

                    {/* Security Toggles */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-slate-200">2FA Two-Factor Auth</span>
                        <input
                          type="checkbox"
                          checked={currentUser.is2FAEnabled}
                          onChange={(e) => setCurrentUser({ ...currentUser, is2FAEnabled: e.target.checked })}
                          className="accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Push Notifications</span>
                        <input
                          type="checkbox"
                          checked={currentUser.pushEnabled}
                          onChange={(e) => setCurrentUser({ ...currentUser, pushEnabled: e.target.checked })}
                          className="accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Transaction Billing History */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>{lang === 'bn' ? 'ট্রানজেকশন ও ইনভয়েস' : 'Billing History'}</span>
                        <span className="text-[9px] text-emerald-400 font-mono font-bold">{transactions.length} Logs</span>
                      </h4>

                      <div className="space-y-1.5 text-[10px]">
                        {transactions.map((t) => (
                          <div key={t.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-200">{t.serviceTitle}</p>
                              <p className="text-slate-400 font-mono">{t.trxId} • {t.provider}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-400">৳{t.amountBdt}</p>
                              <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {t.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* MOBILE TAB 5: SUPPORT & LIVE CHATBOT */}
                {activeMobileTab === 'support' && (
                  <div className="space-y-3">
                    
                    {/* Chat Box Container */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 h-[260px] flex flex-col justify-between">
                      <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'bn' ? 'লাইভ চ্যাটবট অ্যাসিস্ট্যান্ট' : 'Live AI Chatbot Support'}</span>
                        </span>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                          ONLINE
                        </span>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-2 rounded-xl text-[11px] ${
                                msg.sender === 'user'
                                  ? 'bg-emerald-600 text-white rounded-br-none'
                                  : 'bg-slate-800 text-slate-200 rounded-bl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[8px] text-slate-500 font-mono mt-0.5">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Input Box */}
                      <form onSubmit={handleSendChatMessage} className="flex gap-1.5 pt-1 border-t border-slate-800">
                        <input
                          type="text"
                          placeholder={lang === 'bn' ? 'বার্তা লিখুন...' : 'Type message...'}
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'bn' ? 'সাধারণ প্রশ্নাবলী (FAQ)' : 'Frequently Asked Questions'}</span>
                      </h4>

                      <div className="space-y-1.5 text-xs">
                        {[
                          {
                            qBn: 'ক্যাশআউট চার্জ কত?',
                            qEn: 'What is the cashout charge?',
                            aBn: 'সকল প্রিমিয়াম ব্যবহারকারীর জন্য ক্যাশআউট সুবিধা ১০০% জিরো-চার্জ।',
                            aEn: 'Cashout is 100% zero-charge for all Premium members.'
                          },
                          {
                            qBn: 'পেমেন্ট গেটওয়ে কীভাবে নির্বাচন করব?',
                            qEn: 'How to select a payment gateway?',
                            aBn: 'সার্ভিস বুকিং অপশনে বিকাশ, নগদ, রকেট অথবা কার্ড সিলেক্ট করতে পারেন।',
                            aEn: 'Select bKash, Nagad, Rocket, or Stripe during checkout.'
                          }
                        ].map((faq, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                            <button
                              onClick={() => setFaqExpanded(faqExpanded === idx ? null : idx)}
                              className="w-full text-left font-bold text-slate-200 flex justify-between items-center text-[11px]"
                            >
                              <span>{lang === 'bn' ? faq.qBn : faq.qEn}</span>
                              <span>{faqExpanded === idx ? '-' : '+'}</span>
                            </button>
                            {faqExpanded === idx && (
                              <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800/60 pt-1">
                                {lang === 'bn' ? faq.aBn : faq.aEn}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* MOBILE BOTTOM NAVIGATION BAR */}
                <div className="mt-4 pt-2 border-t border-slate-800/80 grid grid-cols-5 gap-1 text-center bg-slate-900 rounded-2xl p-1.5">
                  {[
                    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Smartphone },
                    { id: 'services', labelBn: 'সার্ভিস', labelEn: 'Services', icon: Layers },
                    { id: 'notifications', labelBn: 'অ্যালার্ট', labelEn: 'Alerts', icon: Bell, badge: unreadNotifCount },
                    { id: 'profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User },
                    { id: 'support', labelBn: 'সাপোর্ট', labelEn: 'Support', icon: HelpCircle }
                  ].map((nav) => {
                    const Icon = nav.icon;
                    const isActive = activeMobileTab === nav.id;
                    return (
                      <button
                        key={nav.id}
                        onClick={() => setActiveMobileTab(nav.id as AppViewTab)}
                        className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                          isActive
                            ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] mt-0.5 font-bold">
                          {lang === 'bn' ? nav.labelBn : nav.labelEn}
                        </span>
                        {nav.badge && nav.badge > 0 && !isActive ? (
                          <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR: FEATURE OVERVIEW & ARCHITECTURE METRICS */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Feature Highlights Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? 'SRS স্পেসিফিকেশন ফিচার সামারি' : 'SRS Specification Summary'}</span>
                </h3>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>1. Onboarding & Dashboard:</strong> Interactive 3-slide welcome, bottom nav bar & profile cards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>2. Authentication & Profile:</strong> Mobile OTP verification, Google Auth & 2FA toggles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>3. Payments & Gateways:</strong> bKash, Nagad, Rocket & Stripe credit card checkout.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>4. Real-Time Alerts:</strong> Firebase FCM push messaging simulation & inbox management.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>5. Support & AI Chatbot:</strong> Live chatbot, expandable FAQs & feedback submission.</span>
                  </li>
                </ul>
              </div>

              {/* Quick Launch Payment Simulation Button */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800 p-5 rounded-2xl space-y-3 shadow-xl">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  MONETIZATION GATEWAY
                </span>
                <h4 className="text-xs font-bold text-slate-100">
                  {lang === 'bn' ? 'পেমেন্ট ও অর্ডার টেস্ট মোড' : 'Test Service Order & Payment'}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {lang === 'bn'
                    ? 'যেকোনো একটি সার্ভিস সিলেক্ট করে ট্রানজেকশন ফ্লো পরীক্ষা করতে নিচের বাটনে চাপ দিন।'
                    : 'Click below to launch instant checkout flow with bKash/Nagad/Stripe.'}
                </p>

                <button
                  onClick={() => {
                    setSelectedService(services[0]);
                    setActiveMobileTab('services');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'টেস্ট পেমেন্ট মোড ওপেন করুন' : 'Open Test Payment Checkout'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* PLATFORM VIEW 2: CENTRALIZED WEB ADMIN DASHBOARD PANEL */}
        {activePlatformView === 'admin' && (
          <div className="space-y-6">
            
            {/* Admin Header Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Daily Active Users (DAU)</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-extrabold font-mono text-slate-100">3,850 Users</p>
                <p className="text-[10px] text-emerald-400 font-bold">+18.4% from last week</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Gateway Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xl font-extrabold font-mono text-slate-100">৳100,000 BDT</p>
                <p className="text-[10px] text-amber-400 font-bold">bKash/Nagad/Stripe Audited</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Pending Service Orders</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xl font-extrabold font-mono text-slate-100">
                  {adminServiceRequests.filter((r) => r.status === 'PENDING').length} Requests
                </p>
                <p className="text-[10px] text-blue-400 font-bold">Requires Action</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>System Health Metrics</span>
                  <ActivityIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-extrabold font-mono text-slate-100">99.98% Uptime</p>
                <p className="text-[10px] text-emerald-400 font-bold">FCM & PDO Active</p>
              </div>

            </div>

            {/* Recharts Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* DAU Activity Area Chart */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Daily Active Users (DAU) & Engagement Trend</h3>
                    <p className="text-xs text-slate-400">Comparing Free vs Premium Subscribers activity</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                    Live Telemetry
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dauChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="freeColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="premColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="freeUsers" stroke="#10b981" fillOpacity={1} fill="url(#freeColor)" name="Free Users" />
                      <Area type="monotone" dataKey="premiumUsers" stroke="#f59e0b" fillOpacity={1} fill="url(#premColor)" name="Premium Users" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Distribution Pie Chart */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100">Gateway Revenue Share</h3>
                  <p className="text-xs text-slate-400">bKash, Nagad, Rocket & Stripe distribution</p>
                </div>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="bdt"
                      >
                        {revenueChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {revenueChartData.map((item, idx) => (
                    <div key={item.gateway} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-slate-300 font-bold">{item.gateway}:</span>
                      <span className="text-emerald-400 font-bold">৳{item.bdt.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Admin Management Tables (Service Orders & User RBAC) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Service Orders Management Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Incoming Service Orders</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Queue Management</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="p-2">User</th>
                        <th className="p-2">Service</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {adminServiceRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/40">
                          <td className="p-2">
                            <p className="font-bold text-slate-200">{req.userName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{req.userPhone}</p>
                          </td>
                          <td className="p-2 text-slate-300">{req.serviceTitle}</td>
                          <td className="p-2 font-mono font-bold text-emerald-400">৳{req.amount}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            {req.status === 'PENDING' && (
                              <button
                                onClick={() => {
                                  setAdminServiceRequests((prev) =>
                                    prev.map((r) => (r.id === req.id ? { ...r, status: 'APPROVED' } : r))
                                  );
                                }}
                                className="px-2 py-1 bg-emerald-600 text-slate-950 font-bold text-[10px] rounded hover:bg-emerald-500"
                              >
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User RBAC Role Management Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>User RBAC & Access Control</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Role Permissions</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="p-2">Name & Phone</th>
                        <th className="p-2">Current Role</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40">
                          <td className="p-2">
                            <p className="font-bold text-slate-200">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.phone}</p>
                          </td>
                          <td className="p-2 font-mono font-bold text-amber-400">{u.role}</td>
                          <td className="p-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {u.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <select
                              value={u.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setAdminUsers((prev) =>
                                  prev.map((user) => (user.id === u.id ? { ...user, role: newRole as any } : user))
                                );
                              }}
                              className="bg-slate-950 text-slate-200 text-[10px] font-bold rounded border border-slate-700 px-1.5 py-0.5 focus:outline-none"
                            >
                              <option value="FREE">FREE</option>
                              <option value="PREMIUM">PREMIUM</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Database Schema & REST API Architecture Viewer */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Database Architecture & REST API Spec</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">PostgreSQL / MongoDB / Firebase OpenAPI</span>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>{`// REST API ENDPOINTS SPECIFICATION
POST /api/v1/auth/send-otp        -> { phone: string } -> { otpSent: true }
POST /api/v1/auth/verify-otp      -> { phone: string, otp: string } -> { token: "JWT", user: {...} }
GET  /api/v1/services             -> returns Categorized Services List
POST /api/v1/payments/checkout    -> { serviceId, gateway: "bKash"|"Stripe", phone } -> { status: "SUCCESS", trxId }
GET  /api/v1/notifications        -> returns Push Inbox Array
GET  /api/v1/admin/analytics/dau  -> returns Recharts Telemetry Array`}</pre>
              </div>
            </div>

          </div>
        )}

        {/* PAYMENT CHECKOUT MODAL */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  PAYMENT CHECKOUT GATEWAY
                </span>
                <h3 className="text-base font-extrabold text-slate-100">
                  {lang === 'bn' ? selectedService.titleBn : selectedService.titleEn}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? selectedService.descBn : selectedService.descEn}
                </p>
              </div>

              {/* Amount Display */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-xs text-slate-400">{lang === 'bn' ? 'মোট প্রদেয় অর্থ:' : 'Total Payable:'}</span>
                <span className="text-xl font-extrabold font-mono text-emerald-400">
                  ৳{selectedService.priceBdt} BDT
                </span>
              </div>

              {/* Gateway Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Gateway:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {['bKash', 'Nagad', 'Rocket', 'Stripe Cards'].map((gw) => (
                    <button
                      key={gw}
                      onClick={() => setPaymentGateway(gw as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentGateway === gw
                          ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-extrabold shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone or Card Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {paymentGateway === 'Stripe Cards'
                    ? (lang === 'bn' ? 'কার্ড নম্বর:' : 'Card Number:')
                    : (lang === 'bn' ? 'মোবাইল ব্যাংকিং নম্বর:' : 'Mobile Wallet Phone:')}
                </label>
                <input
                  type="text"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {paymentSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{paymentSuccessMsg}</span>
                </div>
              )}

              <button
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-black text-xs shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'bn' ? 'প্রসেসিং করা হচ্ছে...' : 'Processing Payment...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm & Pay Now'}</span>
                  </>
                )}
              </button>

            </div>
          </div>
        )}

        {/* AUTHENTICATION & SECURITY SETTINGS MODAL */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500 text-slate-950">
                  SRS MODULE 2: AUTHENTICATION
                </span>
                <h3 className="text-base font-extrabold text-slate-100">
                  {lang === 'bn' ? 'লগইন ও নিরাপত্তা সেটিংস' : 'Sign In & Authentication'}
                </h3>
              </div>

              {/* Auth Method Pills */}
              <div className="flex border-b border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setAuthMethod('otp')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    authMethod === 'otp' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Mobile OTP
                </button>
                <button
                  onClick={() => setAuthMethod('email')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    authMethod === 'email' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                  }`}
                >
                  Email & Password
                </button>
              </div>

              {/* OTP Form */}
              {authMethod === 'otp' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">
                      {lang === 'bn' ? 'মোবাইল নম্বর:' : 'Mobile Number:'}
                    </label>
                    <input
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 mt-1"
                    />
                  </div>

                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                    >
                      {lang === 'bn' ? 'ওটিপি পাঠাত অনুরোধ করুন' : 'Send OTP Code'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-bold text-slate-300">
                            {lang === 'bn' ? '৪-সংখ্যার ওটিপি লিখুন (Test: 1234):' : 'Enter 4-Digit OTP (Test: 1234):'}
                          </label>
                          <span className="text-[10px] text-amber-400 font-mono">
                            Resend in {otpTimer}s
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="1234"
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:border-emerald-500 mt-1"
                        />
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                      >
                        {lang === 'bn' ? 'ওটিপি ভেরিফাই করুন' : 'Verify OTP & Sign In'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Google Auth Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setShowAuthModal(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Sign in with Google</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};

// Helper Icon Component
const HeartPulseIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.646a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ActivityIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
