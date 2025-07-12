import {randomUUID} from "crypto";

export class User {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: string;
        isConfirmed: boolean;
    }

    constructor(login: string, email: string, passwordHash: string) {
        this.login = login
        this.email = email
        this.passwordHash = passwordHash
        this.createdAt = new Date().toISOString()
        this.emailConfirmation = {
            expirationDate: new Date().toISOString(),
            confirmationCode: randomUUID(),
            isConfirmed: false
        }
    }

}