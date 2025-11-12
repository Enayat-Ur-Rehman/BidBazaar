
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Gavel, TrendingUp, Award, Shield, Zap, Users, Target,Menu, X  } from "lucide-react";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false); // close menu when navigating
  }, [location]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Auctions", path: "/auctions" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "How It Works", path: "/how-it-works-info" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D6482B] to-[#ff6b4a] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Bid<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">Bazaar</span>
            </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-stone-700 font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-[#D6482B]"
                  : "hover:text-[#D6482B]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border-2 border-[#D6482B] text-[#D6482B] rounded-xl font-semibold hover:bg-[#D6482B] hover:text-white transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/sign-up"
            className="px-4 py-2 bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D6482B]/40 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#D6482B] focus:outline-none"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 shadow-lg">
          <div className="flex flex-col items-center py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-stone-700 font-medium text-lg ${
                  location.pathname === link.path
                    ? "text-[#D6482B]"
                    : "hover:text-[#D6482B]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-4">
              <Link
                to="/login"
                className="px-4 py-2 border-2 border-[#D6482B] text-[#D6482B] rounded-xl font-semibold hover:bg-[#D6482B] hover:text-white transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D6482B]/40 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


// Hero Section Component
const HeroSection = ({ isAuthenticated }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="mt-4 relative min-h-[80vh] flex items-center justify-center overflow-hidden px-5 py-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D6482B]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ff6b4a]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-[#D6482B] font-semibold text-lg md:text-xl mb-6 tracking-wide uppercase animate-fade-in">
          Transparency Leads to Your Victory
        </p>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-[#111] animate-slide-up">
          Transparent Auctions
        </h1>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[#D6482B] to-[#ff6b4a] bg-clip-text text-transparent animate-slide-up delay-200">
          Be The Winner
        </h1>

        <p className="text-lg md:text-xl text-stone-600 mb-12 max-w-3xl mx-auto animate-fade-in delay-400">
          Join the most transparent and exciting online auction platform. Bid smart, win big, and experience the future of online auctions.
        </p>

        {/* {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-600">
            <Link
              to="/sign-up"
              className="group bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#D6482B]/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="group bg-white text-[#D6482B] border-2 border-[#D6482B] font-semibold px-8 py-4 rounded-xl hover:bg-[#D6482B] hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )} */}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in delay-800">
          {[
            { label: "Active Auctions", value: "500+" },
            { label: "Happy Users", value: "10K+" },
            { label: "Items Sold", value: "50K+" },
            { label: "Success Rate", value: "98%" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <p className="text-3xl md:text-4xl font-bold text-[#D6482B] mb-2">{stat.value}</p>
              <p className="text-sm text-stone-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { 
      title: "Post Items", 
      description: "Auctioneer posts items for bidding.",
      icon: Gavel,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Place Bids", 
      description: "Bidders place bids on listed items.",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Win Notification",
      description: "Highest bidder receives a winning email.",
      icon: Award,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Payment & Fees",
      description: "Bidder pays; auctioneer pays 5% fee.",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">Works</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Simple, transparent, and efficient. Start your auction journey in four easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-stone-100"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#D6482B] to-[#ff6b4a] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-[#111] mb-2">{step.title}</h3>
                <p className="text-stone-600">{step.description}</p>

                {/* Decorative line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#D6482B] to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeaturedAuctionsSection = () => {
  const auctions = [
    {
      id: 1,
      title: "Vintage Camera Collection",
      currentBid: "$2,500",
      image: "🎥",
      timeLeft: "2h 45m",
      bids: 23
    },
    {
      id: 2,
      title: "Rare Comic Books Set",
      currentBid: "$1,800",
      image: "📚",
      timeLeft: "5h 20m",
      bids: 15
    },
    {
      id: 3,
      title: "Antique Pocket Watch",
      currentBid: "$3,200",
      image: "⌚",
      timeLeft: "1h 15m",
      bids: 31
    },
  ];

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">Auctions</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Discover exceptional items from our curated selection of live auctions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-48 bg-gradient-to-br from-[#D6482B]/10 to-[#ff6b4a]/10 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                {auction.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#111] mb-3 group-hover:text-[#D6482B] transition-colors">
                  {auction.title}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-stone-500">Current Bid</p>
                    <p className="text-2xl font-bold text-[#D6482B]">{auction.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">Time Left</p>
                    <p className="text-lg font-semibold text-[#111]">{auction.timeLeft}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                  <p className="text-sm text-stone-500">{auction.bids} bids</p>
                  <Link
                    to={`/auction/item/${auction.id}`}
                    className="text-[#D6482B] font-semibold hover:underline flex items-center gap-1"
                  >
                    Place Bid
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#D6482B]/50 transition-all duration-300 hover:scale-105"
          >
            View All Auctions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We prioritize honesty and transparency in all our dealings, ensuring a fair and ethical auction experience for everyone.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continually enhance our platform with cutting-edge technology and features to provide users with a seamless and efficient auction process.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a vibrant community of buyers and sellers who share a passion for finding and offering exceptional items.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Customer Focus",
      description: "We are committed to providing exceptional customer support and resources to help users navigate the auction process with ease.",
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">BidBazaar</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We're committed to providing the best auction experience with our core values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-stone-100"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#111] mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ isAuthenticated }) => {
  return (
    <section className="py-20 px-5">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#D6482B] to-[#b8381e] text-white rounded-3xl p-12 shadow-2xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Bidding?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of satisfied users and experience the thrill of transparent auctions today.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/sign-up"
                className="group bg-white text-[#D6482B] font-semibold px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auctions"
                className="group bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-[#D6482B] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Browse Auctions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white py-12 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Bid<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">Bazaar</span>
            </h3>
            <p className="text-stone-400">
              The most transparent and exciting online auction platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/auctions" className="text-stone-400 hover:text-[#D6482B] transition-colors">Auctions</Link>
              <Link to="/how-it-works-info" className="text-stone-400 hover:text-[#D6482B] transition-colors">How It Works</Link>
              <Link to="/leaderboard" className="text-stone-400 hover:text-[#D6482B] transition-colors">Leaderboard</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-stone-400 hover:text-[#D6482B] transition-colors">About Us</Link>
              <Link to="/contact" className="text-stone-400 hover:text-[#D6482B] transition-colors">Contact</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-stone-400 hover:text-[#D6482B] transition-colors">Privacy Policy</a>
              <a href="#" className="text-stone-400 hover:text-[#D6482B] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 text-center text-stone-400">
          <p>&copy; 2024 BidBazaar, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Home Page Component (works within existing layout)
const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="w-full min-h-screen">
      <Navbar></Navbar>
      <HeroSection isAuthenticated={isAuthenticated} />
      <HowItWorksSection />
      <FeaturedAuctionsSection />
      <WhyChooseUsSection />
      <CTASection isAuthenticated={isAuthenticated} />
      <Footer></Footer>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Home;

