import useMeta from "../hooks/useMeta";
import TermsContent from "../components/TermsComponents/TermsContent";

export default function Terms() {
  useMeta({
    title: "Terms",
    description:
      "مرحباً بك في منصة حساباتي. يرجى قراءة هذه الشروط بعناية، حيث توضح طبيعة عمل المنصة وحدود مسؤوليتنا لضمان تجربة آمنة وشفافة للجميع.",
  });

  return <TermsContent />;
}
