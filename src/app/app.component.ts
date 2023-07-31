import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, flatMap, from, map, mergeMap, of, shareReplay, startWith, tap, zip } from 'rxjs';
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
  fetched$: Observable<string> = EMPTY;
  objectivity$: Observable<string> = EMPTY;
  summary$: Observable<string> = EMPTY;
  clarity$: Observable<string> = EMPTY;
  sophistication$: Observable<string> = EMPTY;
  isChromeExt$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  @ViewChild('url', {static: false}) inputControl: ElementRef = {} as ElementRef;

  ngOnInit() {
    this.isChromeExt$.next(isChrome());
    console.log('Is Chrome?', this.isChromeExt$.value);
    if (this.isChromeExt$.value) {
      getCurrentTab().then((tab) => {
        this.url$.next((tab as any).url)
        this.mediapedia(this.url$.value);
      });
    }

    this.fetched$ = this.url$.pipe(
      mergeMap((url: string) => url ? this._http.get<string>('fetch', {
        params: {url: url}
      }) : of('') ),
      map((s: string|void) => s ? s : ''),
      tap(s => console.log('scraped text', s)),
      shareReplay(1)
    );
    this.summary$ = this.fetched$.pipe(
      mergeMap((scraped: string) => {
        return scraped ? this._llm.summary(scraped) : of('');
      })
    );
    this.objectivity$ = this.fetched$.pipe(
      mergeMap((scraped: string) => {
        return scraped ? this._llm.objectivity(scraped) : of('');
      })
    );
    this.sophistication$ = this.fetched$.pipe(
      mergeMap((scraped: string) => {
        return scraped ? this._llm.sophistication(scraped) : of('');
      })
    );
    this.clarity$ = this.fetched$.pipe(
      mergeMap((scraped: string) => {
        return scraped ? this._llm.clarity(scraped) : of('');
      }),
      tap(s => {
        this.thinking$.next(false);
      })
    );

    zip(this.summary$, this.objectivity$, this.sophistication$, this.clarity$).subscribe(() => this.thinking$.next(false));
  }

  mediapedia(url: string) {    
    this.thinking$.next(true);
    this.url$.next(url);
  }

  clear() {
    this.url$.next('');
    this.inputControl.nativeElement.value = '';
    this.inputControl.nativeElement.focus();
  }

}
