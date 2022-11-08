import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { Hospitales } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})

export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospitales[] = [];
  public cargando: boolean = true;
  public hospitalesTemp: Hospitales[] = [];
  public imagenSubs?: Subscription;


  constructor(
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}


  ngOnInit(): void {
    this.cargarHospitales();

    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(1) // esto no es necesario en mi ordenador pero quizá sí en otro más rápido (en 100 o 1000 ms)
      )
      .subscribe((img) => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imagenSubs?.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }


  guardarCambios(hospital: Hospitales) {
    this.hospitalService
      .actualizarHospital(hospital._id, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }


  eliminarHospital(hospital: Hospitales) {
    this.hospitalService.borrarHospital(hospital._id).subscribe((resp) => {
      Swal.fire('Eliminado', hospital.nombre, 'success');
      this.cargarHospitales();
    });
  }


  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      // inputLabel: 'Nuevo Hospital',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
      title: 'Creación de nuevo Hospital',
    });

    if (value!.trim().length == 0) {
      Swal.fire(`Entrada incorrecta`);
    } else {
      this.hospitalService.crearHospital(value!).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital);

        // console.log(resp);
      });
    }
  }


  abrirModal(hospital: Hospitales) {
    // console.log(hospital);

    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id!,
      hospital.img
    );
  }


  // http://localhost:3000/api/todo/coleccion/hospitales/h
  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.hospitales = this.hospitalesTemp);
    }
    this.busquedasService
      .buscar('hospitales', termino)
      .subscribe((resultados) => {
        this.hospitales = resultados;
      });
    return;
  }
}
