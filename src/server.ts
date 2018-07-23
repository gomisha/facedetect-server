import express from "express";
import bodyParser from "body-parser";

import * as config from "./config";

const app = express();

app.use(bodyParser.json());

app.listen(3000, ()=> {
    console.log("hello world! yes!!!! server running on port 3000");
})

app.get(config.ENDPOINT_HOME, (request, response) => {
    response.send("it's working! server listening");
})