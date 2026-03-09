"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Check, Instagram, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-blue-600">NutriAgent AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider">
            Log In
          </Link>
          <Link href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            START TODAY
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-3 md:space-y-4 max-w-3xl"
          >
            <p className="text-blue-100 font-bold tracking-widest uppercase text-sm">#1 AI Nutrition System</p>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Nutrition tracking <br />
              <span className="bg-white text-blue-600 px-4 inline-block mt-2">for real life</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 font-medium max-w-lg leading-relaxed">
              Achieve your health goals with the world's most adaptive AI-powered food, exercise, and calorie tracker.
            </p>
            <Link href="/auth" className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-blue-50 transition-all active:scale-95 group">
              START TODAY
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[300px] md:max-w-[380px] lg:mx-0 lg:-translate-x-20 lg:max-w-[440px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/landing/hero3.png"
                alt="NutriAgent AI dashboard preview"
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="text-yellow-400 fill-yellow-400" size={32} />
            ))}
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
            3.5 Million 5-Star Ratings
          </h2>

          <div className="relative overflow-hidden w-full max-w-2xl mx-auto">
            <div className="text-2xl md:text-3xl text-slate-300 font-medium italic leading-relaxed">
              "NutriAgent AI helped me get moving on my goals and tracking my weight loss and body transformation with ease!"
            </div>
            <p className="mt-6 text-slate-500 font-bold uppercase tracking-wider">Jason L.</p>
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {[1, 1, 1, 1, 1, 1].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white w-4' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Hit your health goals in 1-2-3
            </h2>
          </div>

          <div className="space-y-40">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50"
              >
                <Image src="/landing/step1.png" alt="Tracking macros" fill className="object-cover" />
              </motion.div>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 50 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-8xl font-black text-blue-600/10">1</span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none pt-2">
                  Track calories, <br /> macros & more
                </h3>
                <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                  Log even faster with AI-powered voice logging, barcode scanning, and meal recognition. No more manual searching.
                </p>
              </motion.div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 50 }}
                viewport={{ once: true }}
                className="lg:order-last relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50"
              >
                <Image src="/landing/step2.png" alt="Follow progress" fill className="object-cover" />
              </motion.div>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                viewport={{ once: true }}
                className="space-y-6 lg:text-right flex flex-col lg:items-end"
              >
                <span className="text-8xl font-black text-blue-600/10">2</span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none pt-2">
                  Follow your <br /> progress
                </h3>
                <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                  Forget perfection. This is about building long-term habits. Our AI agents detect plateaus and automatically adjust your targets.
                </p>
              </motion.div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50"
              >
                <Image src="/landing/step3.png" alt="Eat better" fill className="object-cover" />
              </motion.div>
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 50 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-8xl font-black text-blue-600/10">3</span>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none pt-2">
                  Eat better and hit <br /> your goals
                </h3>
                <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                  Learn which foods help you feel your best, and get tailored weekly meal plans that adapt to your taste and schedule.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 pt-24 pb-12 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-slate-800">
            <div className="space-y-8 lg:col-span-2">
              <span className="text-3xl font-black tracking-tighter text-white">NutriAgent AI</span>
              <p className="text-xl text-slate-400 font-medium max-w-xs">
                Nutrition tracking for real life.
              </p>
              <Link href="/auth" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-black text-lg shadow-xl hover:bg-slate-100 transition-all uppercase">
                START TODAY
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Resources</h4>
              <ul className="space-y-4 font-bold">
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Premium</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Support Center</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Company</h4>
              <ul className="space-y-4 font-bold">
                <li><Link href="#" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Advertise With Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-sm font-medium">
              © 2026 NutriAgent AI, Inc. All rights reserved.
            </p>

            <div className="flex gap-6 text-slate-500">
              <Instagram size={24} className="hover:text-white cursor-pointer transition-colors" />
              <Facebook size={24} className="hover:text-white cursor-pointer transition-colors" />
              <Youtube size={24} className="hover:text-white cursor-pointer transition-colors" />
              <Linkedin size={24} className="hover:text-white cursor-pointer transition-colors" />
              <Twitter size={24} className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <Link href="#">Community Guidelines</Link>
            <Link href="#">Feedback</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">API</Link>
            <Link href="#">Cookie Preferences</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
