import { Component, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashService } from './flash.service';
import { tap } from 'rxjs/operators';
import {ScoreComponent} from './score/score.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('flashForm', { static: false }) flashForm: NgForm;
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
    answer4: ''
  };
  flashs$;
  flashs;
  constructor(private flashService: FlashService ) {
    this.flashs$ = this.flashService.flashs$;
  }

  trackByFlashId(index, flash) {
    return flash.id;
  }

  handleSubmit(): void {
    this.flashService.addFlash(this.flash);
    this.maxScore = this.maxScore + 5;
    this.handleClear();
  }

  handleClear() {
    this.flash = {
      question: '',
      answer: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
    };
   
    this.flashForm.reset();
  }

  handleToggleCard(id) {
    this.flashService.toggleFlash(id);
  }

  handleDelete(id) {
    this.flashService.deleteFlash(id);
  }

  handleEdit(id) {
    this.flash = this.flashService.getFlash(id);
    this.editing = true;
    this.editingId = id;
  }

  handleUpdate() {
    this.flashService.updateFlash(this.editingId, this.flash);
    this.handleCancel();
  }

  handleCancel() {
    this.editing = false;
    this.editingId = undefined;
    this.handleClear();
  }

  handleRememberedChange({ id, flag }) {
    this.flashService.rememberedChange(id, flag);
    if(flag == 'correct')
    this.yourScore = this.yourScore + 5;
    else
    this.yourScore = this.yourScore - 2;
  }
}
