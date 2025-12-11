import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../../services/api-admin';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  providers: [ApiAdminService]  
})
export class UsuarioFormComponent {
  @Input() usuario: any = { Nombre: '', Usuario: '', Clave: '' }; // datos iniciales
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
        await firstValueFrom(this.api.crearUsuario(this.usuario));
      } else {
        await firstValueFrom(this.api.actualizarUsuario(this.usuario.IdUsuario, this.usuario));
      }
      const t = await this.toast.create({
        message: this.modo === 'crear' ? 'Usuario creado' : 'Usuario actualizado',
        duration: 2000,
        color: 'success'
      });
      await t.present();
      this.modal.dismiss(true); // ✅ devolver señal de éxito
    } catch (e) {
      console.error(e);
      const t = await this.toast.create({
        message: 'Error al guardar el usuario',
        duration: 2000,
        color: 'danger'
      });
      await t.present();
    }
  }
}
