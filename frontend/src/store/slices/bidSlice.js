import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,myBids:[],myBidsLoading:false, myBidsError: null,
  },
  reducers: {
    bidRequest(state, action) {
      state.loading = true;
    },
    bidSuccess(state, action) {
      state.loading = false;
    },
    bidFailed(state, action) {
      state.loading = false;
    },

    myBidsRequest(state){
      state.myBidsLoading = true;
      state.myBidsError = null;
    },
    myBidsSuccess(state,action){
      state.myBidsLoading = false;
      state.myBids = action.payload;
      state.myBidsError = null;
    },
    myBidsFailed(state,action){
      state.myBidsLoading = false;
      state.error = action.payload;
      state.myBids = [];
    },
    clearMyBidsError(state){
      state.myBidsError = null;
    }
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const response = await axios.post(`http://localhost:5000/api/v1/bid/place/${id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id));

    dispatch(fetchMyBids());
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());
    const errorMsg = error.response?.data?.message || "Failed To Place Bid";
    toast.error(errorMsg);
    console.error("Bid error", error);
  }
};

export const fetchMyBids = () => async (dispatch) =>{
  dispatch(bidSlice.actions.myBidsRequest());
  try{
    const res = await axios.get(
      "http://localhost:5000/api/v1/bid/myBids",
      {withCredentials: true},
    );
    console.log("Fetced My Bids: ", res.data.bids);
    dispatch(bidSlice.actions.myBidsSuccess(res.data.bids || []));
  }catch(error){
    const errorMsg = error.response?.data?.message || "Failed To Fetch Bids";
    dispatch(bidSlice.actions.myBidsFailed(errorMsg));
    console.log("Error Fetching Bids: ",error);
  }
}

export const {clearMyBidsError} = bidSlice.actions;
export default bidSlice.reducer