import { EntityRepository, Repository } from "typeorm";
import { Project } from '../../../entity/Project';

@EntityRepository(Project)
export class ProjectRepo extends Repository<Project>{

  async getAll() {
    return await this.find()
  }

  async getOne(id: number) {
    console.log('getting one')
    return await this.findOne({id:id})
  }
}