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
  currency;
  selectedQuiz = [];
  flags = [{
    flagId:'',
    flagName:''
  }];
  countryDropdown :IDropdownSettings;
  capitalDropdown :IDropdownSettings;
  languageDropdown :IDropdownSettings;
  quizDropdown :IDropdownSettings;
  currencyDropdown :IDropdownSettings;

  quizes = [];
  ngOnInit(){
    this.quizes = [
      { quizId: 1, quizName: 'Capital' },
      { quizId: 2, quizName: 'Flag' },
      { quizId: 3, quizName: 'Currency' },
      { quizId: 4, quizName: 'Language' },
    ];



    this.selectedQuiz = [
      { quizId: 1, quizName: 'Capital' }
    ];

    this.countryDropdown = {
      singleSelection: true,
      idField: 'countryCode',
      textField: 'countryName',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.quizDropdown = {
      singleSelection: true,
      idField: 'quizId',
      textField: 'quizName',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.capitalDropdown = {
      singleSelection: true,
      idField: 'countryCode',
      textField: 'countryCapital',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.currencyDropdown = {
      singleSelection: true,
      idField: 'countryCode',
      textField: 'countryCurrency',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.languageDropdown = {
      singleSelection: true,
      idField: 'countryCode',
      textField: 'countryLanguages',
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
    answer1: [''],
    answer2: [''],
    answer3: [''],
    answer4: [''],
    flag: '',
    quiz: '',
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
  questionsec = true;
  quiz = "Capital";
  constructor(private flashService: FlashService, private countryService: CountryService  ) {
    this.flashs$ = this.flashService.flashs$;
    this.countries$ = this.countryService.countries$; 
    this.handleCountry();

  }

  trackByFlashId(index, flash) {
    return flash._id;
  }

  handleQuiz(value : any){
    this.quiz = value.quizName;
    this.handleGet();
  }

  handleCreateQuestion(){
    this.questionsec = true;
  }

  handlePuzzel(){
    this.questionsec = false;
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
        if(element.quiz == this.quiz )
        this.flashs.push(element);
      });
    this.flashs$.next(this.flashs);
    this.maxScore = this.flashs.length * 5;
   });  
  }
  handleSubmit() {
    this.flash.quiz = this.quiz
    this.flashService.addFlash(this.flash);
    this.handleClear();
    setTimeout(()=>{ 
      this.option = 'All';
      this.handleGet();
   },2000);
  }

  j : any =0;
  handleOption(value : any){
   if(this.j == 1){
     this.flash.answer1 = value.countryCode.toLowerCase();
   }
   if(this.j == 2){
    this.flash.answer2 = value.countryCode.toLowerCase();
   }
   if(this.j == 3){
    this.flash.answer3 = value.countryCode.toLowerCase();
   }
   if(this.j == 4){
    this.flash.answer4 = value.countryCode.toLowerCase();
   }
   if(this.j == 0){
    this.flash.question = value.countryName;
  }
  this.j++;
  }
  sel1 : string;
  sel2 : string;
  sel3 : string;
  sel4 : string;
  i : any =0;
  handleAnswers(value : any){
   this.i++;
   if(this.i == 1){
     this.flash.answer1 = value;
     this.sel1 = this.flash.answer1[0];
   }
   if(this.i == 2){
    this.flash.answer2 = value;
    this.sel2 = this.flash.answer2[0];
   }
   if(this.i == 3){
    this.flash.answer3 = value;
    this.sel3 = this.flash.answer3[0];

   }
   if(this.i == 4){
    this.flash.answer4 = value;
    this.sel4 = this.flash.answer4[0];
   }
  }

  



  handleClear() {
    this.i = 0;
    this.j = 0;
    this.Clear = false;
    this.flash = {
      question: '',
      answer: '',
      answer1: null,
      answer2: null,
      answer3: null,
      answer4: null,
      flag: '',
      quiz: '',
      url :'',
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
    answer1: [],
    answer2: [],
    answer3: [],
    answer4: [],
    flag:'',
    quiz : '',
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
      if(response[index].currencies != undefined){
      country.countryCurrency = response[index].currencies[0].name.split(' ').pop() +' '+ response[index].currencies[0].symbol;
      }
      country.countryFlag = response[index].flag;
      if(response[index].borders != undefined){
      Object.keys(response[index].borders).forEach(function(i){
          country.countryNeighbours.push(response[index].borders[i]);
       });}
       if(response[index].languages != undefined){
        Object.keys(response[index].languages).forEach(function(i){
          country.countryLanguages.push(response[index].languages[i].name);
       });}
      // if(response[index].regionalBlocs != undefined){
      //   Object.keys(response[index].regionalBlocs).forEach(function(i){
      //      country.countryLanguages.push(response[index].regionalBlocs[i]);
      // });}
     
      let count = Object.assign({}, JSON.parse(JSON.stringify(country)));
      countries.push(count);
      country.countryLanguages.length = 0;
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

