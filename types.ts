// Fix: Defining the Page enum to be used for navigation across the application.
export enum Page {
  Login,
  Dashboard,
  Profile,
  ConsultationHistory,
  CRLVOrders,
  Financial,
  CreditRecharge,
  TermsOfUse,
  AdminPanel,
  Logout,
  ApiDocs,
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: 'active' | 'paused';
  frequency: 'once' | 'hourly' | 'daily';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatarUrl?: string;
}