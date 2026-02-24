import { Navigate, Route, Routes } from "react-router";
import Services from "@/pages/Services";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import OTP from "@/pages/OTP";
import ResetPassword from "@/pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/services" element={<Services />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
