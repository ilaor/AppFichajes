import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule]
})
export class InicioPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
