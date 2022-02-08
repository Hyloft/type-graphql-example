import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";
import { PasswordInput } from '../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordInput{
    @Field()
    @Length(2,255,{message:"must be around 2 and 255 characters"})
    firstName:string

    @Field()
    @Length(2,255)
    lastName:string

    @Field()
    @IsEmail()
    @isEmailAlreadyExist({message:"email already in use"})
    email:string

}