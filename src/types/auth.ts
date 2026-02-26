export interface Tenant {
  id: string;
  userId: string;
  tenantId: string;
  localSchoolId: string;
  role: "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenants: Tenant[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SsoCodeResponse {
  code: string;
  expiresIn: number;
}

export interface ErrorResponse {
  message: string;
}
