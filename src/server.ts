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

// ***************** GET REQUESTS **********************************

app.get(config.ENDPOINT_GET_HOME, (request, response) => {
    response.send("it's working! server listening");
})

app.get(config.ENDPOINT_GET_PROFILE, (request, response) => {
    const id = request.params.id;
    const foundUsers = users.filter(user => (user.id === id))

    if(foundUsers.length < 1 ) response.status(400).json("No users found with ID: " + id);
    else                       response.json(foundUsers[0]);
})

app.get(config.ENDPOINT_GET_USERS, (request, response) => {
    response.json(users);
})

// ***************** POST REQUESTS **********************************

app.post(config.ENDPOINT_POST_REGISTER, (request, response) => {
    const {name, email, password} = request.body;

    let user = new User(name, email, password);

    users.push(user);

    response.json(users[users.length-1]);
})

app.post(config.ENDPOINT_POST_SIGNIN, (request, response) => {
    const {email, password} = request.body;

    if(email === users[0].email && password === users[0].password) {
        response.json("Sign in success");
    } else {
        response.status(400).json("Incorrect user/password");
    }
})


// ***************** PUT REQUESTS **********************************
app.put(config.ENDPOINT_PUT_IMAGE, (request, response) => {
    const { id } = request.body;

    let filteredUsers = users.filter(user => {
        if(user.id === id) {
            user.entries++;
            return true;
        }
    })
    if(filteredUsers.length < 1) {
        response.status(400).json("Invalid user ID: " + id);
    } else {
        response.json(filteredUsers);
    }
})


