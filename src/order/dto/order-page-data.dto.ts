import { ObjectType, Field } from '@nestjs/graphql';
import {User} from "../../user/entities/user.entity";

@ObjectType()
export class OrderPageData {
    @Field(() => String)
    pageTitle: string;

    @Field(() => User)
    user: User;

    @Field(() => Number)
    originalSum: number;

    @Field(() => Number)
    discountAmount: number;

    @Field(() => Number)
    availableBonus: number;
}
