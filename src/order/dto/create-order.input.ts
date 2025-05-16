import { IsEnum, IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/payment-method.enum';
import { DeliveryType } from '../entities/delivery-type.enum';

@InputType()
export class CreateOrderInput {
    @Field(() => Int)
    @IsNotEmpty()
    userId: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    recipientName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    recipientPhone?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    bonusPointsUsed?: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    deliveryInterval?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    deliveryAddress?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    deliveryDate?: string;

    @Field(() => PaymentMethod)
    @IsOptional()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @Field(() => DeliveryType)
    @IsOptional()
    @IsEnum(DeliveryType)
    deliveryType: DeliveryType;

    @Field(() => Float)
    @IsNotEmpty()
    finalTotal: number;
}
