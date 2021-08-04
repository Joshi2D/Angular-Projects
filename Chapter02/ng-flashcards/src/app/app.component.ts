import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CountryService } from './country.service';
import { FlashService } from './flash.service';
import { IFlash} from './flash.model'
import { Observable, Observer } from 'rxjs';
import { IcountryCode } from './country.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('flashForm', { static: false })  flashForm: NgForm;
  editing = false;
  Clear = false;
  editingId;
  maxScore = 0;
  yourScore = 0;
  option : string = '';
  country = {
    countryCode : 'All',
    countryDetail : {countryName : 'All',
                     countryRegion : 'All'}
  }
  flash = {
    question: '',
    answer: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    _id: null,
    show: false
  };
  flag;
  flashs$;
  flashs : IFlash[]= [];
  flashCount : number;
  countries$;
  countries;
  selectedCountry;
  ngOnInit(){
          this.selectedCountry = 'All';
          this.handleOption(this.selectedCountry);
          
  }

  constructor(private flashService: FlashService, private countryService: CountryService  ) {
    this.flashs$ = this.flashService.flashs$;
    this.countries$ = this.countryService.countries$; 
    this.selectedCountry = "'All'";
    this.handleCountry();
  }

  trackByFlashId(index, flash) {
    return flash._id;
  }
  handleGet(){
    this.handleClear();
    this.Clear = true;
    
    this.flashService.getFlashes(this.option).subscribe((response : any) =>{
      response.forEach(element => { 
        this.flashs.push(element);
      });
      this.flashs$.next(this.flashs);
      this.maxScore = this.flashs.length * 5;
   });  
  }
  handleSubmit() {
    this.flashService.addFlash(this.flash);
    this.handleClear();
    this.handleGet();
  }

  handleOption(value : any){
    if(value == 'All'){
    this.option = value;
    this.flag = 'RE';}
    else{
     this.flag = value.countryCode;
     this.option = value.countryDetail.countryName;
    }
     this.handleGet();
  }

  handleClear() {
    this.Clear = false;
    this.flash = {
      question: '',
      answer: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      _id: null,
      show: false
    }; 
    if(this.flashForm)
    this.flashForm.reset();
    if(this.flashService)
    this.flashService.emptyFlash();
    this.flashs = [];
    this.maxScore = 0;
    this.yourScore = 0;
  }

  handleToggleCard(id) {
    const index = this.flashs.findIndex(flash => flash._id === id);
    this.flashs = [
      ...this.flashs.slice(0, index),
      {
        ...this.flashs[index],
        show: !this.flashs[index].show
      },
      ...this.flashs.slice(index + 1)
    ];
    this.flashs$.next(this.flashs);
  }

  handleDelete(_id) {
    this.editingId = _id;
    const index = this.flashs.findIndex(flash => flash._id === _id);
    this.flashs = [
      ...this.flashs.slice(0, index),

      ...this.flashs.slice(index + 1)
    ];
    this.flashs$.next(this.flashs);
    this.flashService.deleteFlash(this.editingId).subscribe((response : any)=>{
      console.log(response);       
    });
  }

  handleEdit(id) {
    this.editing = true;
    this.editingId = id;
    const index = this.flashs.findIndex(flash => flash._id === id);
    this.flash  = this.flashs[index];
    return this.flashs[index];
  }

  handleUpdate() {
    this.flash.show = false;
    this.flashService.updateFlash(this.editingId, this.flash, this.flashs).subscribe((response : any)=>{
      console.log(response);       
      console.log("FlashCard has been Updated");

    });;
    this.handleClear();
    this.handleGet(); 
  }

  handleCancel() {
    this.editing = false;
    this.editingId = undefined;
    this.handleClear();
  }

  handleReset(){
   this.flashService.deleteDB();
   this.flash = {
    question: '',
    answer: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    _id: null,
    show: false
  }; 
  this.flashForm.reset();
  this.flashService.emptyFlash();
  this.maxScore = 0;
  this.yourScore = 0;
  }

  handleRememberedChange({ id, flag }) {
    if(flag == 'correct')
    this.yourScore = this.yourScore + 5;
    else
    this.yourScore = this.yourScore - 2;

    const index = this.flashs.findIndex(flash => flash._id === id);
    this.flashs = [
      ...this.flashs.slice(0, index),
      {
        ...this.flashs[index],
        remembered: flag
      },
      ...this.flashs.slice(index + 1)
    ];
    this.flashs$.next(this.flashs);
  }

  handleCountry(){
  let countries : IcountryCode[] = [];
  let country : IcountryCode;
  country = {
    countryCode : '',
    countryDetail : {countryName : '',
                     countryRegion : ''}
  }
  this.countryService.get().subscribe((response : any)=>{
    response = response.data;
    Object.keys(response).forEach(function (key){
      country.countryCode = key;
      country.countryDetail.countryName = response[key].country;
      country.countryDetail.countryRegion = response[key].region;
      let count = Object.assign({}, JSON.parse(JSON.stringify(country)));
      countries.push(count);
      
  });
  this.countries = countries;
  this.countries$.next(this.countries);
 });;
  }
  
}
function foreach(any: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}

