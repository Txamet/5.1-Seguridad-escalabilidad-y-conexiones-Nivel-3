import { UserEntity } from "../entities/user-entity";

export class UserValue implements UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    deleted: boolean;

    constructor( id: string, name: string, email: string, password: string, role: string ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.deleted = false;
    }
}