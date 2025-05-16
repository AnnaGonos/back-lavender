import {registerEnumType} from "@nestjs/graphql";

export enum OrderStatus {
    CREATED = 'created',
    CONFIRMED = 'confirmed',
    ASSEMBLED = 'assembled',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

registerEnumType(OrderStatus, {
    name: 'OrderStatus',
});
