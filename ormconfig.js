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
    ],
    "migrations": [
        "src/migrations/**/*.{ts,js}"
    ],
    "cli": {
        "migrationsDir": "src/migrations/new"
    }
 }