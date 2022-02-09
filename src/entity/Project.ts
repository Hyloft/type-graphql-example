import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Student} from "./Student"; 
@Entity() 
export class Project {  

   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Column() 
   projects: string; 
   
   @ManyToOne(() => Student, student => student.projects)
   //@JoinColumn()
   student: Student; 
}