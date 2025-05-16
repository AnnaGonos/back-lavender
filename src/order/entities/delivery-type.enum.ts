import {registerEnumType} from "@nestjs/graphql";

export enum DeliveryType {
    PICKUP = 'pickup',
    COURIER = 'courier',
}

registerEnumType(DeliveryType, {
    name: 'DeliveryType',
});