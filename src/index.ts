import 'reflect-metadata'
import {ApolloServer} from "apollo-server-express"
import * as Express from "express"
import { buildSchema} from "type-graphql";
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';


//it is an example
// @Resolver()
// class HelloResolver {
//   @Query(() => String,{name:"helloWorllld",nullable:true})
//   async hello() {
//     return 'hello world'
//   }
// }


const main = async()=>{
  await createConnection()

  const schema = await buildSchema({
      resolvers: [RegisterResolver],
  }) 

  const apolloServer = new ApolloServer({schema})

  const app = Express()

  await apolloServer.start()

  apolloServer.applyMiddleware({app});

  app.listen(4000,()=>{
      console.log('server started on http://localhost:4000')
  })
}

main()