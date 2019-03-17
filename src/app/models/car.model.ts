export class Car {

    public id: string;
    public brand: string;
    public model: string;
    public uid: string;
    public year: number;
    public color: string;

    constructor(id: string, brand: string, model: string, uid: string, year: number, color: string) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.uid = uid;
        this.year = year;
        this.color = color;
    }
}
