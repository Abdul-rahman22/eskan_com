export type Tables<T extends string> = T extends 'user_properties' ? UserProperty : T extends 'profiles' ? Profile : T extends 'favorites' ? Favorite : never;

export interface UserProperty {
  id: string;
  user_id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  images: string[];
  views_count: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  user_id: string;
  property_id: string;
  created_at: string;
}
