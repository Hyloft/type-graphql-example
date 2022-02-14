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
// import createComplexityRule, { simpleEstimator,fieldExtensionsEstimator } from 'graphql-query-complexity';
// import { GraphQLError } from 'graphql';

import {Container} from 'typeorm-typedi-extensions';


declare module 'express-session' {
  export interface SessionData {
      userId: any;
  }
}

const RedisStore = connectRedis(session)

useContainer(Container)


// const ruleComplexity = createComplexityRule({
//   maximumComplexity: 13,
//   variables: {},
//   onComplete: (complexity: number) => {console.log('Determined query complexity: ', complexity)},
//   createError: (max: number, actual: number) => {
//     return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
//   },
//   estimators: [
//     fieldExtensionsEstimator(),
//     simpleEstimator({
//       defaultComplexity: 1
//     })
//   ]
// });



const main = async()=>{
  await createConnection()

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
      //ruleComplexity
    ]
  })

  const app = Express()
  app.use(cors({origin:'http://localhost:3000',credentials:true}))
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: process.env.SESSION_SECRET || "asfşlkasşlfaosf3",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  app.use(graphqlUploadExpress());
  app.use(session(sessionOption));
  //

  await apolloServer.start()

  apolloServer.applyMiddleware({app,cors:false});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
}

main()