import { UserRecord } from "./user";

export type ConversationType = "PRIVATE" | "GROUP";

export interface ConversationRecord {
  conversationId: string;
  name?: string | null;
  createdBy: string;
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
  type: ConversationType;
}

export interface ConversationRelations {
  CreatedByUser: UserRecord;
  Users: ConversationUserRecord[];
}

export interface ConversationUserRecord {
  conversationUserId: string;
  conversationId: string;
  userId: string;
  joinedAt: Date;
}

export interface ConversationUserRelations {
  Conversation: ConversationRecord;
  User: UserRecord;
}
