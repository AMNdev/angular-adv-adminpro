import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

// con esto le decimos a angular que la función customInitFunctions existe globalmente aunque no lo sepa, y puede ser llamada sin problemas
declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    customInitFunctions();    

    this.sidebarService.cargarMenu();
    // console.log(this.sidebarService.menu);
  }

}


