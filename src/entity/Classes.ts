import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'; 

@Entity()
@ObjectType()
export class Classes extends BaseEntity{ 
   @Field(() => ID)
   @PrimaryGeneratedColumn() 
   id: number; 

   @Field()
   @Column()
   isOpen:boolean;
   
   @Field()
   @Column() 
   name: string; 
}