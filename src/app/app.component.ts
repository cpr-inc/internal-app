import { Component } from '@angular/core';
import { TodoTableDateList } from './shared/const/TodoTableData'
import { NotificationsList } from './shared/const/Notifications'
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './shared/class/user'
import { AuthService } from './core/service/auth.service';
import { UserService } from './core/service/user.service'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { format } from 'date-fns/esm'
import { ja } from 'date-fns/esm/locale'
import swal from 'sweetalert2'

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  NotificationsList = NotificationsList

  newdata = []

  TableDateList=TodoTableDateList

  currentUser: User;
  

  //初期表示設定
  content: string

  loginState: boolean

  isloading: boolean = true;

  users: User[];
  usersRef: AngularFireList<any>;
  userdata: any

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private authService: AuthService,
    private userService: UserService
  ) { 
    // if (this.afAuth.auth.currentUser) {
    //   this.currentUser = new User(this.afAuth.auth.currentUser);
    //   this.content = "業務月報"
    //   this.Getcontent()
    //   console.log(this.content)
    // }
    // else{
    //   this.content = "ログイン"
    //   this.Getcontent()
    //   console.log(this.content)
    // }
    this.content = "業務月報"
    this.usersRef = db.list('/users');
   }

  ngOnInit() {
    if (this.afAuth.auth.currentUser) {
      this.currentUser = new User(this.afAuth.auth.currentUser);
      this.loginState = true
      this.isloading = false;
      $('.sidebar').css('display','block')
      $('#login').css('display','none')
      $('#content').css('display','block')
      // $('.info-container .name').html(this.currentUser.displayName)
      // this.userdata = new User(this.db.object(`/users/${this.currentUser.uid}`).valueChanges());
    } else {
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.currentUser = new User(this.afAuth.auth.currentUser);
          this.loginState = true
          $('.sidebar').css('display','block')
          $('#login').css('display','none')
          $('#content').css('display','block')

          this.db.object(`/users/${this.currentUser.uid}`).valueChanges().subscribe(user => {
            this.userdata = user
          })
          //valueChanges待
          setTimeout(() => {
            if(this.currentUser){
              if(this.userdata){
                this.db.object(`/users/${this.currentUser.uid}`).update({islogin: true})
                this.db.object(`/users/${this.currentUser.uid}`).update({logindate: format(new Date(), 'YYYY/MM/DD HH:mm', {locale: ja})})
              }
            }
          },2000)
        } else {
          this.currentUser = new User("")
          this.loginState = false
          $('.sidebar').css('display','none')
          $('#login').css('display','block')
          $('#content').css('display','none')
        }
        this.isloading = false;
      });
    }

    let that = this
    //画面を閉じたときにisloginをfalse
    window.addEventListener('beforeunload', function(event) {
      if(that.currentUser){
        if(that.currentUser.uid){
          that.db.object(`/users/${that.currentUser.uid}`).update({islogin: false})
        }
        setTimeout(() => { },300);
      }
    });

    //isloginをブラウザ、タブが非アクティブのとき切り替え
    window.addEventListener('focus', () => {
      if(this.currentUser){
        if(this.currentUser.uid){
          this.isloginChanges(true)
        }
      }
    });
    window.addEventListener('blur', () => {
      if(this.currentUser){
        if(this.currentUser.uid){
          this.isloginChanges(false)
        }
      }
    });

  }

  isloginChanges(loginState: boolean){
    this.db.object(`/users/${this.currentUser.uid}`).update({islogin: loginState})
  }

  Getcontent(){
    return this.loginState
  }

  SetNotifyClass(index: number){
    return 'icon-circle ' + this.NotificationsList[index].classname
  }

  LeftNavItems = [
    {name: '業務月報', icon: 'assignment', active: true},
    {name: '交通費精算', icon: 'train', active: false},
    {name: 'TODOリスト', icon: 'event_available', active: false},
    {name: 'ドキュメント', icon: 'get_app', active: false},
    // {name: 'ユーザ一覧', icon: 'people', active: false},
    {name: 'ユーザ一覧', icon: 'airplay', active: false},
  ]

  SetContent(LeftNavItem_name: string, index: number){
    this.content = LeftNavItem_name;

    this.SetActiveMenu(LeftNavItem_name, index)
  }

  SetActiveMenu(LeftNavItem_name: string, index: number){
    for(let item of this.LeftNavItems){
      item.active = false
    }
    this.LeftNavItems[index].active = true
  }

  GetActive(index: number){
    return this.LeftNavItems[index].active
  }

  SetNew(index){
    return this.newdata[index]
  }

  ngAfterViewInit() {
    //サイドバー非表示機能
    var $body = $('body');
    var $overlay = $('.overlay');
    $('#leftsidebar .menu li a').click(function () {
        $body.removeClass('overlay-open');
        $overlay.css('display','none');
    });
  }

  ngAfterViewChecked(){
    if(this.userdata){
      $('.info-container .name').html(this.userdata.displayName)
      $('.info-container .email').html(this.userdata.email)
      $('.info-container .dept').html(this.userdata.department)
    }

  }

  logout(){
    this.isloginChanges(false)
    this.authService.logout();
    $('.overlay').css('display','none');
  }

  newPassword: string
  authPassword: string
  passwordState1: any = true
  passwordState2: any = true

  inputPassword(){
    let reg = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i
    this.passwordState1 = this.newPassword.match(reg)
  }

  checkPassword(){
    this.passwordState2 = this.newPassword == this.authPassword
  }

  passwordState(){
    if(this.passwordState1===true){
      return true
    }
    else if(this.passwordState1!=null){
      if(this.newPassword === this.authPassword){
        return false
      }
      else{
        return true
      }
    }
    else{
      return true
    }
  }

  updatePassword(){
    this.userService.updatePassword(this.newPassword);
    $('#updatePasswordModal').modal('hide')
    this.newPassword = ""
    this.authPassword = ""
    this.passwordState1 = true
    this.passwordState2 = true
  }

  cancel(){
    $('#updatePasswordModal').modal('hide')
    this.newPassword = ""
    this.authPassword = ""
    this.passwordState1 = true
    this.passwordState2 = true
  }

}