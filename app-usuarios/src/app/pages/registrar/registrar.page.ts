import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';



@Component({
  selector: 'app-registrar',
  standalone: true,
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RegistrarPage implements OnInit {

  trabajos: any[] = [];
  idUsuario = 1;
  seleccionado?: number;
  estado: 'cargando' | 'libre' | 'activo' = 'cargando';
  ultimo: any = null;

  constructor(
    private api: ApiService,
    private alert: AlertController,
    private router: Router
  ) {}


  async ngOnInit() {
    const user = localStorage.getItem('usuario');
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    try {
      this.trabajos =
        (await this.api.getTrabajos().toPromise().catch(() => [])) || [];

      this.ultimo =
        await this.api.getUltimoFichaje(this.idUsuario).toPromise().catch(() => null);


      this.estado =
        this.ultimo && !this.ultimo.FechaHoraSalida ? 'activo' : 'libre';
    } catch (e) {
      console.error(e);
      this.estado = 'libre';
    }
  }

  async iniciar() {
    try {
      let lat: number | undefined;
      let lon: number | undefined;

      try {
        const pos = await Geolocation.getCurrentPosition();
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        // Si falla la geolocalización, seguimos sin GPS
      }

      if (!this.seleccionado) {
        await this.mensaje('Selecciona un trabajo antes de iniciar.');
        return;
      }

      const r = await this.api.iniciarFichaje({
        IdUsuario: this.idUsuario,
        IdTrabajo: this.seleccionado,
        GeolocalizacionLatitud: lat,
        GeolocalizacionLongitud: lon
      }).toPromise();

      await this.mensaje(`Fichaje iniciado (ID: ${r.idFichaje})`);

      this.ultimo = await this.api.getUltimoFichaje(this.idUsuario).toPromise();
      this.estado =
        this.ultimo && !this.ultimo.FechaHoraSalida ? 'activo' : 'libre';

    } catch (e: any) {
      console.error(e);

      if (e?.status === 409) {
        await this.mensaje('Ya tienes un fichaje activo. Refresca el estado.');
      } else {
        await this.mensaje('Error iniciando fichaje');
      }
    }
  }

  async cerrar() {
    try {
      if (!this.ultimo) {
        await this.mensaje('No hay fichaje activo');
        return;
      }

      await this.api.cerrarFichaje(this.ultimo.IdFichaje).toPromise();
      await this.mensaje('Fichaje cerrado');

      this.ultimo = await this.api.getUltimoFichaje(this.idUsuario).toPromise();
      this.estado =
        this.ultimo && !this.ultimo.FechaHoraSalida ? 'activo' : 'libre';

    } catch (e) {
      console.error(e);
      await this.mensaje('Error cerrando fichaje');
    }
  }

  private async mensaje(texto: string) {
    const a = await this.alert.create({ message: texto, buttons: ['OK'] });
    await a.present();
  }



}
