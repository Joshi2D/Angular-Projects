import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IcountryCode } from './country.model';

@Injectable()
export class CountryService {
  readonly ROOT_URL;
  countries: IcountryCode[] = [];
  countries$ = new BehaviorSubject<IcountryCode[]>(this.countries);
  constructor(private https: HttpClient) {
  this.ROOT_URL = "https://api.first.org/data/v1/countries";
}
get(){
  
   return this.https.get(`${this.ROOT_URL}`);
}
}
//https://api.printful.com/countries