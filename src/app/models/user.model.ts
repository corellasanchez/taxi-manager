export class UserModel {
    public id: string;
    public email: string;
    public name?: string;
    public last_name?: string;
    public password: string;
    public phone: string;

    constructor(id: string, email: string, name?: string, last_name?: string, password?: string, phone?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.last_name = last_name;
        this.password = password;
        this.phone = phone;
    }
}
