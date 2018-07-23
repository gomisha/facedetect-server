import bcrypt from "bcrypt";

export default class Utility {
    static saltRounds = 10;

    static hashPassword(password: string) {
        return bcrypt.hashSync(password, this.saltRounds);
    }
    
    static verifyPassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash)
    }
}

