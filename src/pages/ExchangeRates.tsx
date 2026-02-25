import useMeta from "../hooks/useMeta";
import ExchangeRatesContent from "../components/ExchangeRatesComponents/ExchangeRatesContent";

export default function ExchangeRates() {
  useMeta({
    title: "حساباتي | أسعار الصرف",
    description:
      "تعرف على أحدث أسعار الصرف للدولار الأمريكي مقابل العملات المحلية المدعومة.",
  });

  return <ExchangeRatesContent />;
}
