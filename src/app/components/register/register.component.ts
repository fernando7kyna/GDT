import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface UserData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  local: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: UserData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    local: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onRegister() {
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userDataToSend } = this.userData;

    this.http.post(`${environment.apiUrl}/users/register`, userDataToSend)
      .subscribe({
        next: (response) => {
          alert('Conta criada com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert('Erro ao criar conta: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
} 