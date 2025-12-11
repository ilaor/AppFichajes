import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:8080';
  private API_KEY = 'DISM-KEY-123'; // si activas middleware

  constructor(private http: HttpClient,
    private router: Router
  ) {}

  private headers() {
    return new HttpHeaders({
      // 'x-api-key': this.API_KEY
    });
  }

  getTrabajos() {
    return this.http.get<any[]>(`${this.BASE_URL}/trabajos`, { headers: this.headers() });
  }

  getUltimoFichaje(idUsuario: number) {
    const params = new HttpParams().set('idUsuario', idUsuario);
    return this.http.get<any>(`${this.BASE_URL}/fichajes/ultimo`, { headers: this.headers(), params });
  }

  iniciarFichaje(dto: any) {
    return this.http.post<any>(`${this.BASE_URL}/fichajes`, dto, { headers: this.headers() });
  }

  cerrarFichaje(id: number) {
    return this.http.put<any>(`${this.BASE_URL}/fichajes/${id}/cerrar`, {}, { headers: this.headers() });
  }

  listarFichajes(filtro: any) {
    let params = new HttpParams();
    if (filtro.idUsuario) params = params.set('idUsuario', filtro.idUsuario);
    if (filtro.desde) params = params.set('desde', filtro.desde);
    if (filtro.hasta) params = params.set('hasta', filtro.hasta);
    return this.http.get<any[]>(`${this.BASE_URL}/fichajes`, { headers: this.headers(), params });
  }

  login(dto: { Usuario: string; Clave: string }) {
  return this.http.post(`${this.BASE_URL}/login`, dto, { headers: this.headers() });
}

logout() {
  localStorage.removeItem('usuario');
  this.router.navigate(['/login'], { replaceUrl: true });
}


}
