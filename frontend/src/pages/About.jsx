import React from "react";
import {
  Shield,
  Lightbulb,
  Users,
  HeartHandshake,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      id: 1,
      icon: <Shield className="w-8 h-8" />,
      title: "Integrity",
      description:
        "We prioritize honesty and transparency in all our dealings, ensuring a fair and ethical auction experience for everyone.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description:
        "We continually enhance our platform with cutting-edge technology and features to provide users with a seamless and efficient auction process.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description:
        "We foster a vibrant community of buyers and sellers who share a passion for finding and offering exceptional items.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Customer Focus",
      description:
        "We are committed to providing exceptional customer support and resources to help users navigate the auction process with ease.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
  ];

 

  const team = [
    { name: "Enayat", role: "Co-Founder & CEO" },
    { name: "Saad", role: "Co-Founder & CTO" },
    { name: "Ammar", role: "Co-Founder & COO" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Established 2024</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              About BidBazaar
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Welcome to <span className="font-bold text-purple-600">BidBazaar</span>, the ultimate destination for online auctions
              and bidding excitement. We are dedicated to providing a dynamic and user-friendly platform for buyers and
              sellers to connect, explore, and transact in a secure and seamless environment.
            </p>
          </div>
        </div>
      </section>

  

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-purple-600 mb-4">
                <Target className="w-6 h-6" />
                <span className="text-sm font-bold uppercase tracking-wide">Our Mission</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Online Auctions
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At BidBazaar, our mission is to revolutionize the way people buy and sell items online. We strive to create an engaging and trustworthy marketplace that empowers individuals and businesses to discover unique products, make informed decisions, and enjoy the thrill of competitive bidding.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Secure Transactions</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">User-Friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-white">
                <Award className="w-32 h-32 mx-auto mb-6 opacity-90" />
                <p className="text-center text-xl font-semibold">
                  "Creating an unparalleled auction experience for users worldwide"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at BidBazaar
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value) => (
            <div
              key={value.id}
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${value.borderColor} hover:shadow-2xl transition-all hover:-translate-y-2 group`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl mb-5 text-white group-hover:scale-110 transition-transform`}>
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 lg:p-16 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl lg:text-4xl font-bold">Our Story</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Founded by <span className="font-bold text-white">Enayat, Saad, and Ammar</span>, BidBazaar was born out of a passion for
              connecting people with unique and valuable items. With years of experience in the auction industry, our team is committed to
              creating a platform that offers an unparalleled auction experience for users worldwide.
            </p>
            
            {/* Team Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
                    {member.name[0]}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-center text-lg">
                "Our vision is to create a global marketplace where trust, innovation, and community come together to redefine online auctions."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 lg:p-16 text-white text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking to buy, sell, or simply explore, BidBazaar invites you to join our growing community of auction enthusiasts.
            Discover new opportunities, uncover hidden gems, and experience the thrill of winning your next great find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to='/sign-up'>
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <Link to='/how-it-works-info'>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/30">
                Learn More
              </button>
            </Link>
            
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Thank You for Choosing BidBazaar
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We look forward to being a part of your auction journey and helping you discover amazing deals!
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;