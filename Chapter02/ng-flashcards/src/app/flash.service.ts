
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

  
 getFlashes(option : string){
   return this.WebAdminService.get(`flashes/${option}`);
}


  addFlash(flash: {question: string, answer: string, answer1: string, answer2: string,  answer3: string,  answer4: string, _id: number, show: boolean}) {
    this.flashs = [
      ...this.flashs, {
        ...flash,
        flag : '',
        url:'',
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

  toggleFlash(id: number, flashs : IFlash[]) {
    const index = flashs.findIndex(flash => flash._id === id);
    flashs = [
      ...flashs.slice(0, index),
      {
        ...flashs[index],
        show: !flashs[index].show
      },
      ...flashs.slice(index + 1)
    ];
    this.flashs$.next(flashs);
  }

  deleteFlash(id: number) {
   

    return this.WebAdminService.delete(`flashes/${id}`);
  }

  updateFlash(id: number, flash: {question: string, answer: string, answer1: string, answer2: string,  answer3: string,  answer4: string, _id: number, show: boolean}, flashs : IFlash[]) {
    return this.WebAdminService.patch(`flashes/${id}`, {flash} );
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
