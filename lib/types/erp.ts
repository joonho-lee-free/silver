export type CareLevel = "1등급" | "2등급" | "3등급" | "4등급" | "5등급" | "인지지원등급";

export type CoPayRate = 15 | 9 | 6 | 0; // 15% (일반), 9% (감경 40%), 6% (감경 60%), 0% (기초수급)

export type UserRole = "admin" | "caregiver";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  centerName?: string;
  phone?: string;
}

export interface Recipient {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  careLevel: CareLevel;
  certNumber: string; // e.g. L1234567890
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coPayRate: CoPayRate;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  phone: string;
  status: "재직" | "휴직" | "퇴사";
}

export interface Schedule {
  id: string;
  caregiverId: string;
  caregiverName: string;
  recipientId: string;
  recipientName: string;
  dayOfWeek: number; // 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  serviceType: "방문요양" | "방문목욕" | "방문간호" | "주야간보호";
  notes?: string;
  createdAt?: string;
}

export interface CareLog {
  id?: string;
  scheduleId: string;
  recipientId: string;
  recipientName: string;
  caregiverId: string;
  caregiverName: string;
  logDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  mealStatus: "전부 섭취" | "반 이상 섭취" | "반 미만 섭취" | "미섭취";
  medicationStatus: "완료" | "일부 복약" | "미복약" | "해당없음";
  physicalActivity: string[]; // ["세면도움", "몸청결", "식사도움", "체위변경", "배설도움", "외출동행", "신체기능유지"]
  photoUrl?: string; // Base64 data URL or Storage URL
  notes?: string;
  createdAt: string; // ISO string
}
