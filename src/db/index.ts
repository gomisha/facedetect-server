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
        catch(error) { return Promise.reject("Error adding user"); }
    }

    public getPassword(email: string):Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.connection(config.DB_TABLE_LOGIN).where("email", email)
                .then((logins: any) => {
                    console.log("logins.length", logins.length);
                    if(logins.length !== 1) { throw new Error("Incorrect user/password1") }
                    console.log("getPassword1", logins)
                    resolve(logins[0].hash)
                })
                .catch((error: any) => reject(error))
        })
    }

    public getUserById(id: string):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER).where("id", id)
                .then((users: User []) => resolve(this.onUserReturned(users)))
                .catch((error: any) => reject(error))
        })
    }

    public getUserByEmail(email: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER).where("email", email)
                .then((users: User []) => resolve(this.onUserReturned(users)))
                .catch((error: any) => reject(error))
        })
    }

    public getUsers():Promise<User []> {
        return new Promise<User []>((resolve, reject) => {
            this.connection.select().table(config.DB_TABLE_USER)
                .then((users: User []) => {
                    if(users) { resolve(users) }
                    else      { reject("error getting users") }
                })
                .catch((error: any) => reject(error))
        })
    }

    public updateUser(id: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER)
                .where("id", "=", id)
                .increment("entries", 1)
                .returning("entries")
                .then((entries: number) => {
                    if(entries > 0) { resolve(entries); }
                    else { reject("Error updating entries for id " + id)}
                })
                .catch((error: any) => reject(error))
        })
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

    private onUserReturned(users: any): User {
        let newUser = new User();
        newUser.name = users[0].name;
        newUser.email = users[0].email;
        newUser.joined = users[0].joined;
        newUser.id = users[0].id;
        newUser.entries = users[0].entries;
        return newUser;
    }
}