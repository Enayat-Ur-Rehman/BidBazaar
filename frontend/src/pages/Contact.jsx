import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleContactForm = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name,
      email,
      phone,
      subject,
      message,
    };

    emailjs
      .send(
        "service_v01mtcu",
        "template_3a1r5xp",
        templateParams,
        "YcOimjllS64zn4ghK"
      )
      .then(() => {
        toast.success("Thank You! Your message has been sent successfully.");
        setLoading(false);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setTimeout(() => navigateTo("/"), 2000);
      })
      .catch((err) => {
        toast.error("Failed to send message. Please try again.");
        setLoading(false);
      });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@bidbazaar.com",
      description: "Send us an email anytime",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "+92 317 2027147",
      description: "Mon-Fri from 9am to 6pm",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      content: "Karachi, Pakistan",
      description: "Come say hello",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      content: "9:00 AM - 6:00 PM",
      description: "Monday to Friday",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">We're here to help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl mb-4 text-white`}>
                {info.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-900 font-semibold mb-1">{info.content}</p>
              <p className="text-sm text-gray-500">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleContactForm} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

         

        </div>
      </div>
    </div>
  );
};

export default Contact;