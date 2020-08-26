import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JkoolService {

  constructor(private http: HttpClient,) { }

  public executeHttpRequest(searchQuery: string): Promise<any> {
    console.log(searchQuery);
    return new Promise((resolve, reject) => {
      const url = this.buildSearchUrl(searchQuery);
      console.log('URL', url);
      this.http.get<any>(url).subscribe(data => {
        // console.log("Response for dashboard:", data);
        resolve(data);

      }, error => {
        console.log('Error got on HTTP call', error);
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
    const accessToken = '35066921-9726-454e-aa5d-c1ae4c5fe686';

    return searchConf.url
      + searchConf.param_query + encodeURI(searchQuery)
      + searchConf.param_token + accessToken
      + searchConf.param_max_rows + searchConf.max_rows
      + searchConf.param_time_zone
      + searchConf.param_time_range
      ;
  }
}
