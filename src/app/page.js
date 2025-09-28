"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  FileText, 
  Key, 
  Check, 
  Star,
  Users,
  Globe,
  Database,
  Sparkles,
  Rocket
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Key className="h-8 w-8" />,
      title: "API Key Management",
      description: "Secure, scalable API key generation and management with usage tracking and analytics.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "AI Document Summarization",
      description: "Transform any document or webpage into concise, actionable summaries using advanced AI.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Processing",
      description: "Optimized for speed with parallel processing and intelligent caching for instant results.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 100 API calls/month",
        "Basic document summarization",
        "Email support",
        "Standard processing speed",
        "1 user account"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses and teams",
      features: [
        "Up to 1,000 API calls/month",
        "Advanced AI summarization",
        "Priority support",
        "2x faster processing",
        "Up to 5 user accounts",
        "Analytics dashboard",
        "Custom integrations"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "border-blue-500"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with high-volume needs",
      features: [
        "Unlimited API calls",
        "Premium AI models",
        "24/7 dedicated support",
        "5x faster processing",
        "Unlimited user accounts",
        "Advanced analytics",
        "White-label options",
        "Custom deployment",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "border-purple-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with industry standards"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Infrastructure",
      description: "99.9% uptime with data centers across multiple continents"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Scalable Architecture",
      description: "Handles millions of requests with automatic scaling"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share and manage resources across your entire organization"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">Avengers Labs</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/dashboards" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <Link href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#about" className="block text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="/dashboards" className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            New: AI-Powered Document Summarization
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Start. Create.
            </span>
            <br />
            <span className="text-gray-200">Build the Future</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for API management and AI-powered document processing. 
            Scale your business with enterprise-grade tools designed for modern developers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboards"
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-white border border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50M+</div>
              <div className="text-gray-400">API Calls</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to build, scale, and manage your applications with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300 hover:border-gray-600 h-full">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                <div className={`bg-slate-800/50 backdrop-blur-sm border-2 ${plan.color} rounded-2xl p-8 h-full ${plan.popular ? 'bg-slate-800/70' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/dashboards"
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose Avengers Labs?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built by developers, for developers. Experience the difference of a platform designed with your success in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building the future with Avengers Labs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboards"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Free Trial
              </Link>
              <button className="text-white border border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold">Avengers Labs</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Avengers Labs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}