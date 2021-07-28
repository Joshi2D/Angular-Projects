
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFlash } from './flash.model';
import {WebAdminService} from './webAdmin.service'

function getRandomNumber() {
  return Math.floor(Math.random() * 10000);
}

@Injectable()
export class FlashService {

  flashs: IFlash[] = [];
  flashcount: number = 0;
  maxScore$ = new BehaviorSubject<number>(this.flashcount)
  flashs$ = new BehaviorSubject<IFlash[]>(this.flashs);
 

  constructor(private WebAdminService : WebAdminService) {}

  
 getFlashes(option : string, maxScore : number){
   return this.WebAdminService.get(`flashes/${option}`).subscribe((response : any) =>{
    response.forEach(element => { 
      this.flashs.push(element);
    });
    this.flashs$.next(this.flashs);
    maxScore = this.flashs.length * 5;
    this.maxScore$.next(maxScore)
 });
}


  addFlash(flash: {question: string, answer: string, answer1: string, answer2: string,  answer3: string,  answer4: string, _id: number, show: boolean}) {
    this.flashs = [
      ...this.flashs, {
        ...flash,
        show: false,
        _id: getRandomNumber(),    
      }
    ];
    flash._id = getRandomNumber();
    flash.show = false;
    this.flashs$.next(this.flashs);
    return this.WebAdminService.post('flashes', {flash}).subscribe((response: any)=> {
      console.log("Flash Card submitted successfully");   
   });
  }

  toggleFlash(id: number) {
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

  deleteFlash(id: number, flash: {question: string, answer: string, answer1: string, answer2: string,  answer3: string,  answer4: string, _id: number, show: boolean} ) {
    const index = this.flashs.findIndex(flash => flash._id === id);
    this.flashs = [
      ...this.flashs.slice(0, index),

      ...this.flashs.slice(index + 1)
    ];
    this.flashs$.next(this.flashs);

    return this.WebAdminService.delete(`flashes/${id}`, {flash} ).subscribe((response : any)=>{
      console.log(response);       
    });
  }

  rememberedChange(id: number, flag: 'correct' | 'incorrect') {
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

  updateFlash(id: number, flash: {question: string, answer: string, answer1: string, answer2: string,  answer3: string,  answer4: string, _id: number, show: boolean}) {
    const index = this.flashs.findIndex(f => f._id === id);
    this.flashs = [
      ...this.flashs.slice(0, index),
      {
        ...this.flashs[index],
        ...flash
      },
      ...this.flashs.slice(index + 1)
    ];
    this.flashs$.next(this.flashs);
    return this.WebAdminService.patch(`flashes/${id}`, {flash} ).subscribe((response : any)=>{
      console.log(response);       
      console.log("FlashCard has been Updated");

    });
  }

  getFlash(id: number) {
    const index = this.flashs.findIndex(flash => flash._id === id);
    return this.flashs[index];
  }
   
  deleteDB(){
     return this.WebAdminService.deleteAll('flashes').subscribe((response) =>{
           alert('All Flash Cards has been deleted successfully');
     })
  }

   emptyFlash(){
     this.flashs.length = 0;
   }
 
}
