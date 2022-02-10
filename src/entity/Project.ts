import { Field, ID, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import {Student} from "./Student"; 

@ObjectType() 
@Entity()
export class Project extends BaseEntity {  
   @Field(() => ID)
   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Field()
   @Column() 
   name: string; 

   @Column()
   @Field(()=>ID)
   studentId:number
   
   @ManyToOne(()=>Student,student=>student.projects,{onDelete:"SET NULL"})
   @Field(()=>Student)
   @TypeormLoader()
   student: Student
}