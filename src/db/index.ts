import knex from "knex";

import IConnection from "./IConnection";
import * as config from "./config_db";

import User from "./user";

export default class DB {
    private connection: knex;

    constructor() {
        this.connection = this.connect();
    }

    // ***************** PUBLIC ******************************

    public async addLogin(email: string, hash: string): Promise<void> {
        try {
            await this.connection(config.DB_TABLE_LOGIN)
                .insert({ 
                    email,
                    hash});
        }
        catch(error) { return Promise.reject("error adding login for email: " + email) }
    }

    /** Create a DB transaction around 1) creating user record 2) create login record */
    public registerUser(user: User, hash: string): User {
        console.log("registerUser>1")
//        return new Promise<User>((resolve, reject) => {
            console.log("registerUser>2")
//             this.connection.transaction(trx => {
//                 console.log("registerUser>3")
//                 this.addUser(user, trx) 
//                     .then(()=> {
//                         console.log("registerUser>4")
//                        // return this.addLogin(user.email, hash, trx)
//                         console.log("registerUser>5")
//                     })
//                     // .then(()=> {
//                     //     console.log("registerUser>6")
//                     //     return;
//                     //     // resolve(user);
//                     // })
//                     .catch(error => {
//                         console.log("registerUser>7")
//                         // reject("error registering user")
//                     })
//             })
//             .then(() => {
//                 console.log("registerUser>8")
//                 console.log("registerUser>transaction completed")
//                 // resolve(user)
//             })
//             .catch(error => {
//                 console.log("registerUser>9")
//                 console.log("registerUser>error: " + error)
//                 // reject("error registering user")
//             })
// //        })
            return new User();
    }

    public async addUser(user: User): Promise<User> {
        try {
            let users: User [] = await this.connection(config.DB_TABLE_USER)
                .returning("*")
                .insert({
                    name: user.name,
                    email: user.email,
                    joined: new Date()});
            return Promise.resolve(users[0]);
        }
        catch(error) { return Promise.reject("Error adding user") }
    }

    public async getPassword(email: string):Promise<string> {
        try {
            let logins = await this.connection(config.DB_TABLE_LOGIN).where("email", email);
            if(logins.length !== 1) { throw new Error("Incorrect user/password1.1") }
            return Promise.resolve(logins[0].hash)
        }
        catch(error) { return Promise.reject("Incorrect user/password1.2") }
    }

    public async getUserById(id: string):Promise<User> {
        try {
            let users: User [] = await this.connection(config.DB_TABLE_USER).where("id", id);
            if(users.length != 1) throw new Error("invalid # of users returned: " + users.length)
            return Promise.resolve(users[0]);
        }
        catch(error) { return Promise.reject("error getting user id: " + error) }
    }

    public async getUserByEmail(email: string): Promise<User> {
        try {
            let users: User [] = await this.connection(config.DB_TABLE_USER).where("email", email)
            if(users.length != 1) throw new Error("Invalid # of users returned")
            return Promise.resolve(users[0])
        }
        catch(error) { return Promise.reject(error) }
    }

    public async getUsers():Promise<User []> {
        try {
            let users: User [] = await this.connection.select().table(config.DB_TABLE_USER)
            return Promise.resolve(users)
        }
        catch(error) { return Promise.reject(error) }
    }

    public async updateUser(id: string): Promise<number> {
        try {
            let entries: number = await this.connection(config.DB_TABLE_USER)
                .where("id", "=", id)
                .increment("entries", 1)
                .returning("entries")
            if(entries > 0) { return Promise.resolve(entries) }
            return Promise.reject("wrong number of entries: " + entries)
        }
        catch(error) { return Promise.reject("error updating user with id: " + id)}
    }

    // ***************** PRIVATE ******************************
    private connect():knex {
        let connection: IConnection = {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE
        };

        return knex({
            client: 'pg',
            connection
        })
    }
}