import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import Spinner from "@/custom-components/Spinner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdmin);
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full px-5 py-8 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-[#d6482b] text-3xl font-bold mb-2 md:text-4xl lg:text-5xl">
              Super Admin Dashboard
            </h1>
            <p className="text-stone-600 text-sm md:text-base">
              Welcome back, {user?.userName}! Here's your complete system overview.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 pb-8">
            
            {/* Monthly Total Payments Received */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
              <h3 className="text-[#111] text-xl font-semibold mb-4 md:text-2xl lg:text-3xl flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-[#D6482b] to-[#ff6b4a] rounded-full"></span>
                Monthly Total Payments Received
              </h3>
              <PaymentGraph />
            </div>

            {/* Users */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
              <h3 className="text-[#111] text-xl font-semibold mb-4 md:text-2xl lg:text-3xl flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-[#D6482b] to-[#ff6b4a] rounded-full"></span>
                Users
              </h3>
              <BiddersAuctioneersGraph />
            </div>

            {/* Payment Proofs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
              <h3 className="text-[#111] text-xl font-semibold mb-4 md:text-2xl lg:text-3xl flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-[#D6482b] to-[#ff6b4a] rounded-full"></span>
                Payment Proofs
              </h3>
              <PaymentProofs />
            </div>

            {/* Delete Items From Auction */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
              <h3 className="text-[#111] text-xl font-semibold mb-4 md:text-2xl lg:text-3xl flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-[#D6482b] to-[#ff6b4a] rounded-full"></span>
                Delete Items From Auction
              </h3>
              <AuctionItemDelete />
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;