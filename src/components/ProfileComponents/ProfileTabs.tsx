import type { ProfileTab } from "./profile.types";
import { tabs } from "./profile.utils";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
};

export default function ProfileTabs({
  activeTab,
  onChange,
}: ProfileTabsProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/6 bg-[#141414] p-3 shadow-2xl">
      <div className="grid gap-3 sm:grid-cols-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              activeTab === tab.id
                ? "bg-accent text-black shadow-[0_0_20px_rgba(212,175,55,0.22)]"
                : "bg-white/4 text-gray-300 hover:bg-white/8 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}
