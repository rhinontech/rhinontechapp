import { Role } from "./Role";
import { Permission } from "./Permission";
import { User } from "./User";
import { InboxConversation } from "./InboxConversation";
import { InboxMessage } from "./InboxMessage";
import { InboxEmail } from "./InboxEmail";
declare const RolePermission: import("sequelize").ModelCtor<import("sequelize").Model<any, any>>;
export { Role, Permission, RolePermission, User, InboxConversation, InboxMessage, InboxEmail };
export declare function syncDatabase(force?: boolean): Promise<void>;
//# sourceMappingURL=index.d.ts.map