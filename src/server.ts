import express from "express";
import bodyParser from "body-parser";

import * as config from "./config";
import User from "./db/user";

import users from "./db/users";
import { request } from "https";

const app = express();

app.use(bodyParser.json());

app.listen(3000, ()=> {
    console.log("server running on port 3000");
})

app.post(config.ENDPOINT_POST_REGISTER, (request, response) => {
    const {name, email, password} = request.body;

    let user = new User(name, email, password);

    users.push(user);

    response.json(users[users.length-1]);
})

app.post(config.ENDPOINT_POST_SIGNIN, (request, response) => {
    const {email, password} = request.body;

    console.log("email", email);
    console.log("password", password);

    if(email === users[0].email && password === users[0].password) {
        response.json("Sign in success");
    }
    else {
        response.status(400).json("Incorrect user/password");
    }
})

app.get(config.ENDPOINT_GET_HOME, (request, response) => {
    // response.send("it's working! server listening");
    response.json(users);
})