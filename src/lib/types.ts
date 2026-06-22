export type UserRole = "seller" | "buyer" | "admin";

export type PropertyType =
  | "casa"
  | "apartamento"
  | "terreno"
  | "local"
  | "oficina";

export type PropertyStatus = "venta" | "alquiler";

export type PropertyTag = "destacada" | "nueva" | "oferta";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  verified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  amenities: string[];
  contactPhone: string;
  contactEmail: string;
  images: string[];
  tags: PropertyTag[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface Report {
  id: string;
  type: "property" | "user";
  targetId: string;
  reporterId: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

export type SortOption = "recent" | "price-asc" | "price-desc";

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  sort?: SortOption;
  featured?: boolean;
}
