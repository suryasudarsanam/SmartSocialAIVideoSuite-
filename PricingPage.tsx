import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Rocket, ArrowRight, Star, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PricingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planType: string) => {
    if (currentUser) {
      navigate('/upload');
    } else {
      navigate('/auth');
    }
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'forever',
      icon: <Zap className="h-8 w-8" />,
      description: 'Perfect for discovering the magic of AI video processing',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        '3 video uploads per month',
        'All 3 platform formats (Instagram, YouTube, Facebook)',
        'AI-generated captions with Whisper technology',
        'Platform-specific hashtags with Gemini AI',
        'Basic video history (30 days)',
        'Community support forum',
        'No credit card required'
      ],
      buttonText: 'Start Free Trial',
      highlighted: false,
      popular: false,
      badge: 'Get Started'
    },
    {
      name: 'Creator Pro',
      price: '$19',
      period: 'month',
      icon: <Crown className="h-8 w-8" />,
      description: 'Designed for serious content creators and influencers',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        '50 video uploads per month',
        'All 3 platform formats + priority processing',
        'Advanced AI captions with custom editing tools',
        'Smart hashtag analytics and optimization',
        'Unlimited video history and cloud storage',
        'Priority email support (24-hour response)',
        'HD video processing (up to 1080p)',
        'Batch upload capabilities',
        'Custom branding options'
      ],
      buttonText: 'Go Pro',
      highlighted: true,
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'month',
      icon: <Rocket className="h-8 w-8" />,
      description: 'For agencies, teams, and power creators',
      gradient: 'from-emerald-500 to-teal-500',
      features: [
        'Unlimited video uploads',
        'All platform formats + TikTok (coming soon)',
        'AI captions with advanced customization',
        'Custom hashtag strategies and A/B testing',
        'Advanced analytics and performance insights',
        'White-label solutions available',
        'Dedicated account manager',
        'API access for integrations',
        '4K video processing',
        'Team collaboration tools',
        'Priority support (1-hour response)'
      ],
      buttonText: 'Contact Sales',
      highlighted: false,
      popular: false,
      badge: 'Best Value'
    },
  ];

  const faqs = [
    {
      question: "What video formats and sizes do you support?",
      answer: "We support all major video formats including MP4, MOV, AVI, MKV, WebM, and more. File size limits: Free (50MB), Creator Pro (500MB), Enterprise (2GB). Our system automatically handles format conversion and compression."
    },
    {
      question: "How accurate are the AI-generated captions?",
      answer: "Our AI achieves 99.5% accuracy using OpenAI's Whisper technology combined with contextual understanding. Creator Pro and Enterprise plans include advanced editing tools for fine-tuning captions to match your brand voice."
    },
    {
      question: "Can I cancel or change my plan anytime?",
      answer: "Absolutely! All paid plans can be cancelled or modified at any time with no penalties. You'll retain access to all your processed videos and can download them even after cancellation."
    },
    {
      question: "What's your video storage and retention policy?",
      answer: "Free Trial: 30 days, Creator Pro & Enterprise: Unlimited permanent storage. All videos are stored securely in the cloud with 99.9% uptime guarantee and automatic backups."
    },
    {
      question: "Do you offer custom integrations or white-label solutions?",
      answer: "Yes! Enterprise customers get full API access and can request custom integrations with existing workflows. We also offer white-label solutions for agencies and larger organizations."
    },
    {
      question: "How fast is the video processing?",
      answer: "Most videos are processed in under 2 minutes. Processing speed depends on video length and complexity. Enterprise customers get access to our high-priority processing queue for even faster results."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creative Power
              </span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Transparent pricing designed to grow with your content creation journey. 
              Every plan includes our revolutionary AI-powered video processing.
            </p>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-white/20 animate-fade-in-up ${
                  plan.highlighted ? 'transform scale-105 ring-2 ring-purple-500/50' : 'hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 text-sm font-bold tracking-wide">
                    ⭐ {plan.badge}
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${plan.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                    <p className="text-gray-600 mb-6 font-light leading-relaxed">{plan.description}</p>
                    <div className="text-center mb-8">
                      <span className="text-6xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-xl text-gray-600 font-medium">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3 group/item">
                        <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-light leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 ${
                      plan.highlighted
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-20 border border-white/20 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Why Choose CrossPost AI?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 font-light">Process videos in under 2 minutes with our optimized AI pipeline</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Security</h3>
                <p className="text-gray-600 font-light">Bank-level encryption and security for all your content</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">99.5% Accuracy</h3>
                <p className="text-gray-600 font-light">Industry-leading AI caption accuracy with contextual understanding</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-fade-in border border-white/20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-white animate-bounce" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Transform Your Content?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto font-light">
                  Join thousands of creators who've revolutionized their workflow. 
                  Start your free trial today—no credit card required.
                </p>
                <button 
                  onClick={() => handlePlanSelect('Free Trial')}
                  className="group bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;