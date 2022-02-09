import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"; 

@Entity() 
export class Classes { 

   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Column() 
   name: string; 
}