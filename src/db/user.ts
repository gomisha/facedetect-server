export default class User {
    id: string;
    name: string;
    email: string;
    password: string;
    joined: Date;
    entries: number;

    constructor(name: string, email: string, password: string) {
        this.id = "" + new Date().getMilliseconds();
        this.name = name;
        this.email = email;
        this.password = password;
        this.joined = new Date();
        this.entries = 0;
    }
}