import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import * as config from "./config";
import User from "./db/user";

import users from "./db/users";
import Utility from "./utility";

const app = express();

app.use(bodyParser.json());

// for error: No 'Access-Control-Allow-Origin' header is present on the requested resource.
app.use(cors());

app.listen(3000, ()=> {
    console.log("server running on port 3000");
})

// ***************** GET REQUESTS **********************************

app.get(config.ENDPOINT_GET_HOME, (request, response) => {
    response.json("it's working! server listening");
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
    const hash = Utility.hashPassword(password);

    let user = new User(name, email, hash);
    users.push(user);
    response.json(users[users.length-1]);
})

app.post(config.ENDPOINT_POST_SIGNIN, (request, response) => {
    const {email, password} = request.body;

    let filteredUsers = users.filter(user => (user.email === email))

    if(filteredUsers.length < 1) {

        return response.status(400).json("Incorrect user/password");
    }

    // return logged in user so client can display user profile / info after login
    if(email === filteredUsers[0].email && Utility.verifyPassword(password, filteredUsers[0].password)) {
        return response.json(filteredUsers[0]);
    } else {
        return response.status(400).json("Incorrect user/password");
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
        response.json(filteredUsers[0]);
    }
})