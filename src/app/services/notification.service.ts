import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Sucesso') {
    this.toastr.success(message, title);
  }

  showInfo(message: string, title: string = 'Informação') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Atenção') {
    this.toastr.warning(message, title);
  }

  showError(message: string, title: string = 'Erro') {
    this.toastr.error(message, title);
  }
}
