import { Arg, Mutation, Resolver, Int, Query, } from 'type-graphql';
import { Student } from '../../entity/Student';
import { Project } from '../../entity/Project';
import { StudentRepo } from './repo/StudentRepo';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Resolver()
export class SchoolResolver {
  
  @InjectRepository(StudentRepo)
  private readonly studentRepo: StudentRepo; 
  
  @Mutation(()=>Project)
  async createProject(
    @Arg('name') name:string,
    @Arg('studentId') studentId:number
  ):Promise<Project> {
    let student = await Student.findOne({id:studentId})
    return await Project.create({name,student}).save()
  }

  @Mutation(()=>Student || null)
  async createStudent(
    @Arg('name') name:string
  ){
    return await Student.create({name}).save() 
  }

  @Mutation(()=> Boolean)
  async appendStudentToProject(
    @Arg('studentId',()=> Int) studentId : number,
    @Arg('projectId',()=> Int) projectId : number
  ):Promise<Boolean>{
    let proj = await Project.findOne({id:projectId})
    let student = await Student.findOne({id:studentId})

    if(student == null || proj == null) return false

    proj.student = student

    await proj.save()
    return true
  }

  @Mutation(()=>Boolean)
  async deleteProject(
    @Arg('projectId',()=>Int) projectId: number 
  ){
    await Project.delete({id:projectId})
    return true
  }

  @Query(()=>[Student])
  async students(){
    let students = this.studentRepo.getAll()
    return students
  }

  
  @Query(()=>[Project])
  async projects(){
    let projects = await Project.find()
    return projects
  }
  
}