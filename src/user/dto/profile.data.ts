import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ProfileData {
  @Field(() => String)
  pageTitle: string;

  @Field(() => User)
  user: User;
}
