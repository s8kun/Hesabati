import {toast, type ToastOptions} from "react-hot-toast";

const ARABIC_TEXT_REGEX = /[\u0600-\u06FF]/;

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
    duration: 3200,
    position: "top-right",
    className: "hot-toast-card",
    style: {
        direction: "rtl",
    },
};

const MESSAGE_TRANSLATIONS: Array<{ pattern: RegExp; arabic: string }> = [
    {pattern: /invalid credentials|incorrect email|incorrect password|invalid login/i, arabic: "بيانات تسجيل الدخول غير صحيحة."},
    {pattern: /user not found|no user|account does not exist/i, arabic: "لم يتم العثور على الحساب المطلوب."},
    {pattern: /email already exists|already registered|email.*taken/i, arabic: "هذا البريد الإلكتروني مستخدم بالفعل."},
    {pattern: /password too short|min(imum)? length/i, arabic: "كلمة المرور قصيرة جدًا."},
    {pattern: /passwords? do not match|password mismatch/i, arabic: "كلمتا المرور غير متطابقتين."},
    {pattern: /invalid email|email.*invalid/i, arabic: "صيغة البريد الإلكتروني غير صحيحة."},
    {pattern: /otp.*invalid|invalid otp|wrong code|code.*invalid/i, arabic: "رمز التحقق غير صحيح."},
    {pattern: /otp.*expired|code.*expired|expired token/i, arabic: "انتهت صلاحية رمز التحقق، أعد المحاولة."},
    {pattern: /too many requests|rate limit|try again later/i, arabic: "تم إرسال طلبات كثيرة، حاول مرة أخرى بعد قليل."},
    {pattern: /unauthorized|forbidden|not authorized/i, arabic: "غير مصرح لك بتنفيذ هذا الإجراء."},
    {pattern: /network error|failed to fetch|request failed/i, arabic: "تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى."},
    {pattern: /success|created successfully|updated successfully/i, arabic: "تم تنفيذ العملية بنجاح."},
];

const normalize = (value: string) => value.trim().replace(/\s+/g, " ");

const translateToArabic = (message: string, fallbackArabic: string) => {
    const clean = normalize(message);
    if (!clean) return fallbackArabic;
    if (ARABIC_TEXT_REGEX.test(clean)) return clean;

    const matched = MESSAGE_TRANSLATIONS.find((rule) => rule.pattern.test(clean));
    return matched ? matched.arabic : fallbackArabic;
};

const findFirstText = (payload: unknown): string | null => {
    if (!payload || typeof payload !== "object") return null;
    const data = payload as Record<string, unknown>;

    const directFields = ["message", "detail", "error", "non_field_errors"];
    for (const field of directFields) {
        const value = data[field];
        if (typeof value === "string" && value.trim()) return value;
        if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) return value[0];
    }

    for (const value of Object.values(data)) {
        if (typeof value === "string" && value.trim()) return value;
        if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) return value[0];
    }

    return null;
};

export const getApiMessageInArabic = (payload: unknown, fallbackArabic: string) => {
    const rawMessage = findFirstText(payload);
    if (!rawMessage) return fallbackArabic;
    return translateToArabic(rawMessage, fallbackArabic);
};

export const getErrorMessageInArabic = (error: unknown, fallbackArabic: string) => {
    if (!(error instanceof Error)) return fallbackArabic;
    return translateToArabic(error.message, fallbackArabic);
};

export const showSuccessToast = (message: string) =>
    toast.success(message, {
        icon: "✓",
        ...DEFAULT_TOAST_OPTIONS,
        className: "hot-toast-card hot-toast-success",
    });

export const showErrorToast = (message: string) =>
    toast.error(message, {
        icon: "✕",
        ...DEFAULT_TOAST_OPTIONS,
        className: "hot-toast-card hot-toast-error",
    });

export const showInfoToast = (message: string) =>
    toast(message, {
        icon: "i",
        ...DEFAULT_TOAST_OPTIONS,
        className: "hot-toast-card hot-toast-info",
    });
