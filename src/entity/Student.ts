import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm"; import {Project} from "./Project"; 
import { Classes } from './Classes';
import { Field, ID } from "type-graphql";

@Entity() 
export class Student {  
   @Field(() => ID)
   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Column() 
   name: string; 
   
   @OneToMany(() => Project, project => project.student)
   //@JoinColumn()
   projects: Project[];  

   @ManyToMany(()=> Classes)
   @JoinTable()
   classes: Classes[]
}