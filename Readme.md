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
 

