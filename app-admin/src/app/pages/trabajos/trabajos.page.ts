import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../services/api-admin';
import { firstValueFrom } from 'rxjs';
import { TrabajoFormComponent } from './form/trabajo-form.component';

@Component({
  selector: 'app-trabajos',
  standalone: true,
  templateUrl: './trabajos.page.html',
  styleUrls: ['./trabajos.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],

})
export class TrabajosPage implements OnInit {
  trabajos: any[] = [];

  constructor(
    private api: ApiAdminService,
    private alert: AlertController,
    private toast: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.cargarTrabajos();
  }

  async cargarTrabajos() {
    try {
      this.trabajos = await firstValueFrom(this.api.getTrabajos());
    } catch (e) {
      console.error(e);
      this.trabajos = [];
    }
  }

  async eliminarTrabajo(trabajo: any) {
    const alert = await this.alert.create({
      header: 'Eliminar trabajo',
      message: `¿Eliminar el trabajo <strong>${trabajo.Nombre}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await firstValueFrom(this.api.eliminarTrabajo(trabajo.IdTrabajo));

              const toast = await this.toast.create({
                message: 'Trabajo eliminado',
                duration: 2000,
                color: 'success'
              });
              toast.present();

              await this.cargarTrabajos();
            } catch (e) {
              const toast = await this.toast.create({
                message: 'Error al eliminar trabajo, EL TRABAJO ESTÁ ASOCIADO A UN FICHAJE',
                duration: 2000,
                color: 'danger'
              });
              toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async abrirModalTrabajo(trabajo?: any) {
    const modal = await this.modalCtrl.create({
      component: TrabajoFormComponent,
      componentProps: {
        trabajo: trabajo ? { ...trabajo } : { Nombre: '', Descripcion: '' },
        modo: trabajo ? 'editar' : 'crear'
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      await this.cargarTrabajos();
    }
  }
}
