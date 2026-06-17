import type {
  Conversation,
  Message,
  Property,
  Report,
  Review,
  User,
} from "./types";
import { generateId } from "./utils";
import { SEED_PROPERTIES, SEED_USERS, SEED_REVIEWS } from "./seed";

const KEYS = {
  users: "habitia_users",
  properties: "habitia_properties",
  favorites: "habitia_favorites",
  currentUser: "habitia_current_user",
  theme: "habitia_theme",
  conversations: "habitia_conversations",
  messages: "habitia_messages",
  reviews: "habitia_reviews",
  reports: "habitia_reports",
  compare: "habitia_compare",
  initialized: "habitia_initialized",
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.initialized)) return;

  setItem(KEYS.users, SEED_USERS);
  setItem(KEYS.properties, SEED_PROPERTIES);
  setItem(KEYS.favorites, []);
  setItem(KEYS.conversations, []);
  setItem(KEYS.messages, []);
  setItem(KEYS.reviews, SEED_REVIEWS);
  setItem(KEYS.reports, []);
  setItem(KEYS.compare, []);
  localStorage.setItem(KEYS.initialized, "true");
}

// Users
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]) {
  setItem(KEYS.users, users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: Omit<User, "id" | "createdAt" | "verified">) {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    verified: user.role === "seller" ? false : true,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, data: Partial<User>) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...data } : u));
  saveUsers(users);
  return users.find((u) => u.id === id);
}

// Auth session
export function getCurrentUser(): User | null {
  return getItem<User | null>(KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null) {
  setItem(KEYS.currentUser, user);
}

// Properties
export function getProperties(): Property[] {
  return getItem<Property[]>(KEYS.properties, []);
}

export function saveProperties(properties: Property[]) {
  setItem(KEYS.properties, properties);
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id);
}

export function createProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt" | "active">
) {
  const properties = getProperties();
  const now = new Date().toISOString();
  const property: Property = {
    ...data,
    id: generateId(),
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  properties.unshift(property);
  saveProperties(properties);
  return property;
}

export function updateProperty(id: string, data: Partial<Property>) {
  const properties = getProperties().map((p) =>
    p.id === id
      ? { ...p, ...data, updatedAt: new Date().toISOString() }
      : p
  );
  saveProperties(properties);
  return properties.find((p) => p.id === id);
}

export function deleteProperty(id: string) {
  const properties = getProperties().filter((p) => p.id !== id);
  saveProperties(properties);
}

// Favorites
export function getFavorites(): string[] {
  return getItem<string[]>(KEYS.favorites, []);
}

export function toggleFavorite(propertyId: string): boolean {
  const favorites = getFavorites();
  const exists = favorites.includes(propertyId);
  const updated = exists
    ? favorites.filter((id) => id !== propertyId)
    : [...favorites, propertyId];
  setItem(KEYS.favorites, updated);
  return !exists;
}

export function isFavorite(propertyId: string): boolean {
  return getFavorites().includes(propertyId);
}

// Compare
export function getCompareList(): string[] {
  return getItem<string[]>(KEYS.compare, []);
}

export function toggleCompare(propertyId: string): boolean {
  const list = getCompareList();
  const exists = list.includes(propertyId);
  if (exists) {
    setItem(
      KEYS.compare,
      list.filter((id) => id !== propertyId)
    );
    return false;
  }
  if (list.length >= 3) return false;
  setItem(KEYS.compare, [...list, propertyId]);
  return true;
}

// Theme
export function getTheme(): "light" | "dark" {
  return getItem<"light" | "dark">(KEYS.theme, "light");
}

export function setTheme(theme: "light" | "dark") {
  setItem(KEYS.theme, theme);
}

// Messages
export function getConversations(): Conversation[] {
  return getItem<Conversation[]>(KEYS.conversations, []);
}

export function getMessages(): Message[] {
  return getItem<Message[]>(KEYS.messages, []);
}

export function getOrCreateConversation(
  propertyId: string,
  buyerId: string,
  sellerId: string
): Conversation {
  const conversations = getConversations();
  let conv = conversations.find(
    (c) =>
      c.propertyId === propertyId &&
      c.buyerId === buyerId &&
      c.sellerId === sellerId
  );
  if (conv) return conv;

  conv = {
    id: generateId(),
    propertyId,
    buyerId,
    sellerId,
    unreadCount: 0,
  };
  conversations.push(conv);
  setItem(KEYS.conversations, conversations);
  return conv;
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
) {
  const messages = getMessages();
  const msg: Message = {
    id: generateId(),
    conversationId,
    senderId,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(msg);

  const conversations = getConversations().map((c) =>
    c.id === conversationId
      ? {
          ...c,
          lastMessage: text,
          lastMessageAt: msg.createdAt,
          unreadCount: c.unreadCount + (senderId !== getCurrentUser()?.id ? 0 : 0),
        }
      : c
  );
  setItem(KEYS.messages, messages);
  setItem(KEYS.conversations, conversations);
  return msg;
}

export function getConversationMessages(conversationId: string): Message[] {
  return getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

// Reviews
export function getReviews(): Review[] {
  return getItem<Review[]>(KEYS.reviews, []);
}

export function getPropertyReviews(propertyId: string): Review[] {
  return getReviews().filter((r) => r.propertyId === propertyId);
}

export function addReview(
  review: Omit<Review, "id" | "createdAt">
) {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  setItem(KEYS.reviews, reviews);
  return newReview;
}

// Reports
export function getReports(): Report[] {
  return getItem<Report[]>(KEYS.reports, []);
}

export function addReport(report: Omit<Report, "id" | "createdAt" | "status">) {
  const reports = getReports();
  const newReport: Report = {
    ...report,
    id: generateId(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reports.push(newReport);
  setItem(KEYS.reports, reports);
  return newReport;
}

export function updateReport(id: string, status: Report["status"]) {
  const reports = getReports().map((r) =>
    r.id === id ? { ...r, status } : r
  );
  setItem(KEYS.reports, reports);
}
