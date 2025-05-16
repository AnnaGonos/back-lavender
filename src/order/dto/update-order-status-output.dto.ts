import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class UpdateOrderStatusOutput {
    @Field(() => String)
    redirectUrl: string;
}
