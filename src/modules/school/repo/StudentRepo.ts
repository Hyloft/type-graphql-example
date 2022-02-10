import { EntityRepository, Repository } from "typeorm";
import { Student } from '../../../entity/Student';
import { Project } from '../../../entity/Project';

@EntityRepository(Student)
export class StudentRepo extends Repository<Student>{

  async getAll() {
    return await this.find()
  }

  async getOne(id: number) {
    return await this.findOne({id:id})
  }

  async getProjects(id:number):Promise<Project[]>{
      return await Project.find({studentId:id})
  }
}