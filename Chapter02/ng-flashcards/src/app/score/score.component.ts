import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FlashService } from '../flash.service';
import { FlashComponent } from '../flash/flash.component';
import { IFlash} from '../flash.model';


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent implements OnInit {
  @Input() totalCount : Int16Array   
  @Input() yourCount : Int16Array   

  //yourScoreArray = [];
  //yourScore;
  flashs$;

  constructor(private flashService: FlashService) {
    this.flashs$ = this.flashService.flashs$;
  }


  //refreshScore(){    
    //this.totalCount = this.flashService.flashs.length * 5;
    //this.yourScoreArray = this.flashService.flashs.filter(x=>x.remembered === 'correct');
    //this.yourScore = this.yourScoreArray.length * 5;
  //}

  ngOnInit() {
    
  }


}
