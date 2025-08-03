export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export interface UserRecord {
  userId: string;
  emailAddress: string;
  authHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
  career?: string;
  location?: string;
  profilePictureUrl?: string;
  bio?: string;
  lastLogin?: Date;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserRelations {
  CreatedConversations: any[];
  JoinedConversations: any[];
  SentMessages: any[];
  Sessions: any[];
}
