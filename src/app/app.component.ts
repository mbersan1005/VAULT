import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SesionService } from './services/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private router: Router,
    public sesion: SesionService,
  
  ) {}

  openPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.menu.close();
  }

  logout() {
    this.sesion.establecerSesion(false);
    this.router.navigate(['/home']);
    this.menu.close();
  }

}
