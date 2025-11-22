import React from "react";
import {
  UserPlus,
  Users,
  Mail,
  DollarSign,
  FileCheck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "User Registration",
      description:
        "Users must register or log in to perform operations such as posting auctions, bidding on items, accessing the dashboard, and sending payment proof.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Role Selection",
      description:
        'Users can register as either a "Bidder" or "Auctioneer." Bidders can bid on items, while Auctioneers can post items.',
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Winning Bid Notification",
      description:
        "After winning an item, the highest bidder will receive an email with the Auctioneer's payment method information, including bank transfer, Easypaisa, and PayPal.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Commission Payment",
      description:
        "If the Bidder pays, the Auctioneer must pay 5% of that payment to the platform. Failure to pay results in being unable to post new items, and a legal notice will be sent.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      alert: true
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Proof of Payment",
      description:
        "The platform receives payment proof as a screenshot and the total amount sent. Once approved by the Administrator, the unpaid commission of the Auctioneer will be adjusted accordingly.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Reposting Items",
      description:
        "If the Bidder does not pay, the Auctioneer can republish the item without any additional cost.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
  ];

  const features = [
    { icon: <Shield className="w-6 h-6" />, text: "Secure Payments" },
    { icon: <Zap className="w-6 h-6" />, text: "Real-time Bidding" },
    { icon: <CheckCircle2 className="w-6 h-6" />, text: "Verified Users" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Fair Commission" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Simple & Transparent Process</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              How BidBazaar Works
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover our streamlined auction process designed to make buying and selling items easy, secure, and transparent for everyone.
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
                  <div className="text-purple-600">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-14 top-24 w-1 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
              )}
              
              <div className={`bg-white rounded-2xl shadow-xl border-2 ${step.borderColor} overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group`}>
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Left Side - Step Number & Icon */}
                  <div className={`lg:col-span-3 bg-gradient-to-r ${step.color} p-8 flex flex-col items-center justify-center text-white relative`}>
                    <div className="absolute top-4 left-4 text-6xl font-bold opacity-10">
                      0{index + 1}
                    </div>
                    <div className="relative z-10 mb-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                          Step {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="lg:col-span-9 p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                        {step.title}
                      </h3>
                      {step.alert && (
                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <AlertCircle className="w-4 h-4" />
                          Important
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Additional Info Badges */}
                    <div className="flex flex-wrap gap-3">
                      {index === 0 && (
                        <>
                          <div className={`flex items-center gap-2 ${step.bgColor} px-4 py-2 rounded-lg`}>
                            <CheckCircle2 className={`w-4 h-4 ${step.iconColor}`} />
                            <span className="text-sm font-medium text-gray-700">Quick Sign-up</span>
                          </div>
                          <div className={`flex items-center gap-2 ${step.bgColor} px-4 py-2 rounded-lg`}>
                            <CheckCircle2 className={`w-4 h-4 ${step.iconColor}`} />
                            <span className="text-sm font-medium text-gray-700">Email Verification</span>
                          </div>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <div className={`flex items-center gap-2 ${step.bgColor} px-4 py-2 rounded-lg`}>
                            <CheckCircle2 className={`w-4 h-4 ${step.iconColor}`} />
                            <span className="text-sm font-medium text-gray-700">Bidder Role</span>
                          </div>
                          <div className={`flex items-center gap-2 ${step.bgColor} px-4 py-2 rounded-lg`}>
                            <CheckCircle2 className={`w-4 h-4 ${step.iconColor}`} />
                            <span className="text-sm font-medium text-gray-700">Auctioneer Role</span>
                          </div>
                        </>
                      )}
                      {index === 3 && (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 w-full">
                          <p className="text-sm text-yellow-800 font-medium">
                            <span className="font-bold">Note:</span> 5% platform commission applies to successful sales
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 lg:p-16 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Why Choose BidBazaar?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Experience the most transparent and user-friendly auction platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Safe</h3>
              <p className="text-white/80">
                All transactions are protected with industry-standard security measures
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
              <p className="text-white/80">
                Stay informed with instant notifications and live bid tracking
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Commission</h3>
              <p className="text-white/80">
                Only 5% commission on successful sales - transparent pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-16 text-center border-2 border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Bidding?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who trust BidBazaar for their auction needs. Sign up today and start your journey!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to='/sign-up'>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
             
             <Link to='/contact'>
              <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Contact Support
              </button>
             </Link>
             
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;