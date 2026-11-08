/**
 * Types of the Vowly Go API (docs/api-contract.md in the API repo). Field names are snake_case exactly as the API
 * sends them; money is an integer in rupiah, dates are YYYY-MM-DD, timestamps are RFC 3339 UTC.
 */

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export type FieldError = { field: string; tag: string; message: string };

/** Standard envelope of every API response. */
export type Envelope<T> = {
  status: "success" | "error";
  code: number;
  message: string;
  data?: T;
  meta?: PageMeta;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  photo?: string;
  photo_url?: string;
};

// ---- catalog and orders ----
export type Package = { id: string; code: string; name: string; price: number; features: string[]; is_active: boolean };
export type Template = { id: string; slug: string; name: string; preview_url: string; sort_order: number; is_active: boolean };
export type AdminVoucher = {
  id: string;
  code: string;
  kind: "voucher" | "referral";
  discount_type: "fixed" | "percent";
  amount: number;
  quota: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
};
export type ValidatedCode = { code: string; kind: "voucher" | "referral"; amount: number };
export type OrderDiscount = { kind: "voucher" | "referral"; code: string; amount: number };
export type OrderStatus = "pending" | "paid" | "expired" | "cancelled";
export type Order = {
  id: string;
  invitation_id: string;
  status: OrderStatus;
  package_price: number;
  discounts: OrderDiscount[];
  total: number;
  payment: { method: string; va_number: string; status: string; expires_at: string } | null;
  paid_at: string | null;
  created_at: string;
};

// ---- project (invitation) ----
export type Stage = "lamaran" | "persiapan" | "final";
export type Invitation = {
  id: string;
  is_owner: boolean;
  bride_name: string;
  groom_name: string;
  title: string;
  subdomain: string;
  event_date: string;
  stage: Stage;
  address: string | null;
  venue: string | null;
  city: string | null;
  guest_count: number | null;
  template_id: string | null;
  total_budget: number;
  love_story: string | null;
  hashtags: string[];
  customization: Record<string, unknown>;
  created_at: string;
};
export type SubdomainCheck = { subdomain: string; available: boolean };

// ---- dashboard ----
export type ActivityEntry = {
  id: string;
  actor_id: string | null;
  entity_type: string;
  entity_id: string | null;
  message: string;
  created_at: string;
};
export type Home = {
  event_date: string;
  days_until_event: number;
  stage: Stage;
  total_budget: number;
  actual_spent: number;
  budget_remaining: number;
  guest_estimate: number;
  guest_count: number;
  rsvp_attending_pax: number;
  tasks_open: number;
  tasks_due_soon: number;
  recent_activity: ActivityEntry[];
};

export type CoupleMember = {
  id: string;
  role: "groom" | "bride";
  full_name: string;
  nickname: string;
  father_name: string;
  mother_name: string;
  birth_order: string | null;
  instagram: string | null;
  whatsapp: string;
};
export type GiftAccount = { id: string; bank: string; account_number: string; account_name: string };

export type RsvpStatus = "belum_respons" | "hadir" | "tidak_hadir";
export type SeatingTable = { id: string; name: string; capacity: number; is_vip: boolean; used_pax: number; over_capacity: boolean };
export type Guest = {
  id: string;
  full_name: string;
  display_name: string;
  category: string;
  phone: string;
  pax: number;
  table_id: string | null;
  dietary_notes: string | null;
  rsvp_status: RsvpStatus;
  session_ids: string[];
};

export type PaymentStatus = "belum_bayar" | "dp" | "lunas";
export type BudgetItem = {
  id: string;
  name: string;
  category: string;
  estimated_amount: number;
  actual_amount: number;
  payment_status: PaymentStatus;
  due_date: string | null;
  source_account: string | null;
  notes: string | null;
  vendor_id: string | null;
  receipt_file_id: string | null;
};
export type BudgetSummary = {
  total_budget: number;
  estimated_total: number;
  actual_total: number;
  remaining: number;
  over_budget: boolean;
  items_over_estimate: number;
  status: string;
};

export type TaskStatus = "belum_mulai" | "dalam_koordinasi" | "terverifikasi_pic" | "selesai";
export type TaskPriority = "rendah" | "sedang" | "tinggi";
export type ChecklistItem = {
  id: string;
  title: string;
  phase: string;
  category: string;
  pic_name: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  cost_amount: number | null;
  budget_item_id: string | null;
  notes: string | null;
};

export type VendorStatus = "negosiasi" | "terkunci";
export type Vendor = {
  id: string;
  name: string;
  category: string;
  pic_name: string;
  phone: string;
  email: string;
  portfolio_url: string;
  relationship_status: VendorStatus;
  contract_value: number;
  payment_scheme: string;
  contract_date: string | null;
  sla_notes: string | null;
};
export type VendorCuration = { category: string; allocated: number; spent: number; remaining: number };

export type EventSession = {
  id: string;
  name: string;
  phase: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  priority: TaskPriority;
  pic_name: string;
  notes: string | null;
  sort_order: number;
  vendor_ids: string[];
};
export type SessionSummary = { total: number; ready: number; ready_percent: number };
export type EmergencyContact = { id: string; name: string; role: string; phone: string };

export type FileInfo = { id: string; filename: string; mime_type: string; size_bytes: number; created_at: string };
export type FileUrl = { url: string; expires_in: number };
export type DocumentKind = "kua" | "kontrak_vendor" | "rundown" | "bukti_bayar" | "lainnya";
export type DocumentStatus = "draf" | "menunggu_ttd" | "ditandatangani";
export type VowlyDocument = {
  id: string;
  title: string;
  kind: DocumentKind;
  file_id: string | null;
  vendor_id: string | null;
  contract_number: string;
  parties: string;
  status: DocumentStatus;
};
export type DocumentSummary = { total: number; by_status: Record<string, number>; kua_total: number; kua_signed: number };

export type DeliveryStatus = "belum_dikirim" | "mengirim" | "terkirim" | "gagal";
export type Delivery = { id: string; guest_id: string; channel: string; status: DeliveryStatus; sent_at: string | null; error: string | null };
export type DeliveryResult = { guest_id: string; status: "terkirim" | "gagal" | "dilewati"; reason: string | null };

export type Conversation = { id: string; title: string; expires_at: string; created_at: string };
export type ChatActionStatus = "proposed" | "confirmed" | "executed" | "rejected" | "failed";
export type ChatAction = { id: string; type: string; label: string; draft: string; status: ChatActionStatus };
export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; actions: ChatAction[]; created_at: string };
export type ConversationDetail = { conversation: Conversation; messages: ChatMessage[] };

export type CollaboratorRole = "pasangan" | "panitia_vendor";
export type PermissionLevel = "read" | "write";
export type Collaborator = {
  id: string;
  email: string;
  role: CollaboratorRole;
  permissions: Record<string, PermissionLevel>;
  status: "pending" | "accepted" | "revoked";
  user_id: string | null;
  invite_expires_at: string | null;
  created_at: string;
};
export type InviteCreated = { collaborator: Collaborator; invite_token: string };
export type AcceptInvite = { invitation_id: string; role: CollaboratorRole };
