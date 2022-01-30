import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICountry } from './country.model';

@Injectable()
export class CountryService {
  readonly ROOT_URL;
  countries: ICountry[] = [];
  countries$ = new BehaviorSubject<ICountry[]>(this.countries);
  constructor(private https: HttpClient) {
  this.ROOT_URL = "https://restcountries.com/v2/all";
}
get(){
   return this.https.get(`${this.ROOT_URL}`);
}
}
//https://api.printful.com/countries
//https://restcountries.eu/rest/v2/
//http://restcountries.com/v2/all
//https://api.first.org/data/v1/countries