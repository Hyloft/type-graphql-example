import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import bcrypt from 'bcryptjs'
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth) // @Authorized would work to but I created it myself.
    @Query(() => String)
    async hello() {
        return 'hello world'
    }

    @Mutation(() => User)
    async register(
        @Arg("data") {email,firstName,lastName,password} : RegisterInput
    ):Promise<User> {
        const hashedPassword = await bcrypt.hash(password,12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        }).save()

        await sendEmail(email, createConfirmationUrl(user.id))

        return user
    }
}