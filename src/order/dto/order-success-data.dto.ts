import { ObjectType, Field } from '@nestjs/graphql';
import {Order} from "../entities/order.entity";

@ObjectType()
export class OrderSuccessData {
    @Field(() => String)
    pageTitle: string;

    @Field(() => Order)
    order: Order;
}
