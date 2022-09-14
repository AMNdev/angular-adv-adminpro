import { Component, OnDestroy,  } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {
    

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   {
    //     next:(value) =>console.log(value),
    //     error:(err) =>console.warn('Error: ', err),
    //     complete:()=> console.info('Obs terminado'),
    //   }


      // hacerlo así está obsoleto
      // valor => console.log('Subs: ', valor),
      // error => console.warn('Error: ', error),
      // () => console.info('Obs terminado')

    
    // );

    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);

   }

  
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }


  
  retornaIntervalo(): Observable<number> {
    return interval(100)
      .pipe(
        // take(10),
        filter(valor => (valor % 2) ? true : false),
        map(valor => 1 + valor),
      );
    
  }
  


  retornaObservable(): Observable<number> {
    let i = -1;
    
    const obs$ = new Observable<number>(observer => {

      
      const intervalo = setInterval(() => {
        // console.log('tic');
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo)
          observer.complete();
        }

        if (i === 2) {
          observer.error('i ha llegado a 2');
          
        }
      }, 1000)
    });

    return obs$;
  }

}
