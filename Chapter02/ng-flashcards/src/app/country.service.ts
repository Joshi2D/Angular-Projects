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
get(country : IcountryCode, countries : IcountryCode[] = []){
  
   return this.https.get(`${this.ROOT_URL}`).subscribe((response : any)=>{
    response = response.data;
    Object.keys(response).forEach(function (key){
      country.countryCode = key;
      country.countryDetail.countryName = response[key].country;
      country.countryDetail.countryRegion = response[key].region;
      let count = Object.assign({}, JSON.parse(JSON.stringify(country)));
      countries.push(count);
      
  });
  this.countries = countries;
  this.countries$.next(this.countries);
 });
}
}
