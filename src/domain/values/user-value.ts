import { v4 as uuid } from "uuid"
import { UserEntity } from "../entities/user-entity";

export class UserValue implements UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    deleted: boolean;

    constructor( name: string, email: string, password: string, role?: any ) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.deleted = false;
    }
}