<h1 align="center">TypeGraphQL API Example</h1>
<p align="center"><img width=100% src="media/typ.png"></p>


### Techs that has been used:

**GraphQL:** TypeGraphQL, Apollo

**Databases:** Redis,Postgres

**Testing Library:** Jest

## PARTS:
* Setup
    * [Basic Setup](#basic-setup)
    * [Next Level Setup (For all features)](#next-level-setup)
* [Resolver Basics](#resolver-basics)
* [Sending Query With GraphQL](#sending-queries)
* [Entities](#entities)
* [Object Type](#object-type)
* [Validation](#validation)
* [Resolvers](#resolvers)
* [Input Type](#input-type)
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
    * **test**
        * *setup.ts*
        * **modules**
            * *gCall.ts*
            * *testConn.ts*


**index.ts** (explained one by one)
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
```ts
const RedisStore = connectRedis(session)
```
for the redis connection with express-session inside. It will help later.

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

//in the main()
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

```ts
import Express from "express"
import connectRedis from 'connect-redis';
import { redis } from './redis'; //I will create it after index.ts
import cors from 'cors';
import session from 'express-session';
//imported before

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
```