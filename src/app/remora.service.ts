import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import data from 'devextreme';

@Injectable({
  providedIn: 'root'
})
export class RemoraService {
  private remoraUrl: string = "http://localhost:7366";

  constructor(private http: HttpClient) { }

  public addTrackedMethod(classAndMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(this.remoraUrl + "/methods/" + classAndMethod, null,{responseType: 'text'}).subscribe(data => {
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

}
