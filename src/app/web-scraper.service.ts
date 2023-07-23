import { Injectable } from '@angular/core';
import { AxiosError } from 'axios';
import axios from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebScraperService {

  constructor() { }

  public fetchPage (url: string): Observable<string|undefined> {
    console.log('url: ', url);
    const header = {
      "Access-Control-Allow-Origin": "*"
    }
    const htmlData = axios
        .get(url, {headers: header})
        .then(res => {
          console.log('within promise', res.headers)
          return res.data;
        })
        .catch((err: AxiosError) => {
            console.error('There was an error with ${err.config.url}');
            console.error(err.toJSON);
        })

    return from(htmlData) ;
  }

}
