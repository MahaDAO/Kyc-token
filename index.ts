import 'dotenv/config'

if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test') {
    require("./dist/index");
} else {
    require("./server/index");
}