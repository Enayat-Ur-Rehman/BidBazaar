import { postCommissionProof } from "@/store/slices/commissionSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SubmitCommission = () => {
  const [proof, setProof] = useState(null);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.commission);

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    setProof(file);
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

  return (
    <section className="flex-1 flex flex-col w-full px-5 py-6">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col gap-6">
        <h2 className="text-[#D6482B] font-bold text-2xl md:text-3xl lg:text-4xl text-center">
          Submit Payment Proof
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
              className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:ring-2 focus:ring-[#D6482B] rounded"
              required
            />
          </div>

          {/* Proof Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">
              Payment Proof (Screenshot)
            </label>
            <input
              type="file"
              onChange={handleProofChange}
              accept="image/*,application/pdf"
              className="w-full border-b border-gray-300 py-2 px-2 focus:outline-none focus:ring-2 focus:ring-[#D6482B] rounded"
              required
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Add an optional comment"
              className="w-full border border-gray-300 py-2 px-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#D6482B] hover:bg-[#b8381e] text-white font-semibold py-3 px-6 rounded-md text-lg transition-all duration-300 mx-auto"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Payment Proof"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubmitCommission;
