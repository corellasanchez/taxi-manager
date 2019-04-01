export class Expense {

    public id: string;
    public amount: string;
    public business_name: string;
    public car_plate: string;
    public date: any;
    public description: string;
    public driver_id: string;
    public driver_name: string;
    public invoice_number: string;
    public notes: string;
    public quantity: string;
    public type: string;

    constructor(
        id: string,
        amount: string,
        business_name: string,
        car_plate: string,
        date: any,
        description: string,
        driver_id: string,
        driver_name: string,
        invoice_number: string,
        notes: string,
        quantity: string,
        type: string) {
        this.id = id;
        this.amount = amount;
        this.business_name = business_name;
        this.car_plate = car_plate;
        this.date = date;
        this.description = description;
        this.driver_id = driver_id;
        this.driver_name = driver_name;
        this.invoice_number = invoice_number;
        this.notes = notes;
        this.quantity = quantity;
        this.type = type;
    }
}



