import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'pui-layout-main',
	template: `
    <div class="min-h-screen w-screen flex flex-col">
		<pkt-navbar-main></pkt-navbar-main>

		<div class="px-2 md:px-40 py-2.5 dark:text-white overflow-scroll">
			<router-outlet></router-outlet>
			<pkt-tab-bar-main></pkt-tab-bar-main>
		</div>
    </div>
  `,
	styles: [
	]
})
export class LayoutMainComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

}
