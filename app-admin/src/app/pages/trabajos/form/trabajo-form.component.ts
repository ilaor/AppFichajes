import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../../services/api-admin';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-trabajo-form',
  standalone: true,
  templateUrl: './trabajo-form.component.html',
  //styleUrls: ['./trabajo-form.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  providers: [ApiAdminService]
})
export class TrabajoFormComponent {
  @Input() trabajo: any = { Nombre: '', Descripcion: '' };
  @Input() modo: 'crear' | 'editar' = 'crear';

  constructor(
    private modal: ModalController,
    private api: ApiAdminService,
    private toast: ToastController
  ) {}

  cerrar() {
    this.modal.dismiss();
  }

  async guardar() {
    try {
      if (this.modo === 'crear') {
        await firstValueFrom(this.api.crearTrabajo(this.trabajo));
      } else {
        await firstValueFrom(this.api.actualizarTrabajo(this.trabajo.IdTrabajo, this.trabajo));
      }

      const t = await this.toast.create({
        message: this.modo === 'crear' ? 'Trabajo creado' : 'Trabajo actualizado',
        duration: 2000,
        color: 'success'
      });
      t.present();

      this.modal.dismiss(true);
    } catch (e) {
      const t = await this.toast.create({
        message: 'Error al guardar trabajo',
        duration: 2000,
        color: 'danger'
      });
      t.present();
    }
  }
}
