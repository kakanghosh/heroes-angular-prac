import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
	selector: 'app-hero-search',
	templateUrl: './hero-search.component.html',
	styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
	heroes$: Observable<Hero[]>;
	private searchTerms = new Subject<string>();

	constructor(private heroService: HeroService) {
		const subject = new Subject();
		const sub1 = subject.subscribe(value => console.log('sub1: ' + value));
		const sub2 = subject.subscribe(value => console.log('sub2: ' + value));

		subject.next(1);
		subject.next(10);
		subject.next(100);
	}

	search(term: string): void {
		this.searchTerms.next(term);
	}

	ngOnInit(): void {
		this.setSearchHeroObservable();
	}

	setSearchHeroObservable(): void {
		this.heroes$ = this.searchTerms.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((term: string) => this.heroService.searchHeroes(term))
		);
	}
}
