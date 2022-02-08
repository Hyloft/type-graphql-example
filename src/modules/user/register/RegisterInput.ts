import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
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

    @Field()
    password:string
}