import { redis } from '../../redis'
import {v4} from 'uuid'

export const createConfirmationUrl = (userId:number)=>{
    const token = v4()
    redis.set(token,userId,"ex",60*60*24) // one day expiration

    return `http://localhost:4000/user/confirm/${token}`
}