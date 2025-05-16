import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import {Field, Int, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Category {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: "Id", type: Number, example: 1 })
    @Field(() => Int)
    id: number;

    @Column()
    @IsString()
    @ApiProperty({ description: "Name", type: String, example: "Монобукеты" })
    @Field()
    name: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Description", type: String,
        example: "Букеты, в которых используется один вид цветов.", required: false })
    @Field({ nullable: true })
    description?: string;

    @OneToMany(() => Product, product => product.category)
    @Field(() => Product)
    products: Product[];
}
