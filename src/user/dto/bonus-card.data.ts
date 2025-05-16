import { ObjectType, Field, Float } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class BonusCardData {
  @Field(() => String)
  pageTitle: string;

  @Field(() => User)
  user: User;

  @Field(() => String)
  loyaltyLevel: string;

  @Field(() => Float)
  bonusPercentage: number;
}
