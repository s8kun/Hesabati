import Snowfall from "react-snowfall";
import useMeta from "../hooks/useMeta";
import TermsDescription from "@/components/TermsComponents/TermsDescription";
export default function Terms() {
  useMeta({
    title: "Terms",
    description:
      "مرحباً بك في منصة حساباتي. يرجى قراءة هذه الشروط بعناية، حيث توضح طبيعة عمل المنصة وحدود مسؤوليتنا لضمان تجربة آمنة وشفافة للجميع.",
  });
  return (
    <div>
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
        snowflakeCount={100}
      />
      <TermsDescription />
    </div>
  );
}
