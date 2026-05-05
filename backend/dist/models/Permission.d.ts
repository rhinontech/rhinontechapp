import { Model, Optional } from "sequelize";
interface PermissionAttributes {
    id: string;
    name: string;
    resource: string;
    action: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface PermissionCreationAttributes extends Optional<PermissionAttributes, "id"> {
}
export declare class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
    id: string;
    name: string;
    resource: string;
    action: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=Permission.d.ts.map