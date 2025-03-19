import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onLogin() {
    this.http.post(`${environment.apiUrl}/users/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('userLocal', response.user.local);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        alert(error.error?.message || 'Usuário ou senha inválidos!');
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
