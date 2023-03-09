import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SigninInput {
  
  @Field(()=> String)  
  @IsEmail()
  email: string;


  @Field(()=> String)  
  @MinLength(6)
  password: string;
}
