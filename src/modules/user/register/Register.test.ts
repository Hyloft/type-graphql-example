import { Connection } from 'typeorm';
import { testConn } from '../../../test/testConn';
import { gCall } from '../../../test/gCall';

let conn : Connection

beforeAll(async ()=>{
    conn = await testConn()
})
afterAll(async ()=>{
    conn.close()
})

const registerMutation = `
mutation Register($data: RegisterInput!){
    register(data: $data){
      id,
      firstName,
      lastName,
      name,
      email
    }
  }
`

describe('Register',()=>{
    it('create user',async ()=>{
        console.log(await gCall({
            source:registerMutation,
            variableValues:{
                data:{
                    firstName:'bob',
                    lastName:'bra',
                    email:'bobra@example.com',
                    password:'123456'
                }
            }
        }))
    })
})