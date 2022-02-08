import { Field, ID, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity{

    @Field(()=>ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Column() // registered to db but not showing
    password: string;

    @Field() // not registered to db but showing
    name:string;

    @Field()
    @Column("text",{unique:true})
    email: string;

}