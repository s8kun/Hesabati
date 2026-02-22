import Hero from "@/components/ServicesComponent/Hero";
import SearchServices from "@/components/ServicesComponent/SearchServices";
import ServicesList from "@/components/ServicesComponent/ServicesList";
import { FilterProvider } from "@/context/FilterContext";
import useMeta from "@/hooks/useMeta";

export default function Services() {
  useMeta({
    title: "حساباتي | الخدمات",
    description:
      "خدمات حساباتي - الخيار الأول والأكثر أماناً لبيع وشراء مختلف حسابات التواصل الاجتماعي في الوطن العربي.",
  });
  return (
    <FilterProvider>
      <Hero />
      <SearchServices />
      <ServicesList />
    </FilterProvider>
  );
}
