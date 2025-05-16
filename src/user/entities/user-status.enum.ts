import {registerEnumType} from "@nestjs/graphql";

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
}

registerEnumType(UserStatus, {
    name: 'UserStatus',
});
