import {Component, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RemoraService {
  private _remoraUrl: string = "http://localhost:7366";

  constructor(private http: HttpClient, public snackBar: MatSnackBar) { }

  public addTrackedMethod(classAndMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(this._remoraUrl + "/methods/" + classAndMethod, null,{responseType: 'text'as 'json'}).subscribe(data => {
        console.log("Data returned");
        console.log(data);

          this.snackBar.open("Success", "OK", {
            duration: 2000,
          });
        resolve(data);
      }, error => {
        console.log("Error returned");
        this.snackBar.open("Error returned. Could not conenct to " + this.remoraUrl, "OK", {
          duration: 2000,
        });
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
