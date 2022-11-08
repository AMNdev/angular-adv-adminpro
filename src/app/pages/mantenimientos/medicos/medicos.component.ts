import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private medicosTemp: Medico[] = [];
  private imagenSubs?: Subscription;

  constructor(
    private medicoService: MedicoService,
    public modalImagenService: ModalImagenService,
    public busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imagenSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(1) // esto no es necesario en mi ordenador pero quizá sí en otro más rápido (en 100 o 1000 ms)
      )
      .subscribe((img) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
    });

    // medicoservice
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.medicos = this.medicosTemp);
    }
    this.busquedasService.buscar('medicos', termino).subscribe((resultados) => {
      this.medicos = resultados;
    });
    return;
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de eliminar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar definitivamente',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!).subscribe((resp) => {
          this.cargarMedicos();
          Swal.fire(
            'Médico eliminado',
            `${medico.nombre} definitivamente eliminado`,
            'success'
          );
        });
      }
    });
    return;
  }
}
