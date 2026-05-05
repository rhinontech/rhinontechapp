import { Role } from "./Role";
import { Permission } from "./Permission";
import { User } from "./User";
import { InboxConversation } from "./InboxConversation";
import { InboxMessage } from "./InboxMessage";
import { InboxEmail } from "./InboxEmail";
import { Payroll } from "./Payroll";
import { Payslip } from "./Payslip";
declare const RolePermission: import("sequelize").ModelCtor<import("sequelize").Model<any, any>>;
export { Role, Permission, RolePermission, User, InboxConversation, InboxMessage, InboxEmail, Payroll, Payslip };
export declare function syncDatabase(force?: boolean): Promise<void>;
//# sourceMappingURL=index.d.ts.map