import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {
  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`

  }

  // @Input() progreso: number = 75;
  @Input('valor') progreso: number = 75;
  @Input() btnClass: string = 'btn-primary'
  // get getPorcentaje() {
  //   return `${this.progreso}%`;
  // }

  // para emitir los valores, usamos @Output(). Son de tipo eventEmitter normalmente
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();
  // lo emite con el nombre 'valor'

  cambiarValor(valor: number) {

    this.progreso = this.progreso + valor;
    

    if (this.progreso > 100) {
      this.valorSalida.emit(100)
      return this.progreso = 100;
    }
    if (this.progreso < 0) {
      this.valorSalida.emit(0)
      return this.progreso = 0;
    }

    this.valorSalida.emit(this.progreso)
    return

  }

  onChange(nuevoValor: number) {

    if (nuevoValor > 100) {
      this.progreso = 100;
    } else if (nuevoValor < 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
  }
}
