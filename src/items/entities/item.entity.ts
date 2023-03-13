import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // @Column()
  // @Field(() => Number)
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  category?: string;

  @ManyToOne(() => User, (user) => user.items,{nullable: false, lazy: true })
  @Index('index')
  @Field(() => User)
  user: User;
}
