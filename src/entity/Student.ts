import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm"; import {Project} from "./Project"; 
import { Classes } from './Classes';

@Entity() 
export class Student {  
   
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