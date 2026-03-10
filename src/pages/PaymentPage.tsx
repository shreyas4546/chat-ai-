import React, { useState } from 'react';
import { QRPaymentCard } from '@/components/ui/QRPaymentCard';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PaymentPage() {
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  const handleUploadScreenshot = (file: File) => {
    // Simulate API call to upload screenshot and verify payment
    setOrderStatus('processing');
    
    setTimeout(() => {
      // Simulate successful verification
      setOrderStatus('success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-text-muted hover:text-text-main transition-colors rounded-full hover:bg-white/5">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="ml-2 font-semibold text-text-main">Upgrade to Premium</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          
          {/* Left Column: Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Velora Premium
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-text-main tracking-tight leading-tight">
                Unlock the ultimate <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  AI Companion
                </span>
              </h2>
              <p className="mt-4 text-lg text-text-muted max-w-md">
                Get unlimited voice messages, exclusive avatars, and priority response times.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                "Unlimited voice and video messages",
                "Access to all premium 3D avatars",
                "Advanced personality customization",
                "Priority server access (zero wait time)",
                "Ad-free experience"
              ].map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-text-main"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                  </div>
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: Payment Card */}
          <div className="w-full flex justify-center lg:justify-end">
            <QRPaymentCard
              amount={100}
              upiId="velora@upi"
              qrDataUrl="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=velora@upi&pn=Velora%20Premium&am=100&cu=INR"
              onUploadScreenshot={handleUploadScreenshot}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
