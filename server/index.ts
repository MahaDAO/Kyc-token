import express from "express";
import logger from "morgan";
import bodyParser from 'body-parser'

import routes from "./routes";

const app = express();
const cors = require("cors");

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.use(routes);

const { PORT = 3001 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
