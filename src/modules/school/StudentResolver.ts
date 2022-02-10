import { Student } from './../../entity/Student';
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { StudentRepo } from './repo/StudentRepo';

@Resolver(() => Student)
export class StudentResolver {
  @InjectRepository(StudentRepo)
  private readonly studentRepo: StudentRepo; 

  @FieldResolver(() => Student, { nullable: true })
  async projects(@Root() student: Student) {
    return this.studentRepo.getProjects(student.id);
  }

  @Query(() => Student, { nullable: true })
  async studentGet(@Arg("studentId") studentId: number) {
    return this.studentRepo.getOne(studentId)
  }

}