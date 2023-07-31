import { Injectable } from '@angular/core';
import { AxiosError } from 'axios';
import axios from 'axios';
import { EMPTY, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebScraperService {

  constructor() { 
    // axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3216';
    // axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, HEAD, OPTIONS, PUT';
    // // axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';
    // axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization';
  }

  public fetchPage (url: string): Observable<string|void> {
    console.log('url: ', url);
    const htmlData = axios
        .get(url)     //, {withCredentials: true}
        .then(res => {
          let dom = new DOMParser();
          let docu = dom.parseFromString(res.data??'', 'text/html');
          let ps:Array<any> = Array.from(docu.querySelectorAll('p'));
          let texts: Array<string> = ps.map(p => p.innerText);
          let reduced = texts.reduce((prev, curr) => {
            if (prev.length >= 1500) return prev;
            let val = prev += '\n' + curr;
            return val;
          }, '');

          return reduced;
        })
        .catch((err: AxiosError) => {
            console.error('There was an error with ' + url);
            console.error(err.toJSON);
        })

    return from(htmlData) ;
  }

}
