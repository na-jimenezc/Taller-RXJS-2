import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-busqueda',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './barra-busqueda.html',
  styleUrl: './barra-busqueda.css'
})
export class BarraBusqueda {

  //Eventos 
  @Output() onBuscarUsuario = new EventEmitter<string>();
  @Output() onLimpiarBusqueda = new EventEmitter<void>();

  searchForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      username: ['', [Validators.required]]
    });
  }

  //Para emitir el buscar usuario
  buscarUsuario(): void {
    if (this.searchForm.valid && !this.loading) {
      this.loading = true;
      const username = this.searchForm.get('username')?.value;
      this.onBuscarUsuario.emit(username);
    }
  }

  //Limpiar la búsqueda
  limpiarBusqueda(): void {
    this.searchForm.reset();
    this.loading = false;
    this.onLimpiarBusqueda.emit();
  }

  //Presionar el botón
  presionarBusqueda(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.buscarUsuario();
    }
  }

  get campoInvalido(): boolean {
    const campo = this.searchForm.get('username');
    return !!campo && campo.invalid && (campo.dirty || campo.touched);
  }

  get mensajeError(): string {
    const campo = this.searchForm.get('username');
    if (campo?.errors?.['required']) {
      return 'El username es requerido';
    }
    return '';
  }

}
