import type { ProfileTab } from "./profile.types";

export const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "announcements", label: "الإعلانات" },
  { id: "settings", label: "الإعدادات" },
];

export const formatCurrency = (value: string, currencyCode = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
  }).format(date);
};

export const maskPhone = (value: string) => {
  const clean = value.replace(/\s+/g, "");
  if (clean.length < 6) {
    return "غير متوفر";
  }

  return `${clean.slice(0, 3)}••••${clean.slice(-2)}`;
};

export const getStatusLabel = (status: string) => {
  if (status === "sold") {
    return "مباع";
  }

  if (status === "active") {
    return "نشط";
  }

  return "قيد المراجعة";
};
