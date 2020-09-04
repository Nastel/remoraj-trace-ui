import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class JkoolService {

  private _jkTokenLocalStorageKey = "JK_TOKEN";
  private _accessToken = window.localStorage.getItem(this._jkTokenLocalStorageKey) || 'Fill in the repository token';
  constructor(private http: HttpClient, public snackBar: MatSnackBar) { }

  public executeHttpRequest(searchQuery: string): Promise<any> {
    console.log(searchQuery);
    return new Promise((resolve, reject) => {
      const url = this.buildSearchUrl(searchQuery);
      console.log('URL', url);
      this.http.get<any>(url).subscribe(data => {
        // console.log("Response for dashboard:", data);
        if (data['jk_error']) {
          this.snackBar.open("Received error " + data['jk_error'], "OK", {
            duration: 6000,
          });
          reject(data['jk_error']);
        } else {


          this.snackBar.open("Received " + data['row-count'] + " events", "OK", {
            duration: 2000,
          });
          resolve(data);
        }
      }, error => {
        console.log('Error got on HTTP call', error);
        this.snackBar.open("Received error" +error , "OK", {
          duration: 6000,
        });
        reject(error);
      });
    }) as Promise<any>;
  }

  private buildSearchUrl(searchQuery: string): string {
    const searchConf = {

      url: 'https://www.gocypher.com/gocypherservices/services/v1/proxy/jkql',
      param_token: '&jk_token=',
      param_query: '?jk_query=',
      param_max_rows: '&jk_maxrows=',
      max_rows: 500,
      param_time_zone: '&jk_tz=GMT',
      param_time_range: '&jk_date=last%2010%20years'


    };

    return searchConf.url
      + searchConf.param_query + encodeURI(searchQuery)
      + searchConf.param_token + this._accessToken
      + searchConf.param_max_rows + searchConf.max_rows
      + searchConf.param_time_zone
      + searchConf.param_time_range
      ;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    localStorage.setItem(this._jkTokenLocalStorageKey, value);
    this._accessToken = value;
  }

}
