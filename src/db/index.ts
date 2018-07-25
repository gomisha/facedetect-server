import knex from "knex";

import IConnection from "./IConnection";
import * as config from "./config_db";

import User from "./user";
import { resolve } from "url";

export default class DB {
    private connection: any;

    constructor() {
    }

    connect():void {
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

    public addUser(user: User) {
        return new Promise<User>((resolve, reject) => {
            this.connection(config.DB_TABLE_USER)
            .returning("*")
            .insert({
                name: user.name,
                email: user.email,
                joined: new Date()
            }).then((users: any) => {
                resolve(this.onUserInsert(users));
            }).catch((error:any) => {
                reject(error);
            });
        })
    }

    public getUser(id: string) {
        return new Promise<User>((resolve, reject) => {
            this.connection('')
        })
    }

    private onUserInsert(users: any): User {
        let newUser = new User();
        newUser.name = users[0].name;
        newUser.email = users[0].email;
        newUser.joined = users[0].joined;
        newUser.id = users[0].id;
        newUser.entries = users[0].entries;
        return newUser;
    }
}