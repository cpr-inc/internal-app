import { Component, OnInit } from '@angular/core';
import { ThemeColors } from '../../shared/const/ThemeColors'
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { AuthService } from '../../core/service/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../shared/class/user'

declare var $: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ThemeColors = ThemeColors
  index: number
  show: boolean = true

  currentUser: User;
  loginState: boolean

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // テーマカラー反映初期
    this.SetThemeColor()

    //サイドバー非表示機能
    $('#leftsidebar').css('display','none')
  }

  ngAfterViewChecked(){
    //サイドバー非表示機能
    // $('#leftsidebar').css('display','none')


    // テーマカラー反映
    $('.demo-choose-skin li').click( ()=> {
      this.SetThemeColor()
    })
  }

  SetThemeColor(){
    //body要素から色の文字列を抽出
    var themeColor = $('body').attr('class');
    var themeColor = themeColor.replace( 'ls-closed', '' );
    var themeColor = themeColor.replace( 'theme-', '' );
    var themeColor = themeColor.replace( ' ', '' );

    let i = 0
    for(let color of ThemeColors){
      if(color.classname === themeColor){
        this.index = i
      } i++
    }

    $('#theme-color').css('background-color',ThemeColors[this.index].hexcolor)
  }

  ShowFrom(){
    this.show = !this.show
  }

  login(f: NgForm): void {
    this.authService.login(f.value.email, f.value.password);
  }

}


