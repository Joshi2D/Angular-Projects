import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CountryService } from './country.service';
import { FlashService } from './flash.service';
import { IFlash} from './flash.model'
import { Observable, Observer } from 'rxjs';
import { ICountry } from './country.model';
import { timeout } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  @ViewChild('flashForm', { static: false })  flashForm: NgForm;
  editing = false;
  Clear = false;
  editingId;
  maxScore = 0;
  yourScore = 0;
  option : string = '';
  countryName = '';

  selectedItems = [];
  countryDropdown :IDropdownSettings 
  capitalDropdown :IDropdownSettings 
  ngOnInit(){
    
    this.selectedCountry = 'All';    
    this.countryDropdown = {
      singleSelection: true,
      idField: 'countryCode',
      textField: 'countryName',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.capitalDropdown = {
      singleSelection: false,
      idField: 'countryCode',
      textField: 'countryCapital',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }
  filterdOptions = [];
  filterUsers() {
    this.filterdOptions = this.countries.filter(
      item => item.countryName.toLowerCase().includes(this.selectedCountry.toLowerCase())
    );
    console.log(this.filterdOptions);
  }
  
  flash = {
    question: '',
    answer: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    flag: '',
    url :'',
    _id: null,
    show: false
  };
  url;
  flag;
  flashs$;
  flashs : IFlash[]= [];
  flashCount : number;
  countries$;
  countries;
  selectedCountry;
  question;
 
  constructor(private flashService: FlashService, private countryService: CountryService  ) {
    this.flashs$ = this.flashService.flashs$;
    this.countries$ = this.countryService.countries$; 
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
        this.countries.forEach(element1 => {
          if(element.question == element1.countryName)
          {
            element.flag = element1.countryCode.toLowerCase();
            element.url = 'url(https://flagcdn.com/'+element.flag+'.svg)';
          }
        });
        this.flashs.push(element);
      });
      this.flashs$.next(this.flashs);
      this.maxScore = this.flashs.length * 5;
   });  
  }
  handleSubmit() {
    this.flashService.addFlash(this.flash);
    this.handleClear();
    setTimeout(()=>{ 
      this.option = 'All';
      this.handleGet();
   },2000);
  }

  handleOption(value : any){
    if(value == 'All'){
    this.option = value;
    }
    else{
     this.option = value.countryName;
     this.flash.question = value.countryName;
    }
  }

  i : any =0;
  handleCapital(value : any){
   this.i++;
   if(this.i == 1){
     this.flash.answer1 = value.countryCapital;
   }
   if(this.i == 2){
    this.flash.answer2 = value.countryCapital;
   }
   if(this.i == 3){
    this.flash.answer3 = value.countryCapital;
   }
   if(this.i == 4){
    this.flash.answer4 = value.countryCapital;
   }
  }
  handleClear() {
    this.i = 0;
    this.Clear = false;
    this.flash = {
      question: '',
      answer: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      flag: '',
      url:'',
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
    flag:'',
    url:'',
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
  let countries : ICountry[] = [];
  let country : ICountry;
  let countriesobj : ICountry[] = [];
  country = {
    countryName : '',
    countryRegion : '',
    countrySubregion : '',
    countryLanguages : [],
    countryFlag : '',
    countryOrganizations : [],
    countryPopulation : null,
    countryArea : null,
    countryNeighbours : [],
    countryCurrency : '',
    countryCode : '',
    countryCapital : ''
  }
this.countryService.get().subscribe((response : any)=>{
      Object.keys(response).forEach(function (index){
      country.countryCode = response[index].alpha2Code;
      country.countryCapital = response[index].capital;
      country.countryName = response[index].name;
      country.countryRegion = response[index].region;
      country.countrySubregion = response[index].subregion;
      country.countryArea = response[index].area;
      country.countryPopulation = response[index].population;
      country.countryCurrency = response[index].demonym;
      country.countryFlag = response[index].flag;
      if(response[index].borders != undefined){
      Object.keys(response[index].borders).forEach(function(i){
          country.countryNeighbours.push(response[index].borders[i]);
       });}
      if(response[index].languages != undefined){
       Object.keys(response[index].languages).forEach(function(i){
          country.countryLanguages.push(response[index].languages[i]);
       });}
      if(response[index].regionalBlocs != undefined){
        Object.keys(response[index].regionalBlocs).forEach(function(i){
           country.countryLanguages.push(response[index].regionalBlocs[i]);
      });}
     
      let count = Object.assign({}, JSON.parse(JSON.stringify(country)));
      countries.push(count);
      
  });
  
  this.countries = countries;
  this.countries$.next(this.countries);
 });;
 setTimeout(()=>{ 
   this.option = 'All';    
   this.handleGet();
},2000);

  }
  
}
function foreach(any: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}

