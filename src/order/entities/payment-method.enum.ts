import {registerEnumType} from "@nestjs/graphql";

export enum PaymentMethod {
    CASH = 'cash',
    ONLINE = 'online',
}

registerEnumType(PaymentMethod, {
    name: 'PaymentMethod',
});