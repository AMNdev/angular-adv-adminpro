import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { FormsModule } from '@angular/forms';
import { DonaComponent } from './dona/dona.component';
import { NgChartsModule } from 'ng2-charts';
import { Grafica1Component } from '../pages/grafica1/grafica1.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    DonaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
  ],
  exports: [
    IncrementadorComponent,
    DonaComponent


  ]
})
export class ComponentsModule { }


// Módulo creado por mi que hay que exportar al pages module.

// esto me sirve para reutilizar componentes de una aplicación a otra.