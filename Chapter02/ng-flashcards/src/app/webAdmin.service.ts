import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class WebAdminService {
    readonly ROOT_URL;
    constructor(private http: HttpClient) {
    this.ROOT_URL = "http://localhost:3000";
  }

   //get Method
   get(uri : string){
    return this.http.get(`${this.ROOT_URL}/${uri}`);
   }

   //post Method
   post(uri : string, card : object){
    return this.http.post(`${this.ROOT_URL}/${uri}`, card);
   }

   //patch Method
   patch(uri : string, card : object){
    return this.http.patch(`${this.ROOT_URL}/${uri}`, card);
   }

   //delete Method
   deleteAll(uri : string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
   }

   delete(uri : string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
   }

}
