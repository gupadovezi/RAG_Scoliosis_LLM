
export enum UserRole {
  PATIENT = 'patient',
  PROFESSIONAL = 'professional'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AppState {
  messages: Message[];
  role: UserRole;
  isTyping: boolean;
}
