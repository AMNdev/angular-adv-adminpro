import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// con esto le decimos a angular que la función customInitFunctions existe globalmente aunque no lo sepa, y puede ser llamada sin problemas
declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    customInitFunctions();    

  }

}


