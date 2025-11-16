import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
    myBids: [],
    wonBids: [],
    error: null,
  },
  reducers: {
    bidRequest(state) {
      state.loading = true;
      state.error = null;
    },
    bidSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    bidFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getMyBidsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getMyBidsSuccess(state, action) {
      state.loading = false;
      state.myBids = action.payload;
      state.error = null;
    },
    getMyBidsFailed(state, action) {
      state.loading = false;
      state.myBids = [];
      state.error = action.payload;
    },
    getWonBidsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getWonBidsSuccess(state, action) {
      state.loading = false;
      state.wonBids = action.payload;
      state.error = null;
    },
    getWonBidsFailed(state, action) {
      state.loading = false;
      state.wonBids = [];
      state.error = action.payload;
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/bid/place/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id));
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Failed to place bid";
    dispatch(bidSlice.actions.bidFailed(errorMsg));
    toast.error(errorMsg);
  }
};

export const getMyBids = () => async (dispatch) => {
  dispatch(bidSlice.actions.getMyBidsRequest());
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/bid/my-bids`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bidSlice.actions.getMyBidsSuccess(response.data.bids));
  } catch (error) {
    console.error("Error fetching bids:", error);
    const errorMsg = error.response?.data?.message || error.message || "Failed to fetch bids";
    dispatch(bidSlice.actions.getMyBidsFailed(errorMsg));
    toast.error(errorMsg);
  }
};

export const getWonBids = () => async (dispatch) => {
  dispatch(bidSlice.actions.getWonBidsRequest());
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/bid/won-bids`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bidSlice.actions.getWonBidsSuccess(response.data.bids));
  } catch (error) {
    console.error("Error fetching won bids:", error);
    const errorMsg = error.response?.data?.message || error.message || "Failed to fetch won bids";
    dispatch(bidSlice.actions.getWonBidsFailed(errorMsg));
    toast.error(errorMsg);
  }
};

export default bidSlice.reducer;