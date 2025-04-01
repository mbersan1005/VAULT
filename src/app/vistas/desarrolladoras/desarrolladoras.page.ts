import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiFacade } from '../../facades/api.facade';

@Component({
  selector: 'app-desarrolladoras',
  templateUrl: './desarrolladoras.page.html',
  styleUrls: ['./desarrolladoras.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class DesarrolladorasPage {

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiFacade: ApiFacade,
  ) { }

  ngOnInit() {
  }

}
