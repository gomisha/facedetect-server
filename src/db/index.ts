import knex from "knex";

import IConnection from "./IConnection";

import User from "./user";
import { resolve } from "url";

export default class DB {
    private connection: any;

    constructor() {
    }

    connect():void {
        let connection: IConnection = {
            host: "stampy.db.elephantsql.com",
            user: "niqdgsog",
            password: "pVthToA_yOX2i7QS4ndFIzHL7hILRu08",
            database: "niqdgsog"
        };

        this.connection = knex({
            client: 'pg',
            connection
        })
    }

    public addUser(user: User) {
        return new Promise<User>((resolve, reject) => {
            this.connection('fd_users')
            .returning("*")
            .insert({
                name: user.name,
                email: user.email,
                joined: new Date()
            }).then((users: any) => {
                resolve(this.onUserInsert(users));
            });
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