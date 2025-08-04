import { ConversationRecord } from "./conversation";
import { UserRecord } from "./user";

export type MessageStatus = "SENT" | "DELIVERED";

export interface MessageRecord {
  messageId: string;
  conversationId: string;
  senderId: string;
  messageStatus: MessageStatus;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRelations {
  Conversation: ConversationRecord;
  Sender: UserRecord;
}
