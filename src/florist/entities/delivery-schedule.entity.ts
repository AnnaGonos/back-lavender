import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { DeliveryTimeSlot } from "./delivery-time-slot.entity";
import {DayOfWeek} from "./day-of-week.enum";

@Entity()
export class DeliverySchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: true })
    specificDate?: string;

    @Column({type: 'enum', enum: DayOfWeek, nullable: true,})
    dayOfWeek?: DayOfWeek;

    @ManyToOne(() => DeliveryTimeSlot, (timeSlot) => timeSlot.schedules)
    timeSlot: DeliveryTimeSlot;

    @Column({ default: true })
    isActive: boolean;
}