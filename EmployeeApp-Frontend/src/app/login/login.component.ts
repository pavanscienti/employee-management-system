import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  onSubmit(): void {
    const loginData = { username: this.username, password: this.password };
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(loginData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };

    fetch("http://127.0.0.1:8000/login/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const accessToken = data.token;
        localStorage.setItem("empToken",accessToken);
        // Store the token in the authentication service
        this.authService.setAccessToken(accessToken);

        // Navigate to the employee route upon successful authentication
        this.router.navigateByUrl('/employee');
      })
      .catch((error) => console.error('Error:', error));
  }
}
