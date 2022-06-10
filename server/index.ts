import express from "express";
import logger from "morgan";
import bodyParser from 'body-parser'

import routes from "./routes";
import { open } from "./database/index"

const app = express();
const cors = require("cors");

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(routes);

// Starting database connection
open()

const { PORT = 3001 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
