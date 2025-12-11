import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiAdminService {
  private BASE_URL = 'http://localhost:8080';


  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get<any[]>(`${this.BASE_URL}/usuarios`);
  }

  crearUsuario(dto: any) {
    return this.http.post(`${this.BASE_URL}/usuarios`, dto);
  }

  actualizarUsuario(id: number, dto: any) {
    return this.http.put(`${this.BASE_URL}/usuarios/${id}`, dto);
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.BASE_URL}/usuarios/${id}`);
  }

  getTrabajos() {
    return this.http.get<any[]>(`${this.BASE_URL}/trabajos`);
  }

  crearTrabajo(dto: any) {
    return this.http.post(`${this.BASE_URL}/trabajos`, dto);
  }

  actualizarTrabajo(id: number, dto: any) {
    return this.http.put(`${this.BASE_URL}/trabajos/${id}`, dto);
  }

  eliminarTrabajo(id: number) {
    return this.http.delete(`${this.BASE_URL}/trabajos/${id}`);
  }

  getFichajes(filtro: { idUsuario?: number; desde?: string; hasta?: string }) {
    let params = new HttpParams();
    if (filtro.idUsuario) params = params.set('idUsuario', filtro.idUsuario);
    if (filtro.desde) params = params.set('desde', filtro.desde);
    if (filtro.hasta) params = params.set('hasta', filtro.hasta);
    return this.http.get<any[]>(`${this.BASE_URL}/fichajes`, { params });
  }

  cerrarFichaje(id: number) {
  return this.http.put(`${this.BASE_URL}/fichajes/${id}/cerrar`, {});
}

}
