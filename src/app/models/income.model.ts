export class Income {

    public id: string;
    public amount: string;
    public car_plate: string;
    public start_date: any;
    public end_date: any;
    public initial_mileage: string;
    public final_mileage: string;
    public driver_id: string;
    public driver_name: string;
    public notes: string;
    public type: string;
    public owner_id: string;

    constructor(
         id: string,
         amount: string,
         car_plate: string,
         start_date: any,
         end_date: any,
         initial_mileage: string,
         final_mileage: string,
         driver_id: string,
         driver_name: string,
         notes: string,
         type: string,
         owner_id: string) {
        this.id = id;
        this.amount = amount;
        this.car_plate = car_plate;
        this.start_date = start_date;
        this.end_date = end_date;
        this.initial_mileage = initial_mileage;
        this.final_mileage = final_mileage;
        this.driver_id = driver_id;
        this.driver_name = driver_name;
        this.notes = notes;
        this.type = type;
        this.owner_id = owner_id;
    }
}



