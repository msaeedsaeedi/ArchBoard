import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  messageService = inject(MessageService);

  public success(title: string, message: string, life = 2000) {
    this.messageService.add({
      severity: 'success',
      life: life,
      summary: title,
      detail: message,
      key: 'g-toast',
      closable: false,
    });
  }

  public info(title: string, message: string, life = 2000) {
    this.messageService.add({
      severity: 'info',
      life: life,
      summary: title,
      detail: message,
      key: 'g-toast',
      closable: false,
    });
  }

  public warn(title: string, message: string, life = 2000) {
    this.messageService.add({
      severity: 'warn',
      life: life,
      summary: title,
      detail: message,
      key: 'g-toast',
      closable: false,
    });
  }

  public error(title: string, message: string, life = 2000) {
    this.messageService.add({
      severity: 'error',
      life: life,
      summary: title,
      detail: message,
      key: 'g-toast',
      closable: false,
    });
  }
}
