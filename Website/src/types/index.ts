/**
 * Shared domain types for API entities used across pages.
 * Mirrors the AssetFlow backend response shapes.
 */

export interface User {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  designation?: string;
  department?: string | { _id?: string; name?: string; code?: string };
  avatar?: string;
  employeeCount?: number;
  assetCount?: number;
}

export interface Department {
  _id: string;
  name: string;
  code?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  headOfDepartment?: { firstName?: string; lastName?: string } | string | null;
  employees?: User[];
  employeeCount?: number;
  head?: string;
  assetCount?: number;
  assets?: number;
}

export interface AssetCategory {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  assetCount?: number;
  count?: number;
}

export interface Asset {
  _id: string;
  name: string;
  serialNumber?: string;
  assetTag?: string;
  tag?: string;
  status?: string;
  category?: { name?: string } | string;
  department?: { name?: string } | string;
  currentHolder?: { firstName?: string; lastName?: string } | string | null;
  assignee?: string;
  acquisitionCost?: number;
  value?: number;
  acquisitionDate?: string;
}

export interface Allocation {
  _id: string;
  status?: string;
  asset?: { serialNumber?: string; name?: string } | string;
  assetId?: string;
  allocatedTo?: { firstName?: string; lastName?: string } | string;
  allocatedDate?: string;
  expectedReturnDate?: string;
}

export interface Booking {
  _id: string;
  status?: string;
  resource?: { name?: string } | string;
  bookedBy?: { firstName?: string; lastName?: string } | null;
  startDateTime?: string;
  endDateTime?: string;
  purpose?: string;
}

export interface MaintenanceRequest {
  _id: string;
  status?: string;
  priority?: string;
  asset?: { serialNumber?: string; name?: string } | string;
  assetId?: string;
  raisedBy?: { firstName?: string; lastName?: string } | null;
  issueDescription?: string;
  createdAt?: string;
}

export interface AuditCycle {
  _id: string;
  name?: string;
  description?: string;
  status?: string;
  progress?: number;
  discrepanciesFound?: number;
}

export interface AppNotification {
  _id: string;
  type?: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface FormOption {
  _id: string;
  name?: string;
  serialNumber?: string;
  firstName?: string;
  lastName?: string;
}

/** Extract display info from a populated-or-id Mongoose ref. */
export interface PopulatedRef {
  _id?: string;
  name?: string;
  serialNumber?: string;
  firstName?: string;
  lastName?: string;
}

export type Ref<T extends PopulatedRef> = T | string | null | undefined;

export function refId(ref: Ref<PopulatedRef>): string | undefined {
  if (!ref) return undefined;
  return typeof ref === "string" ? ref : ref._id;
}

export function refName(ref: Ref<PopulatedRef>): string {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref.name ?? "";
}

export function refSerial(ref: Ref<PopulatedRef>): string {
  if (!ref || typeof ref === "string") return "";
  return ref.serialNumber ?? "";
}

export function refPersonName(ref: Ref<PopulatedRef>): string {
  if (!ref) return "Unknown";
  if (typeof ref === "string") return "Unknown";
  const { firstName, lastName, name } = ref;
  if (firstName || lastName) return [firstName, lastName].filter(Boolean).join(" ");
  return name ?? "Unknown";
}

/** Generic record of form fields built from FormData entries. */
export type FormRecord = Record<string, unknown>;

/** Helper to narrow an unknown caught error for display. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

/** Build a URLSearchParams from loosely-typed filters. */
export function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  return search.toString();
}
