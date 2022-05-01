import { Component, OnInit, NgZone,Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { timer } from 'rxjs';
import { count } from 'rxjs/operators';
import { IFlash } from './../flash.model';
import { FlashService } from './../flash.service'


@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FlashComponent {
  @Input() flash: IFlash = {
    question: '',
    answer: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    flag : '',
    quiz : '',
    url:'',
    _id: 0,
    show: false,
  };
  @Input() flag : string;
  @Input() url : string;
  @Input() quiz : string;
  clicked = false;
  @Output() toggleCard = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() rememberedChange = new EventEmitter();
  timeLeft: number = 20;
  subscribeTimer: number;
  interval;
  toggle = 0;

   onToggleCard() {
     if(this.toggle == 0){
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
      }
    },1000)
    this.toggle = 1;
  }
     this.toggleCard.emit(this.flash._id);
   }
 

  deleteFlash() {
    this.delete.emit(this.flash._id);
  }

  editFlash() {
    this.clicked = false;
    this.edit.emit(this.flash._id);
  }

  markCorrect(value1, value2) {
    this.timeLeft = 0;
    this.clicked = true;
    this.toggleCard.emit(this.flash._id);
    if(value1 == value2 ){
    this.rememberedChange.emit({
      id: this.flash._id,
      flag: 'correct'
    });
    
  }
  else{
    this.rememberedChange.emit({
      id: this.flash._id,
      flag: 'incorrect'
    });
  }
  }
}
