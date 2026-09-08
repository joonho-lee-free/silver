import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient";
import { Recipient, Caregiver, Schedule, CareLog } from "./types/erp";

// Collection references
const RECIPIENTS_COL = "recipients";
const CAREGIVERS_COL = "caregivers";
const SCHEDULES_COL = "schedules";
const CARE_LOGS_COL = "care_logs";

// ----------------------------------------------------------------------
// 1. Recipient CRUD
// ----------------------------------------------------------------------
export async function getRecipients(): Promise<Recipient[]> {
  try {
    const snap = await getDocs(collection(db, RECIPIENTS_COL));
    const list: Recipient[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Recipient);
    });
    return list;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return [];
  }
}

export async function addRecipient(data: Omit<Recipient, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, RECIPIENTS_COL), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateRecipient(id: string, data: Partial<Recipient>): Promise<void> {
  const ref = doc(db, RECIPIENTS_COL, id);
  await updateDoc(ref, data);
}

export async function deleteRecipient(id: string): Promise<void> {
  const ref = doc(db, RECIPIENTS_COL, id);
  await deleteDoc(ref);
}

// ----------------------------------------------------------------------
// 2. Caregiver CRUD
// ----------------------------------------------------------------------
export async function getCaregivers(): Promise<Caregiver[]> {
  try {
    const snap = await getDocs(collection(db, CAREGIVERS_COL));
    const list: Caregiver[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Caregiver);
    });
    return list;
  } catch (error) {
    console.error("Error fetching caregivers:", error);
    return [];
  }
}

export async function addCaregiver(data: Omit<Caregiver, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, CAREGIVERS_COL), data);
  return docRef.id;
}

// ----------------------------------------------------------------------
// 3. Schedule CRUD & Overlap Logic
// ----------------------------------------------------------------------
export async function getSchedules(): Promise<Schedule[]> {
  try {
    const snap = await getDocs(collection(db, SCHEDULES_COL));
    const list: Schedule[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Schedule);
    });
    return list;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
}

/**
  * Time overlap validation logic for the same caregiver on the same day of week.
  * Overlap condition: (newStart < existingEnd) && (newEnd > existingStart)
  * Returns conflicting schedule if overlap found, or null if clear.
  */
export function checkScheduleOverlap(
  existingSchedules: Schedule[],
  target: {
    caregiverId: string;
    dayOfWeek: number;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    excludeScheduleId?: string;
  }
): Schedule | null {
  const targetStart = target.startTime;
  const targetEnd = target.endTime;

  for (const sched of existingSchedules) {
    if (target.excludeScheduleId && sched.id === target.excludeScheduleId) {
      continue;
    }
    if (sched.caregiverId === target.caregiverId && sched.dayOfWeek === target.dayOfWeek) {
      // Compare HH:mm strings directly (ISO 24-hour time string comparison)
      if (targetStart < sched.endTime && targetEnd > sched.startTime) {
        return sched;
      }
    }
  }
  return null;
}

export async function addSchedule(data: Omit<Schedule, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, SCHEDULES_COL), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateSchedule(id: string, data: Partial<Schedule>): Promise<void> {
  const ref = doc(db, SCHEDULES_COL, id);
  await updateDoc(ref, data);
}

export async function deleteSchedule(id: string): Promise<void> {
  const ref = doc(db, SCHEDULES_COL, id);
  await deleteDoc(ref);
}

// ----------------------------------------------------------------------
// 4. CareLog (급여제공기록)
// ----------------------------------------------------------------------
export async function addCareLog(log: CareLog): Promise<string> {
  const docRef = await addDoc(collection(db, CARE_LOGS_COL), {
    ...log,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getCareLogs(): Promise<CareLog[]> {
  try {
    const snap = await getDocs(collection(db, CARE_LOGS_COL));
    const list: CareLog[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as CareLog);
    });
    return list;
  } catch (error) {
    console.error("Error fetching care logs:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// 5. Seed Initial Data Function (Provides sample data for EasyCare ERP demo)
// ----------------------------------------------------------------------
export async function seedInitialErpData(): Promise<{ recipientsCount: number; caregiversCount: number; schedulesCount: number }> {
  // Check if data already exists
  const existingRecipients = await getRecipients();
  const existingCaregivers = await getCaregivers();
  const existingSchedules = await getSchedules();

  if (existingRecipients.length > 0 && existingCaregivers.length > 0) {
    return {
      recipientsCount: existingRecipients.length,
      caregiversCount: existingCaregivers.length,
      schedulesCount: existingSchedules.length,
    };
  }

  // Sample Caregivers
  const sampleCaregivers: Omit<Caregiver, "id">[] = [
    { name: "김영희 요양보호사", phone: "010-1234-5678", status: "재직" },
    { name: "박철수 요양보호사", phone: "010-2345-6789", status: "재직" },
    { name: "이순자 요양보호사", phone: "010-3456-7890", status: "재직" },
  ];

  const caregiverIds: { [name: string]: string } = {};
  for (const cg of sampleCaregivers) {
    const id = await addCaregiver(cg);
    caregiverIds[cg.name] = id;
  }

  // Today ISO date helper
  const now = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // Helper for adding days
  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  // Sample Recipients (including D-30 imminent expiration and active)
  const sampleRecipients: Omit<Recipient, "id">[] = [
    {
      name: "홍길동 어르신",
      birthDate: "1942-05-12",
      careLevel: "1등급",
      certNumber: "L1029384756",
      startDate: formatDate(addDays(now, -340)),
      endDate: formatDate(addDays(now, 15)), // Imminent expiration (D-15)
      coPayRate: 15,
      phone: "010-9999-1111",
      address: "서울특별시 강남구 테헤란로 123",
      notes: "독거 어르신, 보행 보조기 사용",
    },
    {
      name: "김순옥 어르신",
      birthDate: "1938-11-20",
      careLevel: "2등급",
      certNumber: "L9876543210",
      startDate: formatDate(addDays(now, -300)),
      endDate: formatDate(addDays(now, 5)), // Imminent expiration (D-5)
      coPayRate: 9,
      phone: "010-8888-2222",
      address: "서울특별시 서초구 반포대로 45",
      notes: "당뇨 관리 필요, 약 복용 확인 필수",
    },
    {
      name: "이갑수 어르신",
      birthDate: "1945-03-08",
      careLevel: "3등급",
      certNumber: "L5544332211",
      startDate: formatDate(addDays(now, -200)),
      endDate: formatDate(addDays(now, -2)), // Expired (D+2)
      coPayRate: 6,
      phone: "010-7777-3333",
      address: "서울특별시 마포구 마포대로 88",
      notes: "인정서 갱신 서류 신청 완료 상태",
    },
    {
      name: "최정자 어르신",
      birthDate: "1950-08-15",
      careLevel: "4등급",
      certNumber: "L7788990011",
      startDate: formatDate(addDays(now, -100)),
      endDate: formatDate(addDays(now, 265)), // Valid (D-265)
      coPayRate: 0,
      phone: "010-6666-4444",
      address: "서울특별시 송파구 올림픽로 300",
      notes: "기초생활수급자, 본인부담금 0%",
    },
  ];

  const recipientIds: { [name: string]: string } = {};
  for (const rec of sampleRecipients) {
    const id = await addRecipient(rec);
    recipientIds[rec.name] = id;
  }

  // Sample Schedules (Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=0)
  // Let's create schedules for today and other days
  const todayDayOfWeek = now.getDay(); // 0~6

  const sampleSchedules: Omit<Schedule, "id">[] = [
    {
      caregiverId: caregiverIds["김영희 요양보호사"] || "",
      caregiverName: "김영희 요양보호사",
      recipientId: recipientIds["홍길동 어르신"] || "",
      recipientName: "홍길동 어르신",
      dayOfWeek: todayDayOfWeek,
      startTime: "09:00",
      endTime: "12:00",
      serviceType: "방문요양",
      notes: "아침 식사 수발 및 신체 수발",
    },
    {
      caregiverId: caregiverIds["김영희 요양보호사"] || "",
      caregiverName: "김영희 요양보호사",
      recipientId: recipientIds["최정자 어르신"] || "",
      recipientName: "최정자 어르신",
      dayOfWeek: todayDayOfWeek,
      startTime: "14:00",
      endTime: "17:00",
      serviceType: "방문요양",
      notes: "오후 산책 및 정서지원",
    },
    {
      caregiverId: caregiverIds["박철수 요양보호사"] || "",
      caregiverName: "박철수 요양보호사",
      recipientId: recipientIds["김순옥 어르신"] || "",
      recipientName: "김순옥 어르신",
      dayOfWeek: todayDayOfWeek,
      startTime: "10:00",
      endTime: "13:00",
      serviceType: "방문목욕",
      notes: "주 2회 방문목욕 서비스",
    },
    {
      caregiverId: caregiverIds["이순자 요양보호사"] || "",
      caregiverName: "이순자 요양보호사",
      recipientId: recipientIds["이갑수 어르신"] || "",
      recipientName: "이갑수 어르신",
      dayOfWeek: (todayDayOfWeek + 1) % 7,
      startTime: "09:00",
      endTime: "12:00",
      serviceType: "방문간호",
      notes: "혈당 측정 및 가벼운 운동 보조",
    },
  ];

  for (const sched of sampleSchedules) {
    if (sched.caregiverId && sched.recipientId) {
      await addSchedule(sched);
    }
  }

  return {
    recipientsCount: sampleRecipients.length,
    caregiversCount: sampleCaregivers.length,
    schedulesCount: sampleSchedules.length,
  };
}
