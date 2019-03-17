export class UserModel {
    public id: string;
    public email: string;
    public name?: string;
    public last_name?: string;
    public password: string;

    constructor(id: string, email: string, name?: string, last_name?: string, password?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.last_name = last_name;
        this.password = password;
    }
}
