declare module "firebase/firestore" {
  export interface Timestamp {
    seconds: number;
    nanoseconds: number;
    toMillis(): number;
    toDate(): Date;
  }
  export interface DocumentData {
    [key: string]: any;
  }
  export interface QueryDocumentSnapshot {
    id: string;
    data(): DocumentData;
  }
  export interface QuerySnapshot {
    docs: QueryDocumentSnapshot[];
    empty: boolean;
    size: number;
    forEach(callback: (result: QueryDocumentSnapshot) => void): void;
  }
  export function collection(...args: any[]): any;
  export function doc(...args: any[]): any;
  export function getDocs(...args: any[]): Promise<QuerySnapshot>;
  export function addDoc(...args: any[]): Promise<any>;
  export function updateDoc(...args: any[]): Promise<void>;
  export function deleteDoc(...args: any[]): Promise<void>;
  export function query(...args: any[]): any;
  export function where(...args: any[]): any;
  export function orderBy(...args: any[]): any;
  export function limit(...args: any[]): any;
  export function onSnapshot(
    query: any,
    callback: (snapshot: QuerySnapshot) => void,
    error?: (error: any) => void
  ): () => void;
  export function serverTimestamp(...args: any[]): any;
  export function getFirestore(...args: any[]): any;
}

declare module "firebase/app" {
  export function initializeApp(...args: any[]): any;
  export function getApps(): any[];
}

declare module "firebase/storage" {
  export function getStorage(...args: any[]): any;
  export function ref(...args: any[]): any;
  export function uploadBytes(...args: any[]): any;
  export function getDownloadURL(...args: any[]): any;
}
