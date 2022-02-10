import { gCall } from '../modules/gCall';
import faker from '@faker-js/faker';
import { Student } from '../../entity/Student';
import { Project } from '../../entity/Project';

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


export const schoolResolverTest = ()=> describe("SchoolResolver",()=>{

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