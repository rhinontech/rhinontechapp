import { Model, Optional } from "sequelize";
export type InboxMessageSenderType = "customer" | "agent" | "system";
interface InboxMessageAttributes {
    id: string;
    conversationId: string;
    senderType: InboxMessageSenderType;
    senderName: string;
    body: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface InboxMessageCreationAttributes extends Optional<InboxMessageAttributes, "id"> {
}
export declare class InboxMessage extends Model<InboxMessageAttributes, InboxMessageCreationAttributes> implements InboxMessageAttributes {
    id: string;
    conversationId: string;
    senderType: InboxMessageSenderType;
    senderName: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=InboxMessage.d.ts.map