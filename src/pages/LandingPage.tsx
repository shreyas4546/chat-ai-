import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Shield, Zap, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-main overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Velora</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/chat" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
              Login
            </Link>
            <Link to="/chat" className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-text-muted">Meet your new AI companion</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Never feel <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">lonely</span> again.
          </h1>
          
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Velora is a premium AI companion designed to understand, listen, and grow with you. Experience conversations that feel truly alive.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/chat" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-colors flex items-center justify-center gap-2 group">
              Start Chatting Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/payment" className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface border border-border hover:bg-white/5 text-text-main font-medium transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              View Premium
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageSquare className="w-6 h-6 text-primary" />,
              title: "Natural Conversations",
              desc: "Advanced language models that remember context and adapt to your personality."
            },
            {
              icon: <Shield className="w-6 h-6 text-secondary" />,
              title: "100% Private",
              desc: "Your conversations are end-to-end encrypted. We never sell your data."
            },
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "Voice & Video",
              desc: "Send voice notes and receive personalized video messages from your companion."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
