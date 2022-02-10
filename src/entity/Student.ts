import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'; import {Project} from "./Project"; 
import { Field, ID, ObjectType } from "type-graphql";
import { TypeormLoader } from 'type-graphql-dataloader';

@ObjectType()
@Entity() 
export class Student extends BaseEntity{  
   @Field(() => ID)
   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Field()
   @Column() 
   name: string; 
   
   @OneToMany(()=>Project,project=>project.student)
   @Field(() => [Project],{nullable:true})
   @TypeormLoader()
   projects: Project[]

}