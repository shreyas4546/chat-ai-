import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Copy, Check, Upload, ExternalLink, ShieldCheck, CreditCard, Smartphone, X } from 'lucide-react';

export interface QRPaymentCardProps {
  amount: number;
  upiId: string;
  qrDataUrl: string;
  onUploadScreenshot: (file: File) => void;
  orderStatus: 'pending' | 'processing' | 'success' | 'failed';
}

export function QRPaymentCard({ amount, upiId, qrDataUrl, onUploadScreenshot, orderStatus }: QRPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (screenshot) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onUploadScreenshot(screenshot);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleDeepLink = () => {
    // Basic UPI deep link format
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Velora%20Premium&am=${amount}&cu=INR`;
    window.location.href = upiUrl;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-surface/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 text-center border-b border-border/50">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-3 shadow-[0_0_15px_rgba(157,78,221,0.3)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight">Premium Upgrade</h2>
        <p className="text-text-muted text-sm mt-1">Secure UPI Payment</p>
        <div className="mt-4 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          ₹{amount}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-inner ring-1 ring-black/5">
            <img 
              src={qrDataUrl} 
              alt="Payment QR Code" 
              className="w-48 h-48 object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Scan with any UPI app</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-background/50 hover:bg-background border border-border rounded-xl text-sm font-medium transition-colors group"
          >
            {copied ? (
              <Check className="w-4 h-4 text-secondary" />
            ) : (
              <Copy className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            )}
            <span className={copied ? "text-secondary" : "text-text-main"}>
              {copied ? "Copied!" : "Copy UPI ID"}
            </span>
          </button>
          
          <button 
            onClick={handleDeepLink}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-sm font-medium text-primary transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Pay Now
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase tracking-wider">Step 2</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-main">
            Upload Payment Screenshot
          </label>
          
          <div className={cn(
            "relative border-2 border-dashed rounded-xl p-6 transition-colors text-center",
            screenshot ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-background/50"
          )}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={orderStatus === 'processing' || orderStatus === 'success'}
            />
            
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              {screenshot ? (
                <>
                  <Check className="w-8 h-8 text-secondary mb-1" />
                  <span className="text-sm font-medium text-text-main truncate max-w-[200px]">
                    {screenshot.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    Ready to upload
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-text-muted mb-1" />
                  <span className="text-sm font-medium text-text-main">
                    Tap or drag screenshot here
                  </span>
                  <span className="text-xs text-text-muted">
                    JPEG, PNG up to 5MB
                  </span>
                </>
              )}
            </div>
          </div>

          <AnimatePresence>
            {screenshot && orderStatus !== 'success' && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={handleUpload}
                disabled={isUploading || orderStatus === 'processing'}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {isUploading || orderStatus === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Payment
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Status Polling UI */}
        <AnimatePresence>
          {orderStatus !== 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl flex items-start gap-3 border",
                orderStatus === 'processing' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                orderStatus === 'success' ? "bg-secondary/10 border-secondary/20 text-secondary" :
                "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              {orderStatus === 'processing' && <div className="w-5 h-5 mt-0.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {orderStatus === 'success' && <Check className="w-5 h-5 mt-0.5" />}
              {orderStatus === 'failed' && <X className="w-5 h-5 mt-0.5" />}
              
              <div>
                <h4 className="font-medium text-sm">
                  {orderStatus === 'processing' && "Verifying Payment"}
                  {orderStatus === 'success' && "Payment Successful"}
                  {orderStatus === 'failed' && "Verification Failed"}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {orderStatus === 'processing' && "Please wait while we confirm with the bank. This usually takes 1-2 minutes."}
                  {orderStatus === 'success' && "Your premium features are now active. Enjoy Velora!"}
                  {orderStatus === 'failed' && "We couldn't verify this payment. Please try again or contact support."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
