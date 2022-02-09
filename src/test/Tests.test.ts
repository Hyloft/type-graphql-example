import { Connection } from 'typeorm';
import { testConn } from './testConn';
import { gCall } from './gCall';
import faker from '@faker-js/faker';
import { User } from '../entity/User'
import { redis } from '../redis';

let conn: Connection;
beforeAll(async () => {
    if (redis.status == "end") {
        await redis.connect();
      }
    conn = await testConn();
});
afterAll(async () => {
    redis.disconnect();
    await conn.close();
});

const meQuery = `
 {
  me {
    id
    firstName
    lastName
    email
  }
}
`;


const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy()
    expect(dbUser!.email).toBe(user.email)
    expect(dbUser!.password == user.password).toBeFalsy()
    console.log(dbUser)
    console.log(response)
  });
  
  
});

describe("Me", () => {
    it("get user", async()=>{
      const user = await User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }).save();
  
      const response = await gCall({
        source: meQuery,
        userId:user.id
      });
      console.log("GET USER OUTPUT : /__/_/")
      console.log(user)
      console.log(response)
  
      expect(response).toMatchObject({
        data: {
          me:{
            id: `${user.id}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
        }
      });
    })
  
    it("return user", async () => {
      const response = await gCall({
        source: meQuery
      });
  
      expect(response).toMatchObject({
        data: {
          me: null
        }
      });
    });
  
  });