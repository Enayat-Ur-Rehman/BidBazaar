// import { createAuction, getUnpaidCommission } from "@/store/slices/auctionSlice";
// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import "react-datepicker/dist/react-datepicker.css";
// import { AlertCircle } from "lucide-react";

// const CreateAuction = () => {
//   const [image, setImage] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [condition, setCondition] = useState("");
//   const [startingBid, setStartingBid] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");

//   const auctionCategories = [
//     "Electronics",
//     "Furniture",
//     "Art & Antiques",
//     "Jewelry & Watches",
//     "Automobiles",
//     "Real Estate",
//     "Collectibles",
//     "Fashion & Accessories",
//     "Sports Memorabilia",
//     "Books & Manuscripts",
//   ];

//   const imageHandler = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       setImage(file);
//       setImagePreview(reader.result);
//     };
//   };

//   const dispatch = useDispatch();
//   const { loading, unpaidCommission, commissionStatus } = useSelector((state) => state.auction);
//   const { isAuthenticated, user } = useSelector((state) => state.user);
//   const navigateTo = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated || user.role !== "Auctioneer") {
//       navigateTo("/");
//       return;
//     }
//     // Fetch unpaid commission on component mount
//     dispatch(getUnpaidCommission());
//   }, [isAuthenticated, user.role, dispatch, navigateTo]);

//   const handleCreateAuction = (e) => {
//     e.preventDefault();
    
//     // Check if there's unpaid or pending commission
//     if (unpaidCommission > 0 && commissionStatus !== "settled") {
//       return; // Error will be shown by backend
//     }

//     const formData = new FormData();
//     formData.append("image", image);
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("condition", condition);
//     formData.append("startingBid", startingBid);
//     formData.append("startTime", startTime);
//     formData.append("endTime", endTime);
//     dispatch(createAuction(formData));
//   };

//   const hasUnpaidCommission = unpaidCommission > 0 && commissionStatus !== "settled";

//   return (
//     <article className="w-full px-5 lg:px-8 py-8 flex flex-col justify-center items-center">
//       <h1
//         className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
//       >
//         Create Auction
//       </h1>
//       <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
//         {/* Commission Warning */}
//         {hasUnpaidCommission && (
//           <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="text-red-800 font-semibold mb-1">Unpaid Commission</p>
//               <p className="text-red-700 text-sm">
//                 You have an unpaid commission of <span className="font-bold">${unpaidCommission.toLocaleString()}</span>. 
//                 Please settle it before creating a new auction.
//               </p>
//               <p className="text-red-600 text-xs mt-2">Status: <span className="uppercase font-semibold">{commissionStatus}</span></p>
//             </div>
//           </div>
//         )}

//         <form
//           className="flex flex-col gap-5 w-full"
//           onSubmit={handleCreateAuction}
//         >
//           <p className="font-semibold text-xl md:text-2xl">Auction Detail</p>
//           <div className="flex flex-col gap-4 sm:flex-row">
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
//               >
//                 <option value="">Select Category</option>
//                 {auctionCategories.map((element) => {
//                   return (
//                     <option key={element} value={element}>
//                       {element}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 sm:flex-row">
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">Condition</label>
//               <select
//                 value={condition}
//                 onChange={(e) => setCondition(e.target.value)}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
//               >
//                 <option value="">Select Condition</option>
//                 <option value="New">New</option>
//                 <option value="Used">Used</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">Starting Bid</label>
//               <input
//                 type="number"
//                 value={startingBid}
//                 onChange={(e) => setStartingBid(e.target.value)}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 sm:flex-row">
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="text-[16px] py-2 bg-transparent border-2 border-stone-500 focus:outline-none px-2 rounded-md"
//                 rows={10}
//               />
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 sm:flex-row">
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">
//                 Auction Starting Time
//               </label>
//               <DatePicker
//                 selected={startTime}
//                 onChange={(date) => setStartTime(date)}
//                 showTimeSelect
//                 timeFormat="HH:mm"
//                 timeIntervals={15}
//                 dateFormat={"MMMM d, yyyy h,mm aa"}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none w-full"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-1">
//               <label className="text-[16px] text-stone-600">
//                 Auction End Time
//               </label>
//               <DatePicker
//                 selected={endTime}
//                 onChange={(date) => setEndTime(date)}
//                 showTimeSelect
//                 timeFormat="HH:mm"
//                 timeIntervals={15}
//                 dateFormat={"MMMM d, yyyy h,mm aa"}
//                 className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none w-full"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <label className="font-semibold text-xl md:text-2xl">
//               Auction Item Image
//             </label>
//             <div className="flex items-center justify-center w-full">
//               <label
//                 htmlFor="dropzone-file"
//                 className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//               >
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   {imagePreview ? (
//                     <img src={imagePreview} alt={title} className="w-44 h-auto"/>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 20 16"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                         />
//                       </svg>
//                     </>
//                   )}

//                   <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                     <span className="font-semibold">Click to upload</span> or drag
//                     and drop
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     SVG, PNG, JPG or GIF (MAX. 800x400px)
//                   </p>
//                 </div>
//                 <input id="dropzone-file" type="file" className="hidden" onChange={imageHandler}/>
//               </label>
//             </div>
//           </div>
//           <button 
//             type="submit"
//             disabled={hasUnpaidCommission || loading}
//             className={`font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md text-white w-[280px] mx-auto lg:w-[640px] my-4 ${
//               hasUnpaidCommission || loading
//                 ? "bg-gray-400 cursor-not-allowed opacity-50"
//                 : "bg-[#D6482B] hover:bg-[#b8381e]"
//             }`}
//           >
//             {loading ? "Creating Auction..." : "Create Auction"}
//           </button>
//         </form>
//       </div>
//     </article>
//   );
// };

// export default CreateAuction;

import { createAuction, getUnpaidCommission } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  AlertCircle,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
  X,
  Clock,
  Info,
  Sparkles
} from "lucide-react";

const CreateAuction = () => {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
  ];

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImage("");
    setImagePreview("");
  };

  const dispatch = useDispatch();
  const { loading, unpaidCommission, commissionStatus } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
      return;
    }
    dispatch(getUnpaidCommission());
  }, [isAuthenticated, user.role, dispatch, navigateTo]);

  const handleCreateAuction = (e) => {
    e.preventDefault();
    
    if (unpaidCommission > 0 && commissionStatus !== "settled") {
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("startingBid", startingBid);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(createAuction(formData));
  };

  const hasUnpaidCommission = unpaidCommission > 0 && commissionStatus !== "settled";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create New Auction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to list your item for auction
          </p>
        </div>

        {/* Commission Warning */}
        {hasUnpaidCommission && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">Unpaid Commission</h3>
                <p className="text-red-800 mb-3">
                  You have an unpaid commission of{" "}
                  <span className="font-bold text-2xl">${unpaidCommission.toLocaleString()}</span>.
                  Please settle it before creating a new auction.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold uppercase text-xs">
                    {commissionStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <form onSubmit={handleCreateAuction} className="space-y-8">
                {/* Basic Information Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Basic Information
                  </h2>

                  {/* Title & Category */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Auction Title *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter auction title"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                        >
                          <option value="">Select Category</option>
                          {auctionCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Condition & Starting Bid */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Condition *
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select Condition</option>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Starting Bid *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                          type="number"
                          value={startingBid}
                          onChange={(e) => setStartingBid(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a detailed description of your item..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Timing Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-purple-600" />
                    Auction Timing
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                        <DatePicker
                          selected={startTime}
                          onChange={(date) => setStartTime(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                        <DatePicker
                          selected={endTime}
                          onChange={(date) => setEndTime(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={startTime || new Date()}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-pink-600" />
                    Auction Image
                  </h2>

                  {!imagePreview ? (
                    <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50">
                      <input
                        type="file"
                        onChange={imageHandler}
                        accept="image/*"
                        className="hidden"
                        required
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-semibold mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-blue-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-96 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-semibold">Image uploaded successfully</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={hasUnpaidCommission || loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    hasUnpaidCommission || loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Auction...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Create Auction
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

         
          
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;