import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule]
})
export class LoginPage {

  usuario = '';
  clave = '';

  constructor(
    private api: ApiService,
    private toast: ToastController,
    private router: Router
  ) {}

  async login() {
  try {
    const resp: any = await this.api.login({
      Usuario: this.usuario,
      Clave: this.clave
    }).toPromise();

    if (!resp || !resp.usuario) {
      throw new Error('Login inválido');
    }

    // Guardar al usuario
    localStorage.setItem('usuario', JSON.stringify(resp.usuario));

    // Ir a la pantalla principal
    this.router.navigate(['/registrar'], { replaceUrl: true });

  } catch (e) {
    const t = await this.toast.create({
      message: 'Usuario o contraseña incorrectos',
      duration: 2000,
      color: 'danger'
    });
    t.present();
  }
}

}
