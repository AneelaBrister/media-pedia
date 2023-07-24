import { Injectable } from '@angular/core';
import { AxiosError } from 'axios';
import axios from 'axios';
import { EMPTY, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebScraperService {

  constructor() { }

  public fetchPage (url: string): Observable<string|void> {
    console.log('url: ', url);
    const htmlData = axios
        .get(url)
        .then(res => {
          let dom = new DOMParser();
          let docu = dom.parseFromString(res.data??'', 'text/html');
          let ps:Array<any> = Array.from(docu.querySelectorAll('p'));
          let texts: Array<string> = ps.map(p => p.innerText);
          let text = texts.join('\n');
          return text;
        })
        .catch((err: AxiosError) => {
            console.error('There was an error with ' + url);
            console.error(err.toJSON);
        })

    return from(htmlData) ;
  }

}
