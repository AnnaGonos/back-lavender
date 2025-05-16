import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Cart } from '../../cart/entities/сart.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => Int)
  id: number;

  @Column()
  @ApiProperty({ description: 'Название товара', type: String, example: 'Букет №43',})
  @Field()
  name: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  @ApiProperty({description: 'Категория, к которой принадлежит товар',
    type: () => Category, example: { id: 9, name: 'Монобукеты' },})
  @Field(() => Category)
  category: Category;

  @Column({ nullable: true })
  @ApiProperty({description: 'Состав товара', type: String, required: false, example: 'хризантемы, ромашки, лилии',})
  @Field({ nullable: true })
  composition?: string;

  @Column({ nullable: true })
  @ApiProperty({description: 'Описание товара', type: String, required: false, example: 'Необычный букет хризантем',})
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @ApiProperty({description: 'URL изображения товара', type: String, required: false,
    example: '/uploads/1743381076506-369252395.jpg',})
  @Field({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({description: 'Описание изображения товара', type: String, required: false,
    example: 'Необычный букет хризантем',})
  @Field({ nullable: true })
  imageDescription?: string;

  @Column()
  @ApiProperty({ description: 'Цена товара', type: Number, example: 999 })
  @Field()
  price: number;

  @Column({ nullable: true })
  @ApiProperty({description: 'Новая скидочная цена товара', type: Number, required: false, example: 998,})
  @Field({ nullable: true })
  discount?: number;

  @Column()
  @ApiProperty({description: 'Количество товара в магазине', type: Number, example: 3,})
  @Field()
  quantityInStock: number;

  @OneToMany(() => Cart, (cart) => cart.product)
  @Field(() => [Cart], { nullable: true })
  cartItems: Cart[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  @Field(() => [Favorite], { nullable: true })
  favorites: Favorite[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({description: 'Дата создания товара', type: Date, example: '2023-10-01T12:34:56Z',})
  @Field()
  createdAt: Date;
}
