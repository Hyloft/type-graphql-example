import { Field, ID } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"; 

@Entity() 
export class Classes { 
   @Field(() => ID)
   @PrimaryGeneratedColumn() 
   id: number; 
   
   @Column() 
   name: string; 
}