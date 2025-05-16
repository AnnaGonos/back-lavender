import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Favorite {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => Int)
  id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  @ApiProperty({ description: 'Id', type: Number, example: 101 })
  @Field(() => Product)
  product: Product;

  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Дата добавления товара в избранное',
    type: Date,
    example: '2023-10-01T12:34:56Z',
  })
  @Field()
  addedAt: Date;
}
