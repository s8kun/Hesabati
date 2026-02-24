import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Mocking some static exchange rates (1 USD TO Local Currency)
export const exchangeRates: Record<string, number> = {
  US: 1, // US Dollar
  LY: 5.0, // Libyan Dinar -> 1 USD = ~5 LYD
  DZ: 135.0, // Algerian Dinar -> 1 USD = ~135 DZD
  SA: 3.75, // Saudi Riyal -> 1 USD = ~3.75 SAR
  EG: 31.0, // Egyptian Pound -> 1 USD = ~31 EGP
  AE: 3.67, // UAE Dirham -> 1 USD = ~3.67 AED
};

// Currency map
export const countryCurrencies: Record<string, string> = {
  US: "$",
  LY: "د.ل",
  DZ: "د.ج",
  SA: "ر.س",
  EG: "ج.م",
  AE: "د.إ",
};

interface ExchangeRateContextType {
  rates: Record<string, number>;
  convertPrice: (
    priceInUSD: number,
    targetCountry: string,
  ) => { amount: number; symbol: string };
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(
  undefined,
);

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
  const [rates] = useState(exchangeRates); // For now static, can be updated from API later

  const convertPrice = (priceInUSD: number, targetCountry: string) => {
    // If the country is not supported or set to ALL, default back to USD
    if (targetCountry === "ALL" || !rates[targetCountry]) {
      return { amount: priceInUSD, symbol: countryCurrencies["US"] };
    }
    const amount = priceInUSD * rates[targetCountry];
    const symbol = countryCurrencies[targetCountry];

    return { amount, symbol };
  };

  return (
    <ExchangeRateContext.Provider value={{ rates, convertPrice }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error(
      "useExchangeRate must be used within an ExchangeRateProvider",
    );
  }
  return context;
};
