import { Connection } from 'typeorm';
import { testConn } from './modules/testConn';
import { redis } from '../redis';
import { registerTest } from './userTests/RegisterTest';
import { meTest } from './userTests/MeTest';
import { schoolResolverTest } from './schoolTests/SchoolResolverTest';

let conn: Connection;
beforeAll(async () => {
    if (redis.status == "end") {
        await redis.connect();
      }
    conn = await testConn();
});
afterAll(async () => {
    redis.disconnect();
    await conn.close();
});

registerTest()

meTest()

schoolResolverTest()