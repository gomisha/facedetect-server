export default class User {
    id: string;
    name: string;
    email: string;
    joined: Date | string;
    entries: number;

    constructor() {
        this.id = "";
        this.name = "";
        this.email = "";
        this.joined = "";
        this.entries = 0;
    }
}