import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../shared/class/user';
import { RecursiveTemplateAstVisitor } from '@angular/compiler';
import swal from 'sweetalert2'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) { }

  create(email: string, password: string, userdata:any) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        let uid = user.user.uid
        userdata.uid = uid
        this.db.object(`/users/${uid}`).set(new User(userdata));
      })
      .catch(error => console.error(error));
  }

  update(values): void {
    this.afAuth.auth.currentUser.updateProfile(values)
      .then(() => {
        this.db.object(`/users/${this.afAuth.auth.currentUser.uid}`).update(values)
      })
      .catch(error => console.error(error));
  }



  updatePassword(newPassword: string){
    this.afAuth.auth.currentUser.updatePassword(newPassword).then(() => {
      swal({
        customClass: 'swal-modal',
        title: 'パスワード変更完了',
        type: 'success',
      })
    }).catch((error) => {
      if(error.code==="auth/requires-recent-login"){
        swal({
          customClass: 'swal-modal',
          title: 'パスワード設定に失敗しました。',
          text: '最近のログインから時間が経っています。一旦ログアウトし、ログイン後にお試しください。',
          type: 'warning',
        })
      }
    });
  }
}