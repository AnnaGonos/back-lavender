import {forwardRef, Module} from '@nestjs/common';
import { FloristController } from './florist.controller';
import { FloristService } from './florist.service';
import {DeliveryTimeSlot} from "./entities/delivery-time-slot.entity";
import {DeliverySchedule} from "./entities/delivery-schedule.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderModule} from "../order/order.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([DeliverySchedule, DeliveryTimeSlot]),
        forwardRef(() => OrderModule),
    ],
    controllers: [FloristController],
    providers: [FloristService],
})
export class FloristModule {}