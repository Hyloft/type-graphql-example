import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email:string,
    ):Promise<Boolean> {
        const user = await User.findOne({where:{email}})

        if(!user){
            return true
        }

        const token = v4()
        await redis.set(forgotPasswordPrefix + token,user.id,"ex",60*60*24) // one day expiration
    
        const url= `http://localhost:4000/user/change-password/${token}`

        await sendEmail(email,url)
        
        return true
    }
}