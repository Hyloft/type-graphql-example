import { redis } from '../../redis'
import {v4} from 'uuid'
import { confirmationPrefix } from '../constants/redisPrefixes';

export const createConfirmationUrl = (userId:number)=>{
    const token = v4()
    redis.set(confirmationPrefix + token,userId,"ex",60*60*24) // one day expiration

    return `http://localhost:3000/user/confirm/${token}`
}