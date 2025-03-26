import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private router: Router


  ) {}

  openPage(page: string) {

    switch (page) {
      
      case 'home':
        this.router.navigate(['/home']);
      break;
    
      case 'generos':
        this.router.navigate(['/generos']);
      break;

      case 'plataformas':
        this.router.navigate(['/plataformas']);
      break;

      case 'tiendas':
        this.router.navigate(['/tiendas']);
      break;

      case 'desarrolladoras':
        this.router.navigate(['/desarrolladoras']);
      break;

      case 'publishers':
        this.router.navigate(['/publishers']);
      break;
  
      case 'sobreNosotros':
        this.router.navigate(['/sobreNosotros']);
      break;

      case 'admin-login':
        this.router.navigate(['/admin-login']);
      break;

      default:
        break;
    }

    this.menu.close();

  }

}
