import { Model, Optional } from "sequelize";
export type InboxEmailFolder = "inbox" | "sent" | "drafts" | "archive" | "trash";
interface InboxEmailAttributes {
    id: string;
    threadKey: string;
    folder: InboxEmailFolder;
    fromName: string;
    fromEmail: string;
    toEmails: string[];
    ccEmails: string[];
    subject: string;
    body: string;
    snippet: string;
    isRead: boolean;
    isStarred: boolean;
    hasAttachment: boolean;
    sentAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
interface InboxEmailCreationAttributes extends Optional<InboxEmailAttributes, "id" | "folder" | "ccEmails" | "isRead" | "isStarred" | "hasAttachment"> {
}
export declare class InboxEmail extends Model<InboxEmailAttributes, InboxEmailCreationAttributes> implements InboxEmailAttributes {
    id: string;
    threadKey: string;
    folder: InboxEmailFolder;
    fromName: string;
    fromEmail: string;
    toEmails: string[];
    ccEmails: string[];
    subject: string;
    body: string;
    snippet: string;
    isRead: boolean;
    isStarred: boolean;
    hasAttachment: boolean;
    sentAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=InboxEmail.d.ts.map