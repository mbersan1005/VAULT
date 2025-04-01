import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../facades/api.facade';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.page.html',
  styleUrls: ['./tiendas.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class TiendasPage {

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
  }

}
