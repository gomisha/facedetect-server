import knex from "knex";

import IConnection from "./IConnection";
import * as config from "./config_db";

import User from "./user";
import { resolve } from "url";

export default class DB {
    private connection: any;

    constructor() {
        this.connect();
    }

    // ***************** PUBLIC ******************************

    public addUser(user: User): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER)
                .returning("*")
                .insert({
                    name: user.name,
                    email: user.email,
                    joined: new Date()})
                .then((users: User []) => resolve(this.onUserReturned(users)))
                .catch((error:any) => reject(error));
        })
    }

    public getUser(id: string):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER).where("id", id)
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
    private connect():void {
        let connection: IConnection = {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE
        };

        this.connection = knex({
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