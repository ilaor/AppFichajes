import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../services/api-admin';
import { firstValueFrom } from 'rxjs';
import { UsuarioFormComponent } from './form/usuario-form.component';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule] ,

})

export class UsuariosPage implements OnInit {
  usuarios: any[] = [];

  constructor(
    private api: ApiAdminService,
    private alert: AlertController,
    private toast: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
  try {
    this.usuarios = await firstValueFrom(this.api.getUsuarios());
  } catch (e) {
    console.error(e);
    this.usuarios = [];
  }
 }
  async abrirModalUsuario(usuario?: any) {
  const modal = await this.modalCtrl.create({
    component: UsuarioFormComponent,
    componentProps: {
      usuario: usuario ? { ...usuario } : { Nombre: '', Usuario: '', Clave: '' },
      modo: usuario ? 'editar' : 'crear'
    }
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) {
    await this.cargarUsuarios();
  }
}

 async eliminarUsuario(usuario: any) {
  const alert = await this.alert.create({
    header: 'Eliminar usuario',
    message: `¿Seguro que deseas eliminar a <strong>${usuario.Nombre}</strong>?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          try {
            await firstValueFrom(this.api.eliminarUsuario(usuario.IdUsuario));
            const toast = await this.toast.create({
              message: 'Usuario eliminado correctamente.',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            await this.cargarUsuarios();
          } catch (e) {
            const toast = await this.toast.create({
              message: 'Error al eliminar usuario. EL ERROR ESTÁ ASOCIADO A UN FICHAJE',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
          }
        }
      }
    ]
  });
  await alert.present();
}
}
