// 3rd party libs
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import * as config from "./config";
import User from "./db/user";

import users_to_delete from "./db/users";
import Utility from "./utility";

import DB from "./db/index";

const app = express();

app.use(bodyParser.json());

let db = new DB();

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

    db.getUser(id).then(user => {
        response.json(user);
    }).catch(error => {
        response.status(400).json("error finding user with id " + id);
    })
})

app.get(config.ENDPOINT_GET_USERS, (request, response) => {
    db.getUsers().then(users => {
        response.json(users);
    }).catch(error => response.status(400).json(error))
})

// ***************** POST REQUESTS **********************************

app.post(config.ENDPOINT_POST_REGISTER, (request, response) => {
    const {name, email, password} = request.body;
    const hash = Utility.hashPassword(password);

    let user = new User();
    user.name = name;
    user.email = email;
    
    db.addUser(user).then(user => {
        response.json(user);    
    }).catch(error => {
        response.status(400).json("error registering user");
    });
})

app.post(config.ENDPOINT_POST_SIGNIN, (request, response) => {
    const {email, password} = request.body;

    let filteredUsers = users_to_delete.filter(user => (user.email === email))

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
    db.updateUser(id).then(entries => {
        response.json(entries);
    }).catch(error => response.status(400).json(error))
})