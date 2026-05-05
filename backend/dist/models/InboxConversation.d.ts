import { Model, Optional } from "sequelize";
export type InboxConversationStatus = "open" | "in_progress" | "resolved" | "closed";
export type InboxConversationPriority = "low" | "normal" | "high" | "urgent";
interface InboxConversationAttributes {
    id: string;
    subject: string;
    status: InboxConversationStatus;
    priority: InboxConversationPriority;
    source: string;
    customerName: string;
    customerEmail: string;
    customerCompany?: string | null;
    customerLocation?: string | null;
    language: string;
    brand: string;
    externalId?: string | null;
    workspacePhoneNumber?: string | null;
    copilotUsed: boolean;
    assignedToUserId?: string | null;
    teamInbox: string;
    topics: string[];
    tags: string[];
    lastMessagePreview: string;
    lastMessageAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
interface InboxConversationCreationAttributes extends Optional<InboxConversationAttributes, "id" | "status" | "priority" | "customerCompany" | "customerLocation" | "externalId" | "workspacePhoneNumber" | "copilotUsed" | "assignedToUserId" | "teamInbox" | "topics" | "tags"> {
}
export declare class InboxConversation extends Model<InboxConversationAttributes, InboxConversationCreationAttributes> implements InboxConversationAttributes {
    id: string;
    subject: string;
    status: InboxConversationStatus;
    priority: InboxConversationPriority;
    source: string;
    customerName: string;
    customerEmail: string;
    customerCompany: string | null;
    customerLocation: string | null;
    language: string;
    brand: string;
    externalId: string | null;
    workspacePhoneNumber: string | null;
    copilotUsed: boolean;
    assignedToUserId: string | null;
    teamInbox: string;
    topics: string[];
    tags: string[];
    lastMessagePreview: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=InboxConversation.d.ts.map