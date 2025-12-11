import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, ModalController, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../services/api-admin';
import { firstValueFrom } from 'rxjs';
import { MapModalComponent } from './map-modal/map-modal.component';

@Component({
  selector: 'app-fichajes',
  standalone: true,
  templateUrl: './fichajes.page.html',
  styleUrls: ['./fichajes.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, DatePipe],
  providers: [ApiAdminService]
})
export class FichajesPage implements OnInit {

  fichajes: any[] = [];
  usuarios: any[] = [];

  filtroUsuario: number | null = null;
  filtroFecha: string = '';

  constructor(
    private api: ApiAdminService,
    private modalCtrl: ModalController,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
    await this.cargarFichajes();
  }

  async cargarUsuarios() {
    this.usuarios = await firstValueFrom(this.api.getUsuarios()).catch(() => []);
  }

  async cargarFichajes() {
    const filtro: any = {};

    if (this.filtroUsuario) filtro.idUsuario = this.filtroUsuario;

    if (this.filtroFecha) {
      filtro.desde = this.filtroFecha + 'T00:00:00';
      filtro.hasta = this.filtroFecha + 'T23:59:59';
    }

    this.fichajes = await firstValueFrom(this.api.getFichajes(filtro)).catch(() => []);
  }

async abrirMapa(fichaje: any) {
  console.log(" abrirMapa() llamado con:", fichaje);

  const modal = await this.modalCtrl.create({
    component: MapModalComponent,
    componentProps: {
      lat: fichaje.GeolocalizacionLatitud,
      lng: fichaje.GeolocalizacionLongitud,
      usuario: fichaje.NombreUsuario,
      entrada: fichaje.FechaHoraEntrada
    }
  });

  console.log(" Modal creado, llamando a present()");
  await modal.present();
}

  onFechaChange() {
    this.cargarFichajes();
  }

  async cerrarFichaje(f: any) {
    const alert = await this.alert.create({
      header: 'Finalizar fichaje',
      message: `¿Deseas cerrar el fichaje de <strong>${f.NombreUsuario}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Finalizar',
          handler: async () => {
            try {
              await firstValueFrom(this.api.cerrarFichaje(f.IdFichaje));

              const toast = await this.toast.create({
                message: 'Fichaje finalizado correctamente.',
                duration: 2000,
                color: 'success'
              });
              toast.present();

              await this.cargarFichajes();

            } catch (err) {
              const toast = await this.toast.create({
                message: 'Error al finalizar el fichaje.',
                duration: 2000,
                color: 'danger'
              });
              toast.present();
            }
          }
        }
      ]
    });

    alert.present();
  }
}
