// 3rd party libs
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const Clarifai = require('clarifai');


import * as config from "./config";
import User from "./db/user";

import Utility from "./utility";

import DB from "./db/index";

const app = express();

app.use(bodyParser.json());

let db = new DB();

const clarify = new Clarifai.App({
    apiKey: config.CLARIFAI_KEY
});

// for error: No 'Access-Control-Allow-Origin' header is present on the requested resource.
app.use(cors());

let listenPort = process.env.PORT || config.PORT;

app.listen(listenPort, ()=> {
    console.log("server running on port " + listenPort);
})

// ***************** GET REQUESTS **********************************

app.get(config.ENDPOINT_GET_HOME, (request, response) => {
    response.json("it's working! server listening");
})

app.get(config.ENDPOINT_GET_PROFILE, (request, response) => {
    const id = request.params.id;

    db.getUserById(id).then(user => {
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

    if(!name || !email || !password) {
        return response.status(400).json("Invalid data for registering")
    }

    let user = new User();
    user.name = name;
    user.email = email;

    db.addUser(user, hash)
        .then(addedUser => response.json(addedUser))
        .catch(error => response.status(400).json(error));
})

app.post(config.ENDPOINT_POST_SIGNIN, (request, response) => {
    const {email, password} = request.body;

    if(!email || !password) {
        return response.status(400).json("Invalid data for sign in")
    }

    db.getPassword(email)
        .then(hash => {
            if(!Utility.verifyPassword(password, hash)) {
                throw new Error("Incorrect user/password2");
            }
            //after authenticate, retrieve user info
            db.getUserByEmail(email)
                .then(user => response.json(user))
        }).catch(error => response.status(400).json("" + error));
})

// ***************** PUT REQUESTS **********************************
app.put(config.ENDPOINT_PUT_IMAGE, (request, response) => {
    const { id, imageURL } = request.body

    const responseBody = {
        entries: 0,
        data: {}
    }

    clarify.models.predict(Clarifai.FACE_DETECT_MODEL, imageURL)
        .then((response: any) => {
            if(!response) { throw new Error("error getting face from Clarifai") }
            responseBody.data = response
            return db.updateUser(id)  //update user's stats after fetched face
        }).then((entries: number) => {
            responseBody.entries = entries
            return response.json(responseBody)
        }).catch((error: Error) => response.status(400).json("error: " + error))
})