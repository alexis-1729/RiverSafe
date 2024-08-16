// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.page.html',
//   styleUrls: ['./login.page.scss'],
// })
// export class LoginPage implements OnInit {

//   loginForm!: FormGroup;
//   constructor(private fb:FormBuilder, private authS: AuthService, private router:Router) {   
    
//   }

//   ngOnInit() {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(4)]],
//       password:['', Validators.required, Validators.minLength(6)]
//     });
//   }

//   onLogin(){
//     if(this.loginForm.valid){
//       this.authS.login(this.loginForm.value).subscribe(
//         (res)=>{
//           console.log('login Exitoso',res);
//           this.router.navigate(['/home']);
//         },
//         (err)=>{
//           console.error('Error en el login', err);
//         }
//       );
//     }
//   }


// }
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.status === 'success') {
        // Login exitoso, navega a la siguiente página
        this.navCtrl.navigateForward('/home');
      } else {
        // Mostrar mensaje de error
        console.log('Login fallido:', response.message);
      }
    }, error => {
      console.error('Error en la petición:', error);
    });
  }
}