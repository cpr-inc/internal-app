import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import swal from 'sweetalert2'


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authSubject = new Subject<any>();
  auth$ = this.authSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth) { }

  login(email: string, password: string): void {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
      })
      .catch((error) => {
        if(error.code==="auth/invalid-email"){
          swal({
            customClass: 'swal-modal',
            text: '入力されたメールアドレスが無効です。',
            type: 'warning',
          })
        }
        if(error.code==="auth/user-not-found"){
          swal({
            customClass: 'swal-modal',
            text: '入力されたメールアドレスは登録されていません。',
            type: 'warning',
          })
        }
        if(error.code==="auth/wrong-password"){
          swal({
            customClass: 'swal-modal',
            text: 'パスワードが違います。',
            type: 'warning',
          })
        }
      });
  }

  logout(): void {
    this.afAuth.auth.signOut()
      .then(() => {
      })
      .catch(error => console.error(error));
  }

}