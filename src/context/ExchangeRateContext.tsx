import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";
import { apiFetch } from "@/lib/apiFetch";

type RatesByCountryId = Record<
  string,
  {
    rate: number;
    currencyCode: string;
    countryName: string;
  }
>;

type CountriesMetaResponse = {
  countries?: Array<{
    id: number;
    name: string;
    currency_code?: string;
    rate_to_usd?: string;
  }>;
};

type SupportedCountriesResponse = {
  title?: string;
  description?: string;
  rates?: Array<{
    usd_amount: string;
    local_amount: string;
    label: string;
    pair: string;
  }>;
};

type SupportedRate = {
  usdAmount: string;
  localAmount: string;
  label: string;
  pair: string;
};

interface ExchangeRateStoreType {
  rates: RatesByCountryId;
  supportedRates: SupportedRate[];
  title: string;
  description: string;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  fetchCountriesMeta: () => Promise<void>;
  fetchSupportedCountriesRates: () => Promise<void>;
  initialize: () => Promise<void>;
  convertPrice: (
    priceInUSD: string | number,
    targetCountry: string,
  ) => { amount: number; symbol: string; rate: number };
}

const buildRatesByCountry = (
  countries: ReturnType<typeof useMarketplaceMeta.getState>["countries"],
) =>
  countries.reduce<RatesByCountryId>((acc, country) => {
    const parsedRate = Number(country.rate_to_usd);

    if (!country.id || Number.isNaN(parsedRate) || parsedRate <= 0) {
      return acc;
    }

    acc[String(country.id)] = {
      rate: parsedRate,
      currencyCode: country.currency_code || "USD",
      countryName: country.name,
    };

    return acc;
  }, {});

const useExchangeRateStore = create<ExchangeRateStoreType>((set, get) => ({
  rates: {},
  supportedRates: [],
  title: "أسعار الصرف اليوم",
  description:
    "يتم عرض الأسعار أدناه بناءً على سعر الدولار الأمريكي (USD) مقابل العملات المحلية المدعومة في المنصة.",
  isLoading: false,
  error: null,
  initialized: false,
  fetchCountriesMeta: async () => {
    const { countries, setCountries } = useMarketplaceMeta.getState();
    const hasRates = countries.some((country) => !!country.rate_to_usd);
    if (hasRates) {
      set({ rates: buildRatesByCountry(countries) });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      if (!baseUrl) {
        throw new Error("VITE_BACKEND_URL is not configured");
      }

      const url = new URL(baseUrl);
      url.searchParams.set("page", "1");
      url.searchParams.set("page_size", "1");

      const response = await apiFetch(url.toString(), { auth: false });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = (await response.json()) as CountriesMetaResponse;

      if (json.countries?.length) {
        setCountries(json.countries);
        set({ rates: buildRatesByCountry(json.countries) });
      }
    } catch (fetchError) {
      set({
        error:
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load exchange rates",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSupportedCountriesRates: async () => {
    set({ isLoading: true, error: null });

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      if (!baseUrl) {
        throw new Error("VITE_BACKEND_URL is not configured");
      }

      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;

      const response = await apiFetch(`${cleanBaseUrl}/supported-countries/`, {
        auth: false,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = (await response.json()) as SupportedCountriesResponse;

      set({
        title: json.title || "أسعار الصرف اليوم",
        description:
          json.description ||
          "يتم عرض الأسعار أدناه بناءً على سعر الدولار الأمريكي (USD) مقابل العملات المحلية المدعومة في المنصة.",
        supportedRates: (json.rates || []).map((rate) => ({
          usdAmount: rate.usd_amount,
          localAmount: rate.local_amount,
          label: rate.label,
          pair: rate.pair,
        })),
      });
    } catch (fetchError) {
      set({
        error:
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load exchange rates",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  initialize: async () => {
    if (get().initialized) {
      return;
    }

    set({ initialized: true });
    await Promise.all([
      get().fetchCountriesMeta(),
      get().fetchSupportedCountriesRates(),
    ]);
  },
  convertPrice: (priceInUSD, targetCountry) => {
    const rates = get().rates;
    const numericPrice = Number(priceInUSD);
    const safePrice = Number.isNaN(numericPrice) ? 0 : numericPrice;

    if (!targetCountry || targetCountry === "all" || !rates[targetCountry]) {
      return { amount: safePrice, symbol: "USD", rate: 1 };
    }

    const targetRate = rates[targetCountry];
    const amount = safePrice * targetRate.rate;
    const symbol = targetRate.currencyCode;

    return { amount, symbol, rate: targetRate.rate };
  },
}));

export const useExchangeRate = () => {
  const initialize = useExchangeRateStore((state) => state.initialize);
  const rates = useExchangeRateStore((state) => state.rates);
  const supportedRates = useExchangeRateStore((state) => state.supportedRates);
  const title = useExchangeRateStore((state) => state.title);
  const description = useExchangeRateStore((state) => state.description);
  const isLoading = useExchangeRateStore((state) => state.isLoading);
  const error = useExchangeRateStore((state) => state.error);
  const convertPrice = useExchangeRateStore((state) => state.convertPrice);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return useMemo(
    () => ({
      rates,
      supportedRates,
      title,
      description,
      isLoading,
      error,
      convertPrice,
    }),
    [rates, supportedRates, title, description, isLoading, error, convertPrice],
  );
};
