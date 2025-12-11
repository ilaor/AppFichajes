import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = 'http://localhost:8080';


  constructor(private http: HttpClient) {}

  private headers() {

    return new HttpHeaders();
  }

  getTrabajos() {
    return this.http.get<any[]>(`${this.BASE_URL}/trabajos`, { headers: this.headers() });
  }

  getUltimoFichaje(idUsuario: number) {
    const params = new HttpParams().set('idUsuario', idUsuario);
    return this.http.get<any>(`${this.BASE_URL}/fichajes/ultimo`, { headers: this.headers(), params });
  }

  iniciarFichaje(dto: { IdUsuario:number; IdTrabajo:number; GeolocalizacionLatitud?:number; GeolocalizacionLongitud?:number; }) {
    return this.http.post<any>(`${this.BASE_URL}/fichajes`, dto, { headers: this.headers() });
  }

  cerrarFichaje(idFichaje: number) {
    return this.http.put<any>(`${this.BASE_URL}/fichajes/${idFichaje}/cerrar`, {}, { headers: this.headers() });
  }

  listarFichajes(filtro: { idUsuario?:number; desde?:string; hasta?:string; }) {
    let params = new HttpParams();
    if (filtro.idUsuario) params = params.set('idUsuario', filtro.idUsuario);
    if (filtro.desde)     params = params.set('desde', filtro.desde);
    if (filtro.hasta)     params = params.set('hasta', filtro.hasta);
    return this.http.get<any[]>(`${this.BASE_URL}/fichajes`, { headers: this.headers(), params });
  }

  getDireccionDesdeCoordenadas(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  return this.http.get<any>(url);
}

}
