import {registerEnumType} from "@nestjs/graphql";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    FLORIST = 'florist',
}

registerEnumType(UserRole, {
    name: 'UserRole',
});