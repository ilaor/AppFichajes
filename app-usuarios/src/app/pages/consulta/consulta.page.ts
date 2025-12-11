import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-consulta',
  standalone: true,
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, DatePipe]
})
export class ConsultaPage implements OnInit {

  idUsuario = 1;
  fichajes: any[] = [];

  // AHORA el filtro por fecha comienza vacío → muestra todos
  fechaSeleccionada: string | null = null;

  horasMinimas = 0;

  constructor(
    private api: ApiService,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarFichajes();
  }

  async cargarFichajes() {
    let params: any = { idUsuario: this.idUsuario };

    // SOLO aplicamos filtrado por fecha si el usuario elige una
    if (this.fechaSeleccionada) {
      const fecha = new Date(this.fechaSeleccionada);
      params.desde = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0).toISOString();
      params.hasta = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59).toISOString();
    }

    try {
      const data = await firstValueFrom(this.api.listarFichajes(params)) || [];

      // Filtro por horas (siempre activo)
      this.fichajes = data.filter((f: any) =>
        (f.HorasTrabajadas ?? 0) >= this.horasMinimas ||
        f.FechaHoraSalida == null
      );

    } catch (err) {
      console.error('Error cargando fichajes', err);
      this.fichajes = [];
    }
  }

  async onFechaChange(event: any) {
    this.fechaSeleccionada = event.detail?.value || null;
    await this.cargarFichajes();
  }

  async onHorasMinimasChange(event: any) {
    this.horasMinimas = Number(event.detail.value);
    await this.cargarFichajes();
  }

  async cerrarFichaje(fichaje: any) {
    const alert = await this.alert.create({
      header: 'Finalizar fichaje',
      message: `¿Deseas finalizar el fichaje?`,
      buttons: [
        { text: 'NO', role: 'cancel' },
        {
          text: 'Sí, finalizar',
          handler: async () => {
            try {
              await firstValueFrom(this.api.cerrarFichaje(fichaje.IdFichaje));
              await this.cargarFichajes();
            } catch (e) {
              const toast = await this.toast.create({
                message: 'Error al cerrar el fichaje.',
                duration: 2000,
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
