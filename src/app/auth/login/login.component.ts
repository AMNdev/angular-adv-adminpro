import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn')
  googleBtn!: ElementRef;

  public formSubmitted = false;

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: [
        localStorage.getItem('email') || '',
        [Validators.required, Validators.email],
      ],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '405736979575-iq595dr1h1d4g370ga6799dl5ofshlre.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
      // si no pongo el this así, me cambia hacia donde apunta el this
    });

    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential).subscribe((resp) => {
      // console.log({login: resp});
      this.ngZone.run(() => {
        this.router.navigateByUrl('/dashboard');
      });
    });
  }

  login() {
    const recordar = this.loginForm.get('remember')?.value;
    const correo = this.loginForm.get('email')?.value;
    this.usuarioService.login(this.loginForm.value).subscribe({
      next(resp: any) {
        if (recordar) {
          localStorage.setItem('email', correo);
        } else {
          localStorage.removeItem('email');
        }
      },
      error(err: { error: { msg: string | undefined } }) {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
    this.router.navigateByUrl('/');

    // this.router.navigateByUrl('/')
    // console.log(this.loginForm.value);
  }
}

