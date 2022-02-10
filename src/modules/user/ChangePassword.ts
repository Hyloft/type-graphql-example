import { Arg,Ctx, Mutation, Resolver } from "type-graphql";
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import bcrypt from 'bcryptjs';
import { MyContext } from "src/types/MyContext";

declare module 'express-session' {
    export interface SessionData {
        userId: any;
    }
}

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User,{nullable:true})
    async changePassword(
        @Arg('data') {token,password}:ChangePasswordInput,
        @Ctx() ctx : MyContext
    ):Promise<User|null> {
        const userId = await redis.get(forgotPasswordPrefix+token)

        if(!userId){
            return null
        }

        const user = await User.findOne({where:{id:userId}})

        if(!user){
            return null
        }

        await redis.del(forgotPasswordPrefix + token)

        user.password = await bcrypt.hash(password,12)
        await user.save()//also user.update will work.

        ctx.req.session!.userId = user.id

        return user
    }
}