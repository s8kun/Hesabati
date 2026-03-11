export type ProfileTab = "announcements" | "settings";

export type SellerAnnouncementsResponse = {
  seller_profile: {
    user: {
      id: number;
      email: string;
      full_name: string;
    };
    description: string;
    whatsapp: string;
    country: {
      name: string;
      currency_code: string;
      currency_name: string;
      rate_to_usd: string;
    };
  };
  announcements_data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AnnouncementItem[];
  };
};

export type AnnouncementItem = {
  id: number;
  title: string;
  description: string;
  price_original: string;
  price_usd: string;
  followers: number;
  account_created_at: string;
  status: string;
  created_at: string;
  account_link: string;
  category: string;
  seller: {
    user?: {
      id: number;
      email: string;
      full_name: string;
    };
    description: string;
    whatsapp: string;
    country: {
      name: string;
      currency_code: string;
      currency_name: string;
      rate_to_usd: string;
    };
  };
};

export type ProfileFormValues = {
  full_name: string;
  description: string;
  whatsapp: string;
};

export type PasswordFormValues = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};
