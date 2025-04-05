import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DeliveryType } from '../entities/delivery-type.enum';
import { PaymentMethod } from '../entities/payment-method.enum';

export enum BonusAction {
    ACCUMULATE = 'accumulate',
    SPEND = 'spend',
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    recipientName: string;

    @IsString()
    @IsNotEmpty()
    recipientPhone: string;

    @IsOptional()
    @IsString()
    comments?: string;

    @IsEnum(DeliveryType)
    deliveryType: DeliveryType;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    house?: string;

    @IsOptional()
    @IsString()
    apartment?: string;

    @IsString()
    @IsNotEmpty()
    deliveryDate: string;

    @IsString()
    @IsNotEmpty()
    deliveryInterval: string;

    @IsOptional()
    @IsString()
    courierComment?: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    finalTotal: number;

    @IsEnum(BonusAction)
    bonusAction: BonusAction;

    userId: number;
    bonusPointsUsed?: number;
    items: { product: { id: number }; quantity: number }[];
}