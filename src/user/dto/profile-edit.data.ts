import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ProfileEditData {
  @Field(() => String)
  pageTitle: string;

  @Field(() => User)
  user: User;
}
