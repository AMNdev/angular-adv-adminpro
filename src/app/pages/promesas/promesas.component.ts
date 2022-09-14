import { Component, OnInit, resolveForwardRef } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    })

    // no es la forma habitual de utilizar promesas en angular

    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('resolve de la promesa');
    //   } else {
    //     reject('reject de la promesa');
    //   }
    // });

    // promesa
    //   .then((msg) => {
    //     console.log('promesa terminada ok:', msg);
    //   })
    //   .catch((err) => console.log('Error en la promesa: ', err));

    // console.log('fin init');
  }

  getUsuarios() {

    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
    })
    
  }
}
