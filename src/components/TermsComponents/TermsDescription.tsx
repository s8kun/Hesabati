import {
  ShieldAlert,
  Info,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
export default function TermsDescription() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-6">
          <ShieldAlert className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          الشروط والأحكام
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          مرحباً بك في منصة حساباتي. يرجى قراءة هذه الشروط بعناية، حيث توضح
          طبيعة عمل المنصة وحدود مسؤوليتنا لضمان تجربة آمنة وشفافة للجميع.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <section className="bg-white/2 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 hover:bg-white/4 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="p-3.5 bg-accent/10 rounded-xl shrink-0">
              <Info className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-wide">
                دور منصة حساباتي
              </h2>
              <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                تعمل منصة "حساباتي" كواجهة إعلانية لعرض الحسابات المتاحة للبيع.
                نحن نوفر المساحة التي تجمع بين البائع والمشتري لتسهيل الوصول
                للحسابات المطلوبة. المنصة لا تتدخل في تسعير الحسابات ولا تمتلكها
                بشكل مباشر.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white/2 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 hover:bg-white/4 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="p-3.5 bg-blue-500/10 rounded-xl shrink-0">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-wide">
                آلية التواصل وإتمام البيع
              </h2>
              <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                جميع عمليات البيع والشراء والمفاوضات تتم خارج المنصة. بمجرد
                اختيار المشتري للحساب المناسب، يتم التواصل مع البائع مباشرة عبر
                تطبيق "واتساب" لإكمال إجراءات النقل والدفع بالاتفاق المتبادل بين
                الطرفين.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[#1a0f0f] border border-red-500/20 rounded-2xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex flex-col md:flex-row items-start gap-5 relative z-10">
            <div className="p-3.5 bg-red-500/10 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-wide">
                إخلاء المسؤولية التامة
              </h2>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                نود التنويه بشدة والتأكيد على أن منصة "حساباتي" تخلي مسؤوليتها
                القانونية والمالية تماماً عن أي عمليات نصب أو احتيال أو خلافات
                قد تنشأ بين البائع والمشتري. نشاطنا يقتصر حصراً على ربط الطرفين،
                وأي إجراء أو تحويل مالي يتم فهو على مسؤوليتكم الشخصية الكاملة.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white/2 border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 hover:bg-white/4 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="p-3.5 bg-emerald-500/10 rounded-xl shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-4 tracking-wide">
                نصائح من حساباتي للتعامل الآمن
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 text-base md:text-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2.5" />
                  <span>
                    تأكد دائماً من تفاصيل الحساب ومصداقية البائع وطابق المعلومات
                    المُرسلة قبل إجراء أي تحويل مالي.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-base md:text-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2.5" />
                  <span>
                    لا تقم بتأكيد أو إنهاء المعاملة وتغيير معلومات الاعتماد حتى
                    تتأكد من حصولك على الوصول الكامل للحساب.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-base md:text-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2.5" />
                  <span>
                    قم بتغيير جميع كلمات المرور وربط الحساب بمعلوماتك الشخصية
                    فور استلامه لضمان الأمان.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 text-center text-sm md:text-base text-gray-500">
        باستخدامك لمنصة حساباتي، فإنك توافق ضمنياً على هذه الشروط والأحكام وتقر
        بفهمك الكامل لها.
      </div>
    </div>
  );
}
