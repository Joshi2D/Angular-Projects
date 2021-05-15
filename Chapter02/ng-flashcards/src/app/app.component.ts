import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashService } from './flash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('flashForm', { static: false })  flashForm: NgForm;
  editing = false;
  editingId;
  maxScore = 0;
  yourScore = 0;
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
  constructor(private flashService: FlashService ) {
    this.flashs$ = this.flashService.flashs$;
  }

  trackByFlashId(index, flash) {
    return flash._id;
  }
  handleGet(){
    this.flashService.getFlashes(this.flashs);
  }
  handleSubmit() {
    //this.flashService.addFlash(this.flash);
    this.flashService.addFlash(this.flash);
    this.maxScore = this.maxScore + 5;
    this.handleClear();
    this.handleGet();
  }

  handleClear() {
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
    this.flashService.updateFlash(this.editingId, this.flash);
   
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
}
function foreach(any: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}

