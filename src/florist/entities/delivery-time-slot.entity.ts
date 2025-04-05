import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DeliverySchedule } from "./delivery-schedule.entity";

@Entity()
export class DeliveryTimeSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => DeliverySchedule, (schedule) => schedule.timeSlot)
    schedules: DeliverySchedule[];
}
