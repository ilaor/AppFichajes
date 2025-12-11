import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-modal',
  standalone: true,
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class MapModalComponent implements AfterViewInit, OnDestroy {

  @Input() lat!: number;
  @Input() lng!: number;
  @Input() usuario!: string;
  @Input() entrada!: string;

  private map!: L.Map;

  // ❗ NO llames a esta propiedad "modal" para evitar el error de Ionic
  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit(): void {

    // Configuramos el icono por defecto usando las imágenes copiadas desde node_modules
    const iconDefault = L.icon({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    (L.Marker.prototype as any).options.icon = iconDefault;

    // Creamos el mapa
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: 16,
      zoomControl: true
    });

    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcador en las coordenadas del fichaje
    L.marker([this.lat, this.lng])
      .addTo(this.map)
      .bindPopup(`<b>${this.usuario}</b><br>Entrada: ${this.entrada}`)
      .openPopup();

    // Arreglo para cuando el mapa se pinta dentro de un modal
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  cerrar(): void {
    this.modalCtrl.dismiss();
  }
}
