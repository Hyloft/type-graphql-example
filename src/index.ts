import 'reflect-metadata'
import {ApolloServer} from "apollo-server-express"
import Express from "express"
import { buildSchema} from "type-graphql";
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/Login';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { MeResolver } from './modules/user/Me';
import { ConfirmUserResolver } from './modules/user/ConfirmUser';




declare module 'express-session' {
  interface SessionData {
      userId: any;
  }
}

const RedisStore = connectRedis(session)


const main = async()=>{
  await createConnection()

  const schema = await buildSchema({
      resolvers: [RegisterResolver,LoginResolver,MeResolver,ConfirmUserResolver],
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
    context: ({req}:any)=> ({req}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
  })

  const app = Express()
  app.use(cors({credentials:true,origin:"http://localhost:4000"}))

  //
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
  //

  await apolloServer.start()

  apolloServer.applyMiddleware({app});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
}

main()