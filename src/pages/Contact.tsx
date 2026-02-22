import useMeta from "../hooks/useMeta";
import ContactDescription from "@/components/ContactComponents/ContactDescription";

export default function Contact() {
  useMeta({
    title: "Contact",
    description:
      "تواصل مع فريق دعم منصة حساباتي لأي استفسار أو مساعدة. نحن هنا لخدمتكم وإسعادكم.",
  });

  return (
    <div>
      <ContactDescription />
    </div>
  );
}
