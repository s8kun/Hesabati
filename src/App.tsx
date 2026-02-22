import { Navigate, Route, Routes } from "react-router";
import Services from "@/pages/Services";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/services" element={<Services />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
