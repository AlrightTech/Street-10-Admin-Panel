import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/auth";
import {
  Eye,
  EyeOff,
  ChevronDown,
  Linkedin,
  Facebook,
  Mail,
  Phone,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const { t, language, changeLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill email from URL query parameter (when redirected from signup)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  // Carousel slides data
  const carouselSlides = [
    {
      titleEn: ["Manage Products,", "Sales & Customer Requests."],
      titleAr: ["إدارة المنتجات،", "المبيعات وطلبات العملاء."],
    },
    {
      titleEn: ["Grow Your Business", "Easily & Efficiently."],
      titleAr: ["نمو أعمالك", "بسهولة وفعالية."],
    },
    {
      titleEn: ["Full Control Over", "Your Store & Sales."],
      titleAr: ["تحكم كامل في", "متجرك ومبيعاتك."],
    },
  ];

  // Get current slide title based on language
  const getCurrentSlideTitle = () => {
    const slide = carouselSlides[currentSlide];
    return language === "ar" ? slide.titleAr : slide.titleEn;
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!password.trim()) {
      setErrors({ password: "Password is required" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Call actual login API
      const result = await authService.login({ email, password });
      
      // Set role based on user role from response
      if (result.user?.role) {
        setRole(result.user.role as any);
      } else {
        setRole("vendor"); // Default to vendor for admin panel
      }
      
      // Store refresh token if provided
      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Login failed. Please check your credentials.";
      setErrors({ 
        email: errorMessage.includes("email") ? errorMessage : undefined,
        password: errorMessage.includes("password") || errorMessage.includes("credentials") ? errorMessage : undefined
      });
      
      // If no specific field error, show general error
      if (!errorMessage.includes("email") && !errorMessage.includes("password")) {
        setErrors({ password: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F3F5F6" }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm"
        style={{ backgroundColor: "#F3F5F6" }}
      >
        <div className="flex items-center gap-3">
          {/* Circular Logo with White Background */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shadow-sm">
            <img
              src="/images/sidebar-topicon.png"
              alt="Street10 mazad"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-normal text-gray-900" style={{ fontFamily: 'sans-serif' }}>
            Street10 mazad
          </span>
        </div>
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {language === "ar" ? (
              <>
                <img
                  src="https://flagcdn.com/w40/qa.png"
                  alt="Qatar"
                  className="w-5 h-4 object-cover rounded"
                />
                <span className="text-sm text-gray-700">Arabic</span>
              </>
            ) : (
              <>
                <img
                  src="https://flagcdn.com/w40/gb.png"
                  alt="English"
                  className="w-5 h-4 object-cover rounded"
                />
                <span className="text-sm text-gray-700">English</span>
              </>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                showLanguageDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[150px] overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  changeLanguage("en");
                  setShowLanguageDropdown(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  language === "en" ? "bg-gray-50" : ""
                }`}
              >
                <img
                  src="https://flagcdn.com/w40/gb.png"
                  alt="English"
                  className="w-5 h-4 object-cover rounded"
                />
                <span className="text-sm text-gray-700">English</span>
                {language === "en" && (
                  <span className="ml-auto text-orange-500">✓</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  changeLanguage("ar");
                  setShowLanguageDropdown(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  language === "ar" ? "bg-gray-50" : ""
                }`}
              >
                <img
                  src="https://flagcdn.com/w40/qa.png"
                  alt="Arabic"
                  className="w-5 h-4 object-cover rounded"
                />
            <span className="text-sm text-gray-700">Arabic</span>
                {language === "ar" && (
                  <span className="ml-auto text-orange-500">✓</span>
                )}
              </button>
          </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative pt-20">
        {/* Left Section - Image with Overlay */}
        <div className="hidden lg:flex lg:w-2/3 relative">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/login-page-img.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="relative z-10 flex flex-col justify-center px-20 py-16 text-white">
            <h1 className="text-6xl font-bold mb-8 leading-[1.3] min-h-[250px] transition-opacity duration-500 drop-shadow-lg text-left">
              <span className="mb-4">{getCurrentSlideTitle().join(" ")}</span>
            </h1>
            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-8">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-orange-500 w-8"
                      : "bg-white bg-opacity-30 hover:bg-opacity-50 w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
          </div>
          </div>

          {/* Curved Separator - S-shaped curve with orange outline attached to image edge */}
          {/* <div className="absolute right-0 top-0 bottom-0 w-[100px] z-20 pointer-events-none"> */}
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ height: "100%" }}
          >
            {/* Background fill for the curve - light gray */}
            <path
              d="M 0,0 C 50,15 50,85 0,100 L 0,100 L 100,100 L 100,0 Z"
              fill="#F3F5F6"
            />
            {/* Orange outline curve - S-shaped */}
            {/* <path 
                d="M 0,0 C 50,15 50,85 0,100" 
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              /> */}
          </svg>
          {/* </div> */}
        </div>

        {/* Right Section - Login Form */}
        <div
          className="w-full lg:w-1/3 flex items-center justify-center p-8 relative"
          style={{ backgroundColor: "#F3F5F6" }}
        >
          <div className="w-full max-w-md relative z-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2 font-sans"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {t("email") || "Email"}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("enterEmail") || "Enter Email"}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{ fontFamily: 'sans-serif', fontSize: '14px' }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2 font-sans"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {t("password") || "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPassword") || "Enter Password"}
                    className={`w-full px-4 py-3 pr-10 bg-white border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ fontFamily: 'sans-serif', fontSize: '14px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'sans-serif', fontSize: '16px' }}
              >
                {loading
                  ? t("loggingIn") || "Logging in..."
                  : t("login") || "Login"}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'sans-serif' }}>
                  {t("forgetPassword") || "Forget Password?"}{" "}
                </span>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  {t("reset") || "Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-white py-6 px-6"
        style={{ backgroundColor: "#4C50A2" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/images/sidebar-topicon.png"
              alt="Street10 mazad"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold">Street10 mazad</span>
          </div>

          {/* Middle - Social Media */}
          <div className="flex items-center gap-3 text-sm">
            <span>Join us social platform to stay updated</span>
            <a
              href="https://www.linkedin.com/company/street10"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#0A66C2" }}
            >
              <Linkedin size={20} className="text-white" />
            </a>
            <a
              href="https://www.facebook.com/street10"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#0A66C2" }}
            >
              <Facebook size={20} className="text-white" />
            </a>
          </div>

          {/* Right - Contact */}
          <div className="flex flex-col md:flex-row items-center gap-3 text-sm">
            <span className="font-medium">Contact</span>
            <a
              href="mailto:contact-us@street10.com"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail size={16} />
              <span>contact-us@street10.com</span>
            </a>
            <span>|</span>
            <a
              href="tel:+203333333333"
              className="flex items-center gap-2 hover:underline"
            >
              <Phone size={16} />
              <span>+20 333 3333333</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
