import { Model, Optional } from "sequelize";
interface RoleAttributes {
    id: string;
    name: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {
}
export declare class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=Role.d.ts.map