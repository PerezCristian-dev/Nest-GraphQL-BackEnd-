import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Todo message response' })
export class RemoveType {
  @Field(() => Boolean, { nullable: true })
  message: boolean;
}
