<p align="center"><img width=100% src="media/typ.png"></p>
<h1 align="center">TypeGraphQL API Example</h1>


### Techs that has been used:

**GraphQL:** TypeGraphQL, Apollo

**Databases:** Redis,Postgres

**Testing Library:** Jest

## PARTS:
* Setup
    * [Basic Setup](#basic-setup)
    * [Next Level Setup (For all features)](#next-level-setup)
* [Resolver Basics](#resolver-basics)
* [Sending Query With GraphQL](#query-example-get-in-rest-api)
* [Entities](#entities)
* [Object Type](#what-is-objecttype)
* [Field Complexity](#what-is-field-complexity)
* [Validation](#validations)
* [Input Type](#input-type)
* [Custom Validator](#custom-validator)
* [Resolvers](#resolvers)
* [Register Resolver](#register-resolver)
* [Login resolver](#login-resolver)
* [Authorization](#authorization)
* [Logout](#logout)
* [Confirmation Mail](#confirmation-mail)
* [Forgot Password Mail](#forgot-password-mail)
* [File Upload](#file-upload)
* [Relations (OneToMany)](#relations)
* [Set Relations In Resolvers](#relations-in-resolver)
* [Dependency Injection](#dependency-injection)
* [Entity Resolver](#entity-resolver)
* [Testing Resolvers](#testing-resolvers)

## BASIC SETUP
**First of all if you don't have a up and running postgres and redis server you should install it .**

You can install `Redis` from [here](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) and `Postgres` from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).

After the installation we are ready to install npm packages.

We need to install some packages first:
```bash
npm i --save type-graphql typeorm typescript express pg ts-node-dev reflect-metadata
```
As well as some of their types:
```bash
npm i --save-dev @types/express @types/graphql
```
***
#### TSCONFIG:
We need to set tsconfig file. Here is the template:
```json
{
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],
      "sourceMap": true,
      "outDir": "./dist",
      "moduleResolution": "node",
      "declaration": false,
      "composite": false,
      "removeComments": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "noImplicitThis": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true,
      "allowSyntheticDefaultImports": true,
      "emitDecoratorMetadata": true,
      "esModuleInterop": true,
      "experimentalDecorators": true,
      "skipLibCheck": true,
      "baseUrl": ".",
      "rootDir": "src"
    },
    "exclude": ["node_modules"],
    "include": ["./src/**/*.tsx", "./src/**/*.ts"]
}
```
Not important things. Just some fix settings of typescript.

***
#### ORMCONFIG:
We need to create `ormconfig.js` file for typeorm.

```ts
module.exports={
    "name":"default",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "type-graphql-learning",
    "synchronize":true,
    "logging":true,
    "entities": [
        __dirname+"/src/entity/*.*"
    ]
 }
```
I think that everything is clear with settings.
<br>Now typeorm can make the connection.

Only thing the I think that I have to explain is the  `synchronize` feature.<br>
It means typeorm makes all the migrations for us.
Keeps database and entity model synchron.
<br>It is cool feature for the development but it should be closed in the production.

***
#### CREATING INDEX.TS FILE:

* src
    * index.ts

```ts
import 'reflect-metadata'
import {ApolloServer} from "apollo-server-express"
import Express from "express"
import { buildSchema} from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { GraphQLError } from 'graphql';

const main = async()=>{

  const schema = await buildSchema({
      resolvers: [__dirname + '/modules/*/*.ts'],
  }) 

  const apolloServer = new ApolloServer({
    schema:schema,
    plugins:[ApolloServerPluginLandingPageGraphQLPlayground],
  })

  const app = Express()

  await apolloServer.start()

  apolloServer.applyMiddleware({app});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
}

main()
```
 The `resolvers` will check every .ts file in modules ro find **Resolvers**.

 It is the basic up and running server.
 <br> We still need to add some modifications in the feature. But it will be enaught for now.

 Let's add start command to `package.json` to actually run it.
 ```json
 "scripts":[
    "start": "ts-node-dev --respawn src/index.ts"
]
 ```
 Now `npm start` will work.
<br>
<br>
 

## NEXT LEVEL SETUP
**This setup includes everything we needed for now and future.**
<br><br>
**First of all;** if you don't have a up and running **postgres** and **redis** server you should install it .

You can install `Redis` from [here](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) and `Postgres` from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).

After the installation we are ready to install npm packages.

We can install all of packages that we need with this command:
```bash
npm i --save type-graphql typeorm typescript express ts-node-dev cors bcryptjs class-validator connect-redis dotenv express-session fs graphql-query-complexity graphql-upload ioredis nodemailer nodemon pg redis reflect-metadata type-graphql-dataloader typedi typeorm-typedi-extensions uuid
```
As well as some of their types:
```bash
npm i --save-dev jest ts-jest @types/uuid @types/nodemailer @types/express @types/graphql @types/jest @types/graphql-upload @types/faker @types/bcryptjs @faker-js/faker @types/connect-redis @types/cors @types/express-session @types/node
```
***
[tsconfig](#tsconfig) and [ormconfig](#ormconfig) explained before.
***
#### CREATING INDEX.TS FILE:

* **src**
    * *index.ts*
    * *redis.ts*
    * **types**
        * *MyContext.ts*
        * *Upload.ts*
    * **test**
        * *setup.ts*
        * **modules**
            * *gCall.ts*
            * *testConn.ts*


**index.ts** (explained one by one)<br>
*it will look like this when it's done.*
```ts
import 'reflect-metadata'
import {ApolloServer} from "apollo-server-express"
import Express from "express"
import { buildSchema} from "type-graphql";
import { createConnection, useContainer } from 'typeorm';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import createComplexityRule, { simpleEstimator,fieldExtensionsEstimator } from 'graphql-query-complexity';
import { GraphQLError } from 'graphql';

import {Container} from 'typeorm-typedi-extensions';


declare module 'express-session' {
  export interface SessionData {
      userId: any;
  }
}

const RedisStore = connectRedis(session)

const ruleComplexity = createComplexityRule({
  maximumComplexity: 500,

  variables: {},

  onComplete: (complexity: number) => {console.log('Determined query complexity: ', complexity)},

  createError: (max: number, actual: number) => {
    return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
  },

  estimators: [
    fieldExtensionsEstimator(),

    simpleEstimator({
      defaultComplexity: 1
    })
  ]
});



const main = async()=>{
  await createConnection()

  useContainer(Container)
  const schema = await buildSchema({
      resolvers: [__dirname + '/modules/*/*.ts'],
      container:Container,
      authChecker: ({ context :{req}}) => { //you can add @Authorized() to query or mutation
        // if(req.session.userId){
        //   return true
        // }
        // return false;
        return !!req.session.userId
      }
      
  }) 

  const apolloServer = new ApolloServer({
    schema,
    context: ({req,res}:any)=> ({req,res}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground,],
    validationRules:[
      ruleComplexity
    ]
  })

  const app = Express()
  app.use(cors({credentials:true,origin:"http://localhost:4000"}))

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: process.env.SESSION_SECRET || "asfşlkasşlfaosf3",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };
  app.use(session(sessionOption));

  app.use(graphqlUploadExpress());

  await apolloServer.start()

  apolloServer.applyMiddleware({app});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
}

main()
```
First:
```ts
declare module 'express-session' {
  export interface SessionData {
      userId: any;
  }
}
``` 
helps to reach `userId` in **session** (fixes session error).
<br>
<br>

**main()**
<br>let's look inside main function

```ts
import { createConnection} from 'typeorm';
//imported before
await createConnection()
```
we need to wait typeorm for database connection

```ts
import {ApolloServer} from "apollo-server-express"
import { buildSchema} from "type-graphql"
import { useContainer } from 'typeorm';
import {Container} from 'typeorm-typedi-extensions';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

//imported before

//in the main() function:
  useContainer(Container)
  const schema = await buildSchema({
      resolvers: [__dirname + '/modules/*/*.ts'],
      container:Container,
      authChecker: ({ context :{req}}) => {
        return !!req.session.userId
      }
      
  }) 

  const apolloServer = new ApolloServer({
    schema,
    context: ({req,res}:any)=> ({req,res}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground,],
    validationRules:[
      ruleComplexity
    ]
  })
```
`useContainer` and `Container` helps [dependency injection](#dependency-injection) which will explain later.<br><br>
**`buildSchema`** function for *graphql*:
* `resolvers` feature helps to search every Resolver in modules folder.
* `container` like I said it helps DI
* `authChecker` checks session.userId in request. Rejects if userId not exist.

**`apolloServer`:**
* `schema` apollo needs graphql schema
* `context` to get requests and send responses.
* `plugins` it can be default. I just like old playground. also it sometimes fixes the playground's cookie error
* `validationRules` there is something called as *ruleComplexity*.

**ruleComplexity:**
```ts
import createComplexityRule, { simpleEstimator,fieldExtensionsEstimator } from 'graphql-query-complexity';
//imported before

const ruleComplexity = createComplexityRule({
    
  maximumComplexity: 50,

  variables: {},

  onComplete: (complexity: number) => {console.log('Determined query complexity: ', complexity)},

  createError: (max: number, actual: number) => {
    return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
  },

  estimators: [
    fieldExtensionsEstimator(),

    simpleEstimator({
      defaultComplexity: 1
    })
  ]
});
```
it basically limits the request's complexity. will explain in [#complexity](#complexity)
<br>
<br><br>

```ts
import Express from "express"
import connectRedis from 'connect-redis';
import { redis } from './redis'; //I will create it after index.ts
import cors from 'cors';
import session from 'express-session';
//imported before

  const app = Express()
  app.use(cors({credentials:true,origin:"http://localhost:4000"}))

  const RedisStore = connectRedis(session)
  
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: process.env.SESSION_SECRET || "asfşlkasşlfaosf3",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };
  app.use(session(sessionOption));
```
`app` is basic express app with cors. Credentials for cookies<br> 
`ResdisStore` with `express-session` in it. Helps to use redis for session.<br>
`sessionOption` for expres-session
* `store` uses `RedisStore` which created with *express-session* before  
* `qid` the name of cookie<br><br>

```ts
import { graphqlUploadExpress } from 'graphql-upload';
//imported before

  app.use(graphqlUploadExpress());
```
`graphqlUploadExpress` helps upload files to server.<br><br>

```ts
  await apolloServer.start()

  apolloServer.applyMiddleware({app});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
```
`apolloServer` is starting with `app` middleware.<br>
Then `app.listen` command to start the server.

**redis.ts**
```ts
import Redis from 'ioredis';

export const redis = new Redis();
```

#### ABOUT TYPES:
We need Upload and Context type.

**MyContext.ts**
```ts
import { Request,Response } from "express"


export interface MyContext{
    req: Request;
    res: Response;
}
```
we need this for getting **context types** while using **req** or **res** method in **resolvers**.

**Upload.ts**
```ts
import { Stream } from "stream";

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
```
and this one will be handy when uploading files

## RESOLVER BASICS
Resolvers helps us to create api with graphql

Here is example 'hello world' example:

#### First of all we need to define Resolver.

```ts
@Resolver()
export class exampleResolver{
    //Queries and Mutations here
    //...
}
```

#### Query example ('GET' in REST API)
```ts
//in resolver
@Query(() => String)
async hello():Promise<String> {
    return 'hello world'
}
```
So what it does ?
<p align="center"><img width=100% src="media/queryexplain.png"></p><br>

How to send query and get *'hello world'* response?
<p align="center"><img width=100% src="media/queryhw.png"></p>

Go to [`http://localhost:4000/graphql`](http://localhost:4000/graphql).<br>
Then write a hello **query**:
```graphql
query
{
  hello
}
```

Just send it. Then you'll get response of hello world.

#### MUTATION EXAMPLE ('PUT','POST','GET' in REST API)

```ts
//in resolver
@Mutation(() => String,{nullable:true})
async fullname(
    @Arg('name') name:string,
    @Arg('surname') surname:string,
    @Arg('age') age:number
):Promise<String | null> {
    if(age<18){
        return null
    }
    return `${name} ${surname}`
}
```
it is post kinda request example.
We are passing name,surname and age. Then if the person older than 17, it returns fullname.

**Mutation**:
```graphql
mutation{
    fullname(name:"jhon",surname:"doe",age:18)
}
```
it will return

```json
{
  "data": {
    "fullname": "jhon doe"
  }
}
```
because age older than 17. Otherwise we would get null.

#### Mutation with custom interface/type
```ts
interface Person {
    name:string
    surname:string
    age:number
    fullname:string
}

//in resolver
    @Mutation(() => Person,{nullable:true})
    async getPerson(
        @Arg('name') name:string,
        @Arg('surname') surname:string,
        @Arg('age') age:number
    ):Promise<Person | null> {
        if(age<18){return null}
        let human: Person
        human = {
            name:name,
            surname:surname,
            age:age,
            fullname: `${name} ${surname}`
        }
        return human
    }
```

this time it will return `Person` object which has different fields.
In graphql, we can define which parts we want and which parts we don't.<br>
According to this, I want just *fullname* and *age* as response.

```graphql
mutation
{
    getPerson(name:"foo",surname:"bar",age:23)
    {
        fullname,
        age
    }
}
```
! If it will return an object, I have to define which fields I want.<br>
It will return **response** like this: 

```json
{
  "data": {
    "getPerson":{
        "fullname":"foo bar",
        "age":23
    }
  }
}
```

That was the basics of resolvers.

## ENTITIES
Entities are **database models** and **object types**.<br>
Basically Entity means orm system.

We can look into user entity which used in project.<br>
**User entity**:

```ts
import { Field, ID, ObjectType, Root } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
@ObjectType()
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

    @Field({complexity:4}) // not registered to db but showing
    name(@Root() parent:User):string{
        return `${parent.firstName} ${parent.lastName}`
    }

    @Field()
    @Column("text",{unique:true})
    email: string;

    @Column('bool',{default:false})
    confirmed:boolean;
}
```
`User` extends from `BaseEntity` so we can call it in code and access db models.
#### What is ObjectType()
```ts
@Entity()
@ObjectType()
export class User extends BaseEntity{
```
This tag means `User` is not just a db model. We will use it for responses.<br>
#### Fields and Columns
`Field()` is extention just for `ObjectType`. It don't register field to the database. Only show up on response.<br>
`Column()` is extention just for `db`. It will be unaccessable for api responses.

#### What is Field Complexity
```ts
    @Field({complexity:4}) // not registered to db but showing
    name(@Root() parent:User):string{
        return `${parent.firstName} ${parent.lastName}`
    }
```
You can see the name field has complexity.
If we added a complexity rule to server, name field will count 4 as complexity point (normally each field counts one).

### Validations
Here is example **password** entity which used in project:
```ts
import { Length } from "class-validator";

@InputType()
export class PasswordInput {

    @Field()
    @Length(4,20)
    password:string
}
```
Validations comes from `class-validator` package. It has a lot of cool features.<br>
Also did you realize that this class is InputType? So what is it?
### Input Type
Lets look into *RegisterInput.ts* which used in project:

```ts
import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";
import { PasswordInput } from '../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordInput{
    @Field()
    @Length(2,255,{message:"must be around 2 and 255 characters"})
    firstName:string

    @Field()
    @Length(2,255)
    lastName:string

    @Field()
    @IsEmail()
    @isEmailAlreadyExist({message:"email already in use"})
    email:string
}
```
`InputType()` is **just uses for mutation's input types**.
Request's expected values can be define with this.

also RefisterInput extends from PasswordInput so it has password field.

`isEmail()` and `Length()` are ready validators.<br>
`isEmailAlreadyExist` is created one.<br>
So how it is created?

### Custom Validator
we can look at isEmailAlreadyExist.ts file which used in project:
```ts
import { User } from '../../../entity/User';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
  
@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
validate(email: string) {
    return User.findOne({where:{email}}).then(user => {
    if (user) return false;
    return true;
    });
}
}

export function isEmailAlreadyExist(validationOptions?: ValidationOptions) {
return function (object: Object, propertyName: string) {
    registerDecorator({
    target: object.constructor,
    propertyName: propertyName,
    options: validationOptions,
    constraints: [],
    validator: isEmailAlreadyExistConstraint,
    });
};
}
```

It is like a template. Only field we have to imagine is validate function:
```ts
validate(email: string) {
    return User.findOne({where:{email}}).then(user => {
    if (user) return false;
    return true;
    });
}
```
it wants an email as a string , checks and returns.<br>

That's how custom validators can be created.