import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { Order } from '../../order/entities/order.entity';

@ObjectType()
export class OrderDetailsData {
  @Field(() => String)
  pageTitle: string;

  @Field(() => User)
  user: User;

  @Field(() => Order)
  order: Order;
}
