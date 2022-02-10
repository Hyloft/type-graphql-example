import { gCall } from '../gCall';
import faker from '@faker-js/faker';
import { User } from '../../entity/User'


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

export const meTest = ()=> describe("Me", () => {
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