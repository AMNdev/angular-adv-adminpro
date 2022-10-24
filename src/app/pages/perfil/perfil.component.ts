import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario?: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    // console.log(this.perfilForm?.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      (resp) => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario!.nombre = nombre;
        this.usuario!.email = email;

        // modal sweetalert
        Swal.fire({
          position: 'bottom-start',
          icon: 'info',
          title: 'Usuario actualizado',
          showConfirmButton: true,
          timer: 2000,
        });
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
        // console.log(err.error.msg);
      }
    );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return (this.imgTemp = null);
    }
    // a partir de aqui solo funciona si hay imagen seleccionada

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
    return true;
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario!.uid!)
      .then((img) => {
        this.usuario!.img = img;
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Imagen actualizada',
          showConfirmButton: true,
          timer: 2000,
        });
      }).catch(err => {
        console.log(err);
        Swal.fire('Error', 'Imposible', 'error');
        
      })
  }
}
