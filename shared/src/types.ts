// Shared types for the SLChatApp
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: string[];
}
