import { Send, HeadphonesIcon } from "lucide-react";

export default function ContactDescription() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 lg:py-24">
      {/* Header */}
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-6">
          <HeadphonesIcon className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          تواصل معنا
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          نحن هنا لمساعدتك! إذا كان لديك أي استفسار، مشكلة، أو اقتراح، فلا تتردد
          في الوصول إلينا. فريق الدعم متاح للرد على جميع تساؤلاتك، أو يمكنك
          استخدام أزرار التواصل السريع أسفل الشاشة.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Contact Form */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-wide">
              أرسل لنا رسالة
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300 tracking-wide">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: أحمد محمد"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300 tracking-wide">
                    البريد أو الهاتف
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل وسيلة للتواصل معك"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-left dir-ltr"
                    dir="auto"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 tracking-wide">
                  موضوع الرسالة
                </label>
                <input
                  type="text"
                  placeholder="عن ماذا تود الاستفسار؟"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 tracking-wide">
                  تفاصيل الرسالة
                </label>
                <textarea
                  rows={5}
                  placeholder="اكتب تفاصيل استفسارك أو مشكلتك هنا بوضوح..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold py-3.5 px-10 rounded-xl transition-all"
                  style={{ boxShadow: "0 0 20px rgba(212,175,55,0.25)" }}
                >
                  <Send className="w-5 h-5 rtl:pl-1 ltr:pr-1" />
                  <span>إرسال الرسالة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
