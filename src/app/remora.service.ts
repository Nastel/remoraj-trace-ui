import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import data from 'devextreme';

@Injectable({
  providedIn: 'root'
})
export class RemoraService {
  private _remoraUrl: string = "http://localhost:7366";

  constructor(private http: HttpClient) { }

  public addTrackedMethod(classAndMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(this._remoraUrl + "/methods/" + classAndMethod, null,{responseType: 'text'as 'json'}).subscribe(data => {
        console.log("Data returned");
        console.log(data);
        resolve(data);
      }, error => {
        console.log("Error returned");
        console.log(error);
        reject(error);

      } );
    });

  }

  set remoraUrl(value: string) {
    this._remoraUrl = value;
  }

  get remoraUrl(): string {
    return this._remoraUrl;
  }



}
