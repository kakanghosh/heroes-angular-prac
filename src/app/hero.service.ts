import { Injectable } from '@angular/core';
import { Hero } from './hero';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { MessageService } from './message.service';
import { catchError, filter, tap, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HeroService {

	private heroesUrl = 'api/heroes';

	private httpOptions: object;

	constructor(private httpClient:HttpClient, private messageService: MessageService) {
		console.log('HeroService');
		this.httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		of(1, 2, 3, 4).pipe(
			tap(el => console.log('Process '+ el),
				err => console.error(err),
				() => console.log('Complete')
			),
			filter(n => n % 2 === 0)
		).subscribe(el => console.log('Even number: '+ el));

		let cities = ["Varanasi", "Mathura", "Ayodhya"];
      	of(cities).pipe(
        	tap(c => console.log(c.length)),
        	map(dataArray => dataArray.join(", "))
     	).subscribe(res => console.log(res));
	}

	getHeroes(): Observable<Hero[]> {
		return this.httpClient.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('HeroService: fetched heroes')),
				catchError(this.handleError('getHeroes', []))
			);
	}

	/** GET hero by id. Will 404 if id not found */
	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.httpClient.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	/** PUT: update the hero on the server */
	updateHero (hero: Hero): Observable<any> {
		return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
			tap(_ => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.httpClient.post(this.heroesUrl, hero, this.httpOptions).pipe(
			tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
			catchError(this.handleError<any>('added hero'))
		);
	}


	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.body.error}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	/** Log a HeroService message with the MessageService */
	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	deleteHero(hero: Hero) {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			// if not search term, return empty hero array.
			return of([]);
		  }
		  return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(x => x.length ?
			   this.log(`found heroes matching "${term}"`) :
			   this.log(`no heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		  );
	}
}
