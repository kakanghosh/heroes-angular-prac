import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
	selector: 'app-heroes',
	templateUrl: './heroes.component.html',
	styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

	selectedHero: Hero;

	heroes: Hero[];

	constructor(private heroService: HeroService, private messageService: MessageService) {
		console.log('HeroesComponent');
	}

	ngOnInit(): void {
		 this.heroService.getHeroes()
			 .subscribe((heroes) => this.heroes = heroes);
	}

	onSelectHero(hero: Hero): void {
		if (hero === this.selectedHero) {
			this.selectedHero = undefined;
		} else {
			this.messageService.add(`HeroService: Selected hero id=${hero.id}`);
			this.selectedHero = hero;
		}
	}

	add(value: string) {
		const name = value.trim();
		if (!name) { return; }
		this.heroService.addHero({ name } as Hero)
			.subscribe(hero => {
				this.heroes.push(hero);
			});
	}

	delete(hero: Hero) {
		this.heroes = this.heroes.filter(h => h !== hero);
		this.heroService.deleteHero(hero).subscribe();
	}
}
