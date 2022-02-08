import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from 'bcryptjs'
import { User } from '../../entity/User';

@Resolver()
export class RegisterResolver {
    @Query(() => String)
    async hello() {
        return 'hello world'
    }

    @Mutation(() => String) //cannot return string
    async register(
        @Arg('firstName') firstName:string,
        @Arg('firstName') lastName:string,
        @Arg('firstName') password:string,
        @Arg('firstName') email:string
    ):Promise<User> {
        const hashedPassword = await bcrypt.hash(password,12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        }).save()

        return user
    }
}