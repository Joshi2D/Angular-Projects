import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { count } from 'rxjs/operators';
import { IFlash } from './../flash.model';
import { FlashService } from './../flash.service'

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashComponent {
  @Input() flash: IFlash = {
    question: '',
    answer: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    id: 0,
    show: false,
  };
  @Output() toggleCard = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() rememberedChange = new EventEmitter();

 

   onToggleCard() {
     this.toggleCard.emit(this.flash.id);
   }
 

  deleteFlash() {
    this.delete.emit(this.flash.id);
  }

  editFlash() {
    this.edit.emit(this.flash.id);
  }

  markCorrect(value1, value2) {
    if(value1 == value2 ){
    this.rememberedChange.emit({
      id: this.flash.id,
      flag: 'correct'
    });
    
  }
  else{
    this.rememberedChange.emit({
      id: this.flash.id,
      flag: 'incorrect'
    });
  }
  }

  



}
