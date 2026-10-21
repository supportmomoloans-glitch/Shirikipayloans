import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Upload,
  ArrowRight,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';

// Exact SVG of the Shiriki Red Swoosh Logo
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
  agreedToTerms: boolean;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  
  // Urgent countdown timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 36,
    seconds: 40,
  });

  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    agreedToTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Processing state for Step 4
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingTime, setProcessingTime] = useState<number>(180); // 3 minutes
  const [applicationId] = useState<string>(() => `SHK-${Math.floor(100000 + Math.random() * 900000)}`);
  
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing && processingTime > 0) {
      interval = setInterval(() => {
        setProcessingTime(t => {
          if (t <= 1) {
            setIsProcessing(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing, processingTime]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.phone.trim() || formData.phone.length < 9) newErrors.phone = 'Valid phone required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'National ID required';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Must agree to terms';
    
    if (loanAmount < 10000 || loanAmount > 19000) {
      newErrors.loanAmount = 'Strictly 10,000 - 19,000';
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
      setErrors(prev => ({ ...prev, upload: 'Upload your verification screenshot' }));
      return;
    }
    setIsProcessing(true);
    setCurrentStep(4);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#025928] text-white flex flex-col justify-between selection:bg-[#00B050] selection:text-white font-['Outfit'] relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-shiriki-grid opacity-30 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"></div>

      {/* Top Header Bar */}
      <header className="relative z-20 max-w-[420px] w-full mx-auto px-4 pt-2.5 pb-1 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="text-left cursor-pointer group"
        >
          <span className="font-extrabold text-black tracking-tight text-lg sm:text-xl drop-shadow-xs group-hover:text-white transition-colors">
            SHIRIKI PAY <span className="text-[#00FF66] font-black">LOANS</span>
          </span>
          <span className="block text-[9px] sm:text-[10px] text-emerald-200/90 font-semibold tracking-wider uppercase -mt-0.5">
            Instant Credit & Loans
          </span>
        </button>

        {/* Options Button: "... | ⨂" */}
        <button
          type="button"
          onClick={() => setShowOptionsModal(true)}
          className="bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/25 text-white rounded-full px-2.5 py-1 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all text-xs"
          aria-label="Options"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-white" />
          <span className="w-px h-3 bg-white/40"></span>
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </header>

      {/* Promotional Strip */}
      <div className="relative z-10 max-w-[420px] w-full mx-auto px-4 shrink-0">
        <div className="bg-emerald-950/75 backdrop-blur-md border border-emerald-400/35 rounded-full px-3 py-1 flex items-center justify-between text-xs text-emerald-100 shadow-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
            <span className="font-extrabold text-amber-300 uppercase text-[9px] sm:text-[10px] tracking-wider shrink-0">Offer:</span>
            <span className="truncate font-semibold text-[11px] sm:text-xs">KES 10,000 – 19,000</span>
          </div>
          <div className="font-mono font-black text-amber-300 text-[11px] sm:text-xs flex items-center gap-1 shrink-0 ml-2">
            <Clock className="w-3 h-3" />
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Centered, Zoomed Look, All Buttons in Sight */}
      <main className="relative z-10 max-w-[420px] w-full mx-auto px-4 py-1.5 flex-1 flex flex-col justify-center overflow-y-auto no-scrollbar">

        {/* STEP 0: HOMEPAGE (Bolder, Punchy & Fully Visible) */}
        {currentStep === 0 && (
          <div className="flex flex-col justify-between h-full max-h-full py-1">
            
            {/* Header Titles */}
            <div className="text-center shrink-0 mb-1">
              <h1 className="text-2xl sm:text-[26px] font-black text-white tracking-tight leading-tight">
                Smart payments, shared wallet
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-[13px] mt-1 max-w-xs mx-auto leading-snug line-clamp-2 font-normal">
                Decide how much freedom each beneficiary has to spend — set limits, permissions, and monitor usage.
              </p>
            </div>

            {/* The Signature Card with Center Emblem */}
            <div className="relative pt-6 shrink-0 my-auto">
              <div className="bg-gradient-to-b from-[#187740] via-[#106233] to-[#0a4e27] rounded-[22px] p-3 pt-7 shadow-xl border border-white/20 relative">
                
                {/* Center Circle Logo */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#025928] z-20">
                  <ShirikiRedLogo className="w-7 h-4" />
                </div>

                {/* Main White Limit Card */}
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 text-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      Enter limit (Loan Amount)
                    </label>
                    <span className="text-[10px] font-black text-[#00A859] uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      10k - 19k KES
                    </span>
                  </div>

                  <div className="border-2 border-slate-200 rounded-xl px-3 py-1.5 flex items-center justify-between bg-white focus-within:border-[#00A859] focus-within:ring-2 focus-within:ring-[#00A859]/20 transition-all">
                    <input
                      type="number"
                      min="10000"
                      max="19000"
                      step="500"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full text-lg sm:text-xl font-black text-slate-900 focus:outline-none font-mono tracking-tight"
                    />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-400 pl-2">Ksh</span>
                  </div>

                  {/* Range Slider */}
                  <div className="mt-2">
                    <input
                      type="range"
                      min="10000"
                      max="19000"
                      step="500"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A859]"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5 font-mono font-bold">
                      <span>10k Ksh</span>
                      <span className="text-[#00A859] font-black text-[11px]">{loanAmount.toLocaleString()} Ksh</span>
                      <span>19k Ksh</span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-4 gap-1.5 mt-2 pt-2 border-t border-slate-100">
                    {[10000, 13000, 16000, 19000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        className={`py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                          loanAmount === amt
                            ? 'bg-[#00A859] text-white border-[#00A859] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {amt / 1000}k
                      </button>
                    ))}
                  </div>

                </div>

              </div>
            </div>

            {/* 3 Indicator Dots */}
            <div className="flex items-center justify-center gap-2 py-1.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${activeSlide === 0 ? 'bg-white scale-125 ring-2 ring-white/40' : 'bg-white/40'}`} />
              <span className={`w-2 h-2 rounded-full ${activeSlide === 1 ? 'bg-white scale-125 ring-2 ring-white/40' : 'bg-white/40'}`} />
              <span className={`w-2 h-2 rounded-full ${activeSlide === 2 ? 'bg-white scale-125 ring-2 ring-white/40' : 'bg-white/40'}`} />
            </div>

            {/* Bolder, Prominent Get Started Button */}
            <div className="shrink-0 pt-0.5">
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setActiveSlide(1); }}
                className="w-full py-3 sm:py-3.5 bg-[#00B050] hover:bg-[#009E47] active:scale-[0.99] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-base sm:text-lg tracking-wide transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ShirikiRedLogo className="w-6 h-3.5 brightness-110" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 1: Personal Info (Larger Inputs & Buttons, Still Viewport Fit) */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-800 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#00A859]">Borrower</span> Details
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Enter details for verification & loan payout
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-5 h-3" />
              </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-[#F8FAF9] px-3 py-1.5 rounded-xl border border-slate-200 mb-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold text-xs">Selected Limit:</span>
              <span className="font-black text-[#00A859] font-mono text-sm">
                KES {loanAmount.toLocaleString()}
              </span>
            </div>

            {/* Form Fields: Comfortable, Larger Inputs */}
            <div className="space-y-2 text-xs">
              
              {/* Row 1: First & Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                      errors.firstName ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                      errors.lastName ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Email & National ID */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                      errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="National ID"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                      errors.idNumber ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Country & Phone */}
              <div className="flex gap-2">
                <div className="border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold text-slate-700">
                  <span>🇰🇪 +254</span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Phone (e.g. 712...)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A859] ${
                      errors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Error messages if any */}
              {(errors.firstName || errors.lastName || errors.email || errors.phone || errors.idNumber) && (
                <p className="text-[11px] text-red-500 font-bold">Please fill all required fields correctly.</p>
              )}

              {/* Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="h-3.5 w-3.5 rounded text-[#00A859] focus:ring-[#00A859] border-slate-300 accent-[#00A859]"
                />
                <span className="text-[10px] sm:text-[11px] text-slate-600">
                  I agree to the <span className="text-[#00A859] font-bold underline">terms & conditions</span> of Shiriki Loans.
                </span>
              </label>

              {/* Actions: Bigger Button */}
              <div className="pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setCurrentStep(2);
                    }
                  }}
                  className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-black rounded-xl shadow-lg text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: How to Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="w-full py-1 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: How to Apply (Bold, Zoomed Look) */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-800 my-auto space-y-3">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#00A859]">How to</span> Apply
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Review summary and proceed to verification
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-5 h-3" />
              </div>
            </div>

            {/* Clean summary info */}
            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Applicant:</span>
                <span className="font-black text-slate-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Receiving Line:</span>
                <span className="font-black text-slate-800 font-mono">+254 {formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Loan Amount:</span>
                <span className="font-black text-[#00A859] font-mono text-sm sm:text-base">KES {loanAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Steps Info */}
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">1</span>
                <span className="font-medium">Details & National ID entered.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">2</span>
                <span className="font-medium">Confirm screenshot from your Safaricom message.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">3</span>
                <span className="font-medium">Automatic 2-3 minute review and disbursement.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-1.5 space-y-1.5">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-black rounded-xl shadow-lg text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Upload Screenshot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full py-1 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Back to Details
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Upload Screenshot (Bold & Prominent) */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-800 my-auto space-y-2.5">
            
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                <span className="text-[#00A859]">Upload</span> Verification
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Upload confirmation message received from Safaricom.
              </p>
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center bg-[#F8FAF9] hover:border-[#00A859] transition-colors">
              <input
                type="file"
                id="verification-screenshot"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-1.5">
                  <img src={previewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg shadow-sm border border-slate-200 object-contain" />
                  <p className="text-[11px] font-bold text-slate-800 truncate max-w-xs mx-auto">{uploadedFile?.name}</p>
                  <label
                    htmlFor="verification-screenshot"
                    className="inline-block text-xs font-black text-[#00A859] underline cursor-pointer"
                  >
                    Change Image
                  </label>
                </div>
              ) : (
                <label htmlFor="verification-screenshot" className="cursor-pointer block py-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#00A859] flex items-center justify-center mx-auto mb-1.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-black text-slate-800 block">Choose Screenshot</span>
                  <span className="text-[11px] text-slate-500 font-medium block">Tap to select photo from device</span>
                </label>
              )}
            </div>

            {errors.upload && (
              <p className="text-[11px] text-red-500 text-center font-bold">{errors.upload}</p>
            )}

            {/* Checklist */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] sm:text-[11px] text-slate-700 space-y-1 font-medium">
              <div className="flex items-center gap-1.5 text-emerald-800">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Screenshot confirms active Safaricom message</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Recipient: +254 {formData.phone || '7xx...'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 space-y-1.5">
              <button
                type="button"
                onClick={handleSubmitApplication}
                className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-black rounded-xl shadow-lg text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Verification & Complete</span>
                <Check className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-1 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Back
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Processing & Confirmation (Bolder & Clear) */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-800 my-auto space-y-2.5">
            
            <div className="text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-1.5">
                <ShirikiRedLogo className="w-6 h-3" />
              </div>
              
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black ${isProcessing ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#00A859]'}`}>
                {isProcessing ? 'Verification In Progress' : 'Loan Approved'}
              </span>

              <h2 className="text-lg sm:text-xl font-black tracking-tight mt-1 text-slate-900">
                {isProcessing ? 'Please Wait 2 to 3 Minutes' : 'Disbursement Successful!'}
              </h2>

              <p className="text-[11px] text-slate-500 font-medium">
                Ref: <span className="font-mono font-black text-slate-800">{applicationId}</span>
              </p>
            </div>

            {/* Timer countdown */}
            {isProcessing ? (
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#00A859] tracking-tight mb-1">
                  {formatTimer(processingTime)}
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Processing loan of <span className="font-bold">KES {loanAmount.toLocaleString()}</span> to <span className="font-mono font-bold">+254 {formData.phone}</span>.
                </p>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#00A859] h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((180 - processingTime) / 180) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#00A859] mx-auto mb-1" />
                <h3 className="font-black text-slate-900 text-sm sm:text-base">Disbursement Confirmed</h3>
                <p className="text-xs text-slate-600 font-medium">
                  <span className="font-black text-[#00A859]">KES {loanAmount.toLocaleString()}</span> will credit to your wallet shortly.
                </p>
              </div>
            )}

            {/* Receipt Summary */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Number:</span>
                <span className="font-mono font-bold text-slate-800">+254 {formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-black text-[#00A859]">KES {loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Term:</span>
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
              className="w-full py-2.5 bg-[#00B050] hover:bg-[#009E47] text-white font-black rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              Back to Home
            </button>

          </div>
        )}

      </main>

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-1.5">
                <ShirikiRedLogo className="w-5 h-2.5" />
                <span className="font-black text-xs text-slate-900">SHIRIKI PAY <span className="text-[#00A859]">LOANS</span></span>
              </div>
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => { setCurrentStep(0); setShowOptionsModal(false); }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-bold text-slate-800 block text-xs"
              >
                🏠 Home Screen
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setShowOptionsModal(false); }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-bold text-slate-800 block text-xs"
              >
                📝 Personal Details Form
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(2); setShowOptionsModal(false); }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-bold text-slate-800 block text-xs"
              >
                📖 How to Apply
              </button>
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                Helpline: 0800 221 334 (Toll-free, 24/7)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowOptionsModal(false)}
              className="mt-3 w-full py-2 bg-[#00B050] hover:bg-[#009E47] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
