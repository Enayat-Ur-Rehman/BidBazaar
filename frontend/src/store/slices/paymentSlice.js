import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/v1/payment";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    pendingPayments: [],
    loading: false,
    error: null,
    currentPayment: null,
    sessionLoading: false,
  },
  reducers: {
    paymentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    sessionRequest(state) {
      state.sessionLoading = true;
      state.error = null;
    },
    paymentSuccess(state, action) {
      state.loading = false;
      state.pendingPayments = action.payload;
      state.error = null;
    },
    setCurrentPayment(state, action) {
      state.loading = false;
      state.currentPayment = action.payload;
      state.error = null;
    },
    paymentFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    sessionFailed(state, action) {
      state.sessionLoading = false;
      state.error = action.payload;
    },
    clearPaymentError(state) {
      state.error = null;
    },
  },
});

// Fetch pending payments
export const fetchPendingPayments = () => async (dispatch) => {
  dispatch(paymentSlice.actions.paymentRequest());
  try {
    const { data } = await axios.get(`${API_URL}/myPayments`, {
      withCredentials: true,
    });
    console.log("✅ Pending payments fetched:", data.payments.length);
    dispatch(paymentSlice.actions.paymentSuccess(data.payments || []));
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch payments";
    console.error("❌ Error fetching payments:", error);
    dispatch(paymentSlice.actions.paymentFailed(msg));
    toast.error(msg);
  }
};

// Get payment details
export const getPaymentDetails = (paymentId) => async (dispatch) => {
  dispatch(paymentSlice.actions.paymentRequest());
  try {
    const { data } = await axios.get(`${API_URL}/${paymentId}`, {
      withCredentials: true,
    });
    console.log("✅ Payment details fetched");
    dispatch(paymentSlice.actions.setCurrentPayment(data.payment));
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch payment";
    console.error("❌ Error fetching payment:", error);
    dispatch(paymentSlice.actions.paymentFailed(msg));
    toast.error(msg);
  }
};

// Create Stripe session
export const createStripeSession = (paymentId) => async (dispatch) => {
  dispatch(paymentSlice.actions.sessionRequest());
  try {
    const { data } = await axios.post(
      `${API_URL}/stripe/createSession/${paymentId}`,
      {},
      { withCredentials: true }
    );
    console.log("✅ Stripe session created");
    dispatch(paymentSlice.actions.sessionFailed(null));
    return data.url;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create session";
    console.error("❌ Error creating session:", error);
    dispatch(paymentSlice.actions.sessionFailed(msg));
    toast.error(msg);
    throw error;
  }
};

// Verify payment
export const verifyPayment = (sessionId, paymentId) => async (dispatch) => {
  dispatch(paymentSlice.actions.paymentRequest());
  try {
    const { data } = await axios.post(
      `${API_URL}/stripe/verify`,
      { sessionId, paymentId },
      { withCredentials: true }
    );
    console.log("✅ Payment verified successfully");
    toast.success("Payment confirmed!");
    return true;
  } catch (error) {
    const msg = error.response?.data?.message || "Payment verification failed";
    console.error("❌ Verification error:", error);
    dispatch(paymentSlice.actions.paymentFailed(msg));
    toast.error(msg);
    return false;
  }
};

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;