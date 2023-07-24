import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, flatMap, map, mergeMap, tap } from 'rxjs';
import { WebScraperService } from './web-scraper.service';
import { OpenAiService } from './open-ai.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'media-pedia';

  constructor(private _webScraper: WebScraperService, private _llm: OpenAiService) {}

  url$: BehaviorSubject<string> = new BehaviorSubject('');
  scraped$: Observable<string> = EMPTY;
  

  onGo(url: string) {
    this.scraped$ = this._webScraper.fetchPage(url).pipe(
      map((s: string|void) => s ? s : ''),
      tap(s => console.log('scraped text', s)),
      mergeMap((scraped: string) => {
        return this._llm.doAPrompt(scraped.slice(0, 1500));
      }),
      tap(s => console.log('final', s))
    );

  }



}
