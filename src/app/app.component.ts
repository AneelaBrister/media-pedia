import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { WebScraperService } from './web-scraper.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'media-pedia';

  constructor(private _webScraper: WebScraperService) {}

  url$: BehaviorSubject<string> = new BehaviorSubject('');
  scraped$: Observable<string|undefined> = EMPTY;
  

  onGo(url: string) {
    this.url$.next(url);
    this.scraped$ = this._webScraper.fetchPage(this.url$.value);
    this.scraped$.subscribe(s => console.log('scraped', s));
  }

}
