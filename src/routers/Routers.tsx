import { Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/user/home/Home";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Login from "../pages/common/login/Login";
import Signup from "../pages/common/signup/Signup";
import ForgotPassword from "../pages/common/forgotPassword/ForgotPassword";
import VerifyOTP from "../pages/common/verifyOTP/VerifyOTP";
import ResetPassword from "../pages/common/resetPassword/ResetPassword";
import VerifyOTPForSignup from "../pages/common/verifyOTPForSignup/VerifyOTPForSignup";

const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/verify-otp-for-signup" element={<VerifyOTPForSignup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/admin" element={<Layout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default Routers;
