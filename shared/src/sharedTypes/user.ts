import { ConversationUserRecord } from "./conversation";
import { MessageRecord } from "./messages";

export type UserRole = "ADMIN" | "USER" | "TEACHER";

export interface UserRecord {
  userId: string;
  emailAddress: string;
  authHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string | null;
  career?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null;
  bio?: string | null;
  lastLogin?: Date | null;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserRelations {
  JoinedConversations: ConversationUserRecord[];
  SentMessages: MessageRecord[];
  Sessions: SessionRecord[];
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  refreshTokenHash: string;
  deviceInfo?: string | null;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
}

export interface SessionRelations {
  User: UserRecord;
}

export interface UserLoginResponse {
  user: UserRecord;
  token: string;
  refreshToken: string;
  // TODO Add here refresh token
}
