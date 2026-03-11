import { Navigate, Route, Routes } from "react-router";
import Services from "@/pages/Services";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import OTP from "@/pages/OTP";
import ResetPassword from "@/pages/ResetPassword";
import ForgetPassword from "@/pages/ForgetPassword";
import ServiceDetails from "@/pages/ServiceDetails";
import ExchangeRates from "@/pages/ExchangeRates";
import Profile from "@/pages/Profile";
import AnnouncementEditor from "@/pages/AnnouncementEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/services" element={<Services />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/exchange-rates" element={<ExchangeRates />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/profile/announcements/new"
        element={<AnnouncementEditor />}
      />
      <Route
        path="/profile/announcements/:id/edit"
        element={<AnnouncementEditor />}
      />
    </Routes>
  );
}

export default App;
