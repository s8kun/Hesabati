import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Phone,
  MapPin,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  getApiMessageInArabic,
  getErrorMessageInArabic,
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";
import { useMarketplaceMeta } from "@/context/MarketplaceMetaContext";
import { apiFetch, apiFetchJson, safeParseJson } from "@/lib/apiFetch";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignupInputs {
  full_name: string;
  email: string;
  country: string;
  whatsapp: string;
  password: string;
  password_confirm: string;
}

type CountriesMetaResponse = {
  countries?: Array<{
    id: number;
    name: string;
    currency_code?: string;
    currency_name?: string;
    rate_to_usd?: string;
  }>;
};

export default function SignupContent() {
  const { countries, setCountries } = useMarketplaceMeta();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInputs>({
    defaultValues: {
      full_name: "",
      email: "",
      country: "",
      whatsapp: "",
      password: "",
      password_confirm: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const selectedCountryName =
    countries.find((country) => String(country.id) === watch("country"))
      ?.name || "";

  useEffect(() => {
    if (countries.length > 0) return;

    const abortController = new AbortController();

    const fetchCountries = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        if (!baseUrl) {
          throw new Error("VITE_BACKEND_URL is not configured");
        }

        const url = new URL(baseUrl);
        url.searchParams.set("page", "1");
        url.searchParams.set("page_size", "1");

        const response = await apiFetch(url.toString(), {
          auth: false,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await safeParseJson<CountriesMetaResponse>(response);

        if (json.countries) {
          setCountries(json.countries);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load countries for signup:", error);
      }
    };

    fetchCountries();

    return () => {
      abortController.abort();
    };
  }, [countries.length, setCountries]);

  const onSubmit = async (data: SignupInputs) => {
    console.log("Submitting signup form with data:", data);
    try {
      const payload = {
        ...data,
        country: Number(data.country),
        whatsapp: data.whatsapp.trim(),
      };

      const { response, data: result } = await apiFetchJson<
        Record<string, unknown>
      >("/register/", {
        method: "POST",
        auth: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Signup failed:", result);
        throw new Error(
          getApiMessageInArabic(
            result,
            "تعذّر إنشاء الحساب الآن، تأكد من البيانات ثم حاول مجددًا.",
          ),
        );
      }

      showSuccessToast(
        getApiMessageInArabic(
          result,
          "تم إنشاء حسابك بنجاح، بقيت خطوة واحدة لتفعيل الحساب.",
        ),
      );

      navigate("/otp", {
        state: { email: data.email },
      });
    } catch (error: unknown) {
      showErrorToast(
        getErrorMessageInArabic(error, "حدث خطأ غير متوقع أثناء إنشاء الحساب."),
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full bg-[#0e0e0e]">
      <div className="relative z-20 flex w-full flex-col items-center justify-center p-4 sm:p-8 lg:w-1/2 lg:p-12">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-[#141414] p-8 shadow-2xl sm:p-10">
          <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <form
            className="relative z-10 flex w-full flex-col items-center justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
              إنشاء حساب جديد
            </h2>

            <p className="mb-8 text-center text-sm leading-relaxed text-gray-400">
              انضم إلينا الآن للوصول إلى آلاف الحسابات الجاهزة!
            </p>

            <div className="mb-5 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                الاسم الكامل
              </label>

              <div
                className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <User className="h-5 w-5 shrink-0 text-gray-500" />

                <Input
                  type="text"
                  placeholder="Ali Ahmed"
                  className="h-full w-full border-0 bg-transparent text-left text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("full_name", {
                    required: "الاسم الكامل مطلوب",
                  })}
                />
              </div>

              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="mb-5 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                البريد الإلكتروني
              </label>

              <div
                className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Mail className="h-5 w-5 shrink-0 text-gray-500" />

                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="h-full w-full border-0 bg-transparent text-left text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "البريد الإلكتروني غير صحيح",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-5 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                الدولة
              </label>

              <div dir="ltr">
                <div
                  className="flex h-12 w-full! items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent
                "
                >
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "الدولة مطلوبة" }}
                    render={({ field }) => (
                      <Select
                        aria-label="Select country"
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          size="sm"
                          className="h-full w-full bg-transparent border-0 px-0 text-white shadow-none ring-0 outline-none focus:ring-0 focus:outline-none data-[placeholder]:text-gray-500"
                        >
                          <MapPin className="size-5 shrink-0 text-gray-500" />
                          <SelectValue>
                            <span
                              className={
                                selectedCountryName
                                  ? "text-white"
                                  : "text-gray-500"
                              }
                            >
                              {selectedCountryName || "اختر الدولة"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectPopup className="mt-1 rounded-xl border border-white/10 bg-[#141414] text-white shadow-2xl">
                          {" "}
                          {countries.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={String(country.id)}
                              className="text-white"
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="mb-5 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                رقم واتساب
              </label>

              <div
                className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Phone className="h-5 w-5 shrink-0 text-gray-500" />

                <Input
                  type="tel"
                  placeholder="213555000000"
                  className="h-full w-full border-0 bg-transparent text-left text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("whatsapp", {
                    required: "رقم واتساب مطلوب",
                    pattern: {
                      value: /^\+?[0-9]{8,15}$/,
                      message: "صيغة رقم واتساب غير صحيحة",
                    },
                  })}
                />
              </div>

              {errors.whatsapp && (
                <p className="text-sm text-red-500">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            <div className="mb-5 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                كلمة المرور
              </label>

              <div
                className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-full w-full border-0 bg-transparent text-left tracking-widest text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 6,
                      message: "يجب أن تكون 6 أحرف على الأقل",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 text-gray-500 hover:text-accent focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-8 w-full space-y-2 text-right">
              <label className="text-sm font-semibold tracking-wide text-gray-300">
                تأكيد كلمة المرور
              </label>

              <div
                className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 transition-all focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
                dir="ltr"
              >
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-full w-full border-0 bg-transparent text-left tracking-widest text-white outline-none placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register("password_confirm", {
                    required: "تأكيد كلمة المرور مطلوب",
                    validate: (value) =>
                      value === watch("password") ||
                      "كلمتا المرور غير متطابقتين",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="shrink-0 text-gray-500 hover:text-accent focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {errors.password_confirm && (
                <p className="text-sm text-red-500">
                  {errors.password_confirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mb-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-bold text-black shadow-lg transition-all hover:bg-accent/90"
              style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
            >
              تسجيل حساب جديد
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-sm text-gray-400">
              أتمتلك حساباً بالفعل؟{" "}
              <Link
                to="/login"
                className="font-bold text-white transition-colors hover:text-accent"
              >
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="relative hidden w-full p-4 pl-0 lg:block lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-10 bg-linear-to-l from-[#0e0e0e] to-transparent" />
          <div className="absolute inset-0 z-10 bg-linear-to-t from-[#0e0e0e] via-transparent to-transparent" />

          <img
            className="h-full w-full object-cover"
            src="/login-bg.png"
            alt="Signup Background"
          />

          <div className="absolute inset-0 z-0 bg-accent/5 mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}
