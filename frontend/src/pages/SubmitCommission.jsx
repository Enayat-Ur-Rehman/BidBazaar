import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Upload,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Image as ImageIcon,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const SubmitCommission = () => {
  const [proof, setProof] = useState(null);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProof(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setProof(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!proof || !amount) {
      alert("Please provide amount and proof file.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", proof);
    formData.append("amount", amount);
    formData.append("comment", comment);

    dispatch(postCommissionProof(formData));
  };

  const steps = [
    {
      number: "1",
      title: "Enter Amount",
      description: "Specify the commission amount you're paying"
    },
    {
      number: "2",
      title: "Upload Proof",
      description: "Upload a screenshot of your payment"
    },
    {
      number: "3",
      title: "Submit",
      description: "Send for admin verification"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">Payment Submission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Submit Commission Payment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your payment proof and we'll verify it within 24 hours
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {step.number}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-600" />
                Payment Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Commission Amount *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the exact amount you paid (5% of the auction sale)
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Proof (Screenshot) *
                  </label>
                  
                  {!previewUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        onChange={handleProofChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-semibold mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border-2 border-blue-300 rounded-xl overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Payment proof preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-semibold flex items-center gap-2">
                          <ImageIcon className="w-5 h-5" />
                          {proof?.name}
                        </p>
                        <p className="text-white/80 text-sm">
                          {(proof?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comment Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Add any additional information about your payment..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !proof || !amount}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading Payment Proof...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Submit Payment Proof
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Important Information */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Important</h3>
                  <p className="text-sm text-gray-700">
                    Please ensure your payment proof is clear and shows the transaction details.
                  </p>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Submission Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Upload clear screenshots of payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Include transaction ID if available</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Verify amount matches 5% commission</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Wait for admin approval (24-48 hours)</span>
                </li>
              </ul>
            </div>

            {/* Commission Info */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Commission Structure
              </h3>
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/80 mb-1">Platform Fee</p>
                  <p className="text-2xl font-bold">5%</p>
                </div>
                <p className="text-sm text-white/90">
                  of the total auction sale amount must be paid to continue using the platform.
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have questions about commission payments, contact our support team.
              </p>
              <Link to='/contact'>
                <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all text-sm">
                  Contact Support
                </button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitCommission;