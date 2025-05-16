import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => Int, { complexity: 1 })
  id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @ApiProperty({
    description: 'The user who left the review',
    type: () => User,
    example: 1,
  })
  @Field(() => User, { complexity: 5 })
  user: User;

  @Column({ type: 'int' })
  @Min(1)
  @Max(5)
  @ApiProperty({ description: 'Rating product', type: Number, example: 5 })
  @Field(() => Int, { complexity: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Description review',
    type: String,
    required: false,
    example: 'Отличный букет! Очень довольна покупкой. Советую! :)',
  })
  @Field({ nullable: true, complexity: 2 })
  description?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'Review creation date',
    type: Date,
    example: '2023-10-01T12:34:56Z',
  })
  @Field({ complexity: 1 })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Response to the review',
    type: String,
    required: false,
    example:
      'Спасибо за ваш отзыв! Мы рады, что вы довольны товаром. Спасибо за доверие',
  })
  @Field({ nullable: true, complexity: 2 })
  response?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'URL of the review image from the user',
    type: String,
    required: false,
    example: '/uploads/1743381076506-369252395.jpg',
  })
  @Field({ nullable: true, complexity: 3 })
  image?: string;
}
