export class Driver {

    public id: string;
    public ssn: string;
    public name: string;
    public last_name: string;
    public uid: string;
    public percentage: number;
    public phone: string;

    constructor(id: string, ssn: string, name: string, last_name: string, uid: string, percentage: number, phone: string) {
        this.id = id;
        this.ssn = ssn;
        this.name = name;
        this.last_name = last_name;
        this.uid = uid;
        this.percentage = percentage;
        this.phone = phone;
    }
}
