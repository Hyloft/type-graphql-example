import { Student } from './../../entity/Student';
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Project } from '../../entity/Project';
import { InjectRepository } from "typeorm-typedi-extensions";
import { ProjectRepo } from './repo/ProjectRepo';

@Resolver(() => Project)
export class ProjectResolver {
  @InjectRepository(ProjectRepo)
  private readonly projectRepo: ProjectRepo; 

  @FieldResolver(() => Student, { nullable: true })
  async student(@Root() project: Project) {
    const student = await Student.findOne({id:project.studentId});
    return student;
  }

  @Query(() => Project, { nullable: true })
  async project(@Arg("projectId") projectId: number) {
    return this.projectRepo.getOne(projectId)
  }

}