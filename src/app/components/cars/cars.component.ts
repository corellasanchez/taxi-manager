import { Component, ViewChild, OnInit } from '@angular/core';
import { Car } from '../../models/car.model';
import { UUID } from 'angular2-uuid';
import { CarService } from '../../services/data-services/car.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { UtilService } from '../../services/util/util.service';
import { MenuController, IonContent } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import * as moment from 'moment';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  public carList: Array<Car>;
  public car: Car;
  public isUpdate: boolean;
  public uid: string;
  public filtertag: any;
  carBrands: Array<string>;
  colors: Array<string>;
  color: number;
  years: Array<number>;
  private currentYear: number;
  title: string;
  listSubscribed: boolean;
  customAlertOptions: any = {
    header: 'Filter',
  };
  showAddPannel: boolean;
  constructor(private carService: CarService,
    private firestoreServ: FirestoreService,
    private authService: AuthenticationService,
    private util: UtilService,
    private menuCtrl: MenuController) {
    this.setCarBrands();
    this.setColors();
    this.car = this.newCar();
    this.setYears();
    this.showAddPannel = false;
    this.title = 'Vehículos Disponibles';
    this.listSubscribed = false;
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
    this.content.scrollToTop(300);
  }
  ngOnInit() {
    this.getUID();
  }

  scroll() {
    this.content.scrollToTop(300);
  }

  addCar() {
    if (this.car.id.trim().length > 0 && this.car.model.trim().length > 0) {
      this.car.uid = this.uid;
      this.car.id = this.car.id.toUpperCase();
      this.car.brand = this.car.brand.toUpperCase();
      this.car.model = this.car.model[0].toUpperCase() + this.car.model.slice(1);
      this.carService.create(this.car).then(
        _ => {
          this.showAddPannel = false;
          this.util.presentToast('Vehículo Agregado', true, 'bottom', 2100);
          this.car = this.newCar();
        }
      ).catch(err => {
      });
    } else {
      this.util.presentToast('Por favor revise los datos.', true, 'bottom', 2100);
    }
  }

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar vehículo';

    } else {
      this.title = 'Vehículos disponibles';

    }
  }


  newCar() {
    this.currentYear = Number(moment().format('YYYY'));
    this.color = 0;

    this.isUpdate = false;
    return {
      id: '',
      brand: 'Toyota',
      model: '',
      uid: UUID.UUID(),
      year: this.currentYear,
      color: '#FFFFFF'
    };
  }

  deleteCar(id) {
    this.util.removeConform(id).then(res => {
      if (res === 'ok') {
        this.carService.delete(id).then(success => this.util.presentToast('Vehículo eliminado', null, null, 3000));
      }
    });
  }

  setCarBrands() {
    // tslint:disable-next-line:max-line-length
    this.carBrands = ['Acura', 'Alfa Romeo', 'AMC', 'Aro', 'Asia', 'Aston Martin', 'Audi', 'Austin', 'Bentley', 'Bluebird', 'BMW', 'Buick', 'BYD', 'Cadillac', 'Chana', 'Changan', 'Chery', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia', 'Daewoo', 'Daihatsu', 'Datsun', 'Dodge/RAM', 'Donfeng (ZNA)', 'Eagle', 'Faw', 'Ferrari', 'Fiat', 'Ford', 'Foton', 'Freightliner', 'Geely', 'Genesis', 'Geo', 'GMC', 'Gonow', 'Great Wall', 'Hafei', 'Heibao', 'Higer', 'Hino', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'International', 'Isuzu', 'Iveco', 'JAC', 'Jaguar', 'Jeep', 'Jinbei', 'JMC', 'Kenworth', 'Kia', 'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lifan', 'Lincoln', 'Lotus', 'Mack', 'Magiruz', 'Mahindra', 'Maserati', 'Mazda', 'Mercedes Benz', 'Mercury', 'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Oldsmobile', 'Opel', 'Peterbilt', 'Peugeot', 'Plymouth', 'Polarsun', 'Pontiac', 'Porsche', 'Proton', 'Rambler', 'Renault', 'Reva', 'Rolls Royce', 'Rover', 'Saab', 'Samsung', 'Saturn', 'Scania', 'Scion', 'Seat', 'Skoda', 'Smart', 'Ssang Yong', 'Subaru', 'Suzuki', 'Tianma', 'Tiger Truck', 'Toyota', 'Volkswagen', 'Volvo', 'Western Star', 'Yugo', 'Otro'];
  }

  setColors() {
    this.colors = [
      '#FFFFFF',
      '#D3D3D3',
      '#C0C0C0',
      '#A9A9A9',
      '#808080',
      '#000000',
      '#0000FF',
      '#87CEFA',
      '#8B4513',
      '#DAA520',
      '#FFFF00',
      '#006400',
      '#7FFF00',
      '#FFA500',
      '#FF4500',
      '#FF0000',
      '#FA8072'
    ];
  }

  changeColor(index) {
    this.car.color = this.colors[index];
  }


  setYears() {
    this.years = [];
    for (let index = this.currentYear - 30; index <= this.currentYear; index++) {
      this.years.push(index);
    }
    this.years.reverse();
  }

  getCarList() {
      this.carService.getCars(this.uid).subscribe(carList => {
        this.carList = carList;
        this.util.closeLoading();
        this.listSubscribed = true;
      });


  }

  getUID() {
    this.util.userid.subscribe(data => {
      if (data) {
        this.uid = data;
        this.getCarList();
      } else {
        this.util.navigate('login', false);
      }

    });
  }

}
