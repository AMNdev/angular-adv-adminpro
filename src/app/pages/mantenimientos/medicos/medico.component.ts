import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Hospitales } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospitales[] = [];
  public hospitalSeleccionado?: Hospitales;
  public medicoSeleccionado?: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });

    this.cargarHospitales();
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }

    this.medicoService
      .obtenerMedicoPorId(id)
      .pipe(delay(100))
      .subscribe({
        next: (medico) => {
          const {
            nombre,
            hospital: { _id },
          } = medico;
          this.medicoForm.setValue({ nombre, hospital: _id });
          this.medicoSeleccionado = medico;
        },
        error: (error) => {
          console.log(error);
          console.log('Medico no encontrado');
          return this.router.navigateByUrl(`/dashboard/medicos`);
        },
        complete: () => {},
      });

    // this.medicoService.obtenerMedicoPorId(id).subscribe((medico) => {
    //   if (!medico) {
    //     console.log('nomedico');
    //     return this.router.navigateByUrl(`/dashboard/medicos`)
    //   }
    //   const {
    //     nombre,
    //     hospital: { _id },
    //   } = medico;
    //   this.medicoForm.setValue({ nombre, hospital: _id });
    //   this.medicoSeleccionado = medico;
    //   return
    // });
  }

  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospitales[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      // console.log(data);
      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        Swal.fire(
          'Médico actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      // crear
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire(
            'Médico añadido',
            `${nombre} añadido correctamente`,
            'success'
          );
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
