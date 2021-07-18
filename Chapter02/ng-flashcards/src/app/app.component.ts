import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CountryService } from './country.service';
import { FlashService } from './flash.service';


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
    countryCode : '',
    countryDetail : {countryName : '',
                     countryRegion : ''}
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

  flashs$;
  flashs;
  countries$;
  countries;
  ngOnInit(){
    //this.countryService.get();
  }

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
    this.flashService.getFlashes(this.flashs, this.option);
  }
  handleSubmit() {
    //this.flashService.addFlash(this.flash);
    this.flashService.addFlash(this.flash);
    this.maxScore = this.maxScore + 5;
    this.handleClear();
    this.handleGet();
  }

  handleOption(value : string){
     this.option = value;
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
    this.flashForm.reset();
    this.flashService.emptyFlash();
    this.maxScore = 0;
    this.yourScore = 0;
  }

  handleToggleCard(id) {
    this.flashService.toggleFlash(id);
  }

  handleDelete(_id) {
    this.editingId = _id;
    this.flashService.deleteFlash(this.editingId, this.flashService.getFlash(_id));
  }

  handleEdit(id) {
    this.flash = this.flashService.getFlash(id);
    this.editing = true;
    this.editingId = id;
  }

  handleUpdate() {
    this.flash.show = false;
    this.flashService.updateFlash(this.editingId, this.flash);
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
    this.flashService.rememberedChange(id, flag);
    if(flag == 'correct')
    this.yourScore = this.yourScore + 5;
    else
    this.yourScore = this.yourScore - 2;
  }

  handleCountry(){
    this.countries = this.countryService.get(this.country);
  }
  
}
function foreach(any: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}

