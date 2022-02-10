import { Connection } from 'typeorm';
import { testConn } from './testConn';
import { gCall } from './gCall';
import faker from '@faker-js/faker';
import { User } from '../entity/User'
import { redis } from '../redis';
import { Student } from '../entity/Student';
import { Project } from '../entity/Project';

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

const createStudentMutation = (name:string):string=> `
mutation{createStudent(name:"${name}")
  {
    id
    name
	}
}
`;

const createProjectMutation = (name:string,studentId:number):string=> `
mutation{
  createProject(
    name:"${name}",
    studentId:${studentId}
  ){
    id
    name
    studentId
    student{id}
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

describe("SchoolResolver",()=>{

  it('createStudent',async()=>{
    const studentName = faker.name.firstName()

    const response = await gCall({
      source: createStudentMutation(studentName)
    });

    console.log('LOGGİNG RESPONSE')
    console.log(response)

    expect(response).toMatchObject({
      data: {
        createStudent: {
          name:studentName
        }
      }
    });

    const dbStudent = await Student.findOne({name:studentName})
    console.log(dbStudent)
    console.log(response)
    expect(dbStudent).toBeDefined()
    expect(dbStudent?.name).toEqual(studentName)

  })

  it('createProjectWithUser',async()=>{
    const projectName = faker.name.jobTitle()
    const studentName = faker.name.firstName()
    const student = await Student.create({name:studentName}).save()

    console.log()
    const response = await gCall({
      source: createProjectMutation(projectName,student.id),
    });

    expect(response).toMatchObject({
      data: {
        createProject: {
          name:projectName,
          studentId:student.id.toString(),
          student:{
            id:student.id.toString()
          }
        }
      }
    });

    const dbProject = await Project.findOne({name:projectName})
    expect(dbProject).toBeDefined()
    expect(dbProject?.studentId).toEqual(student.id)
  })
})