import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, flatMap, from, map, mergeMap, of, startWith, tap } from 'rxjs';
import { WebScraperService } from './web-scraper.service';
import { OpenAiService } from './open-ai.service';
import { getCurrentTab, isChrome } from '../background';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'media-pedia';

  constructor(private _webScraper: WebScraperService, private _llm: OpenAiService, private _http: HttpClient) {}

  url$: BehaviorSubject<any> = new BehaviorSubject('');
  thinking$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  scraped$: Observable<string> = EMPTY;
  isChromeExt$: BehaviorSubject<boolean> = new BehaviorSubject(true);


  ngOnInit() {
    this.isChromeExt$.next(isChrome());
    console.log('Is Chrome?', this.isChromeExt$.value);
    if (this.isChromeExt$.value) {
      getCurrentTab().then((tab) => {
        this.url$.next((tab as any).url)
        this.mediapedia(this.url$.value);
      });
    }
  }

  mediapedia(url: string) {
    this.thinking$.next(true);
    this.scraped$ = this._http.get<string>('fetch', {
      params: {url: url}
    }).pipe(
      map((s: string|void) => s ? s : ''),
      tap(s => console.log('scraped text', s)),
      mergeMap((scraped: string) => {
        return this._llm.doAPrompt(scraped);
      }),
      tap(s => {
        console.log('answer', s);
        this.thinking$.next(false);
      })
    );
  }



}
