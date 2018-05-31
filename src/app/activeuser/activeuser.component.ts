import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { User } from '../shared/class/user'
import { UserService } from '../core/service/user.service'
import { AuthService } from '../core/service/auth.service'

declare var jquery:any;  // jquery
declare var $ :any; // jquery

declare var autosize :any; // autosize

const UserInfoCol=[
  '選択',
  'ログイン状態',
  '社員番号',
  '氏名',
  '部署',
  '役職',
  'メールアドレス',
  'その他',
  '最終ログイン日時',
]

@Component({
  selector: 'app-activeuser',
  templateUrl: './activeuser.component.html',
  styleUrls: ['./activeuser.component.scss']
})
export class ActiveuserComponent implements OnInit {

  TableColItems = UserInfoCol

  @Input() currentUser

  users: User[];
  usersRef: AngularFireList<any>;
  newusers: any = { users: [] };

  uid: string;

  newUser: any
  email: string = "";
  displayName: string = "";
  firstname: string = "";
  lastname: string = "";
  No: number = null;
  department: string = "";
  position: string = "";
  other: string = "";
  password: string = "";

  bk: any

  table: any = $('.js-basic-example');

  userID: any = []

  selectUid: number

  constructor(
    private chRef: ChangeDetectorRef,
    private db: AngularFireDatabase,
    private userService: UserService,
    private authService: AuthService) {
    this.usersRef = db.list('/users');
   }

  ngOnInit() {
    // trashtask以外
    this.usersRef.snapshotChanges()
    .subscribe(snapshots => {
      this.users = snapshots.map(snapshot => {
        const values = snapshot.payload.val();
        return new User({ key: snapshot.payload.key, ...values });
      });
      //snapshotsで取り込んだデータがキーの値を降順にムリヤリするので0.3秒後の
      //dbData = this.usersが同じ時のみデータ取り込み（並べ替えが終わったとき）
      let dbData = this.users
      setTimeout(() => {
        if(dbData === this.users){
          //値の反映まち（必要なさそう）
          let i = 0
          this.newusers = { users: [] };
    
          for(let user of this.users){
            //値が無いとjquery data tableがエラーになるので対策
            if(!user.position){user.position=""}
            if(!user.other){user.other=""}
            if(!user.logindate){user.logindate=""}
    
            //ログイン中ならアイコン表示
            let islogin = '<div><i class="material-icons">check_circle</i></div>'
            if(!user.islogin){
              islogin =""
            }
    
            //ラジオボタンのHTML格納
            let radioButton = '<span><input name="group" type="radio" class="with-gap" id="radio_'+ i +'" /><label for="radio_'+ i +'"></label></span>'
    
            //テーブルに表示するテキスト・HTMLを格納
            this.newusers.users[i] = [
              radioButton, islogin, user.No, user.displayName, user.department, user.position, user.email, user.other, user.logindate, 
            ]

            this.userID[i] = user.uid
            i++
          }
          const table: any = $('.js-basic-users');
          //新しく読み込んだタスクをテーブルに反映させるため、テーブルの初期化し、再読み込み
          if(this.newusers.users){
            table.DataTable({
              destroy: true,
              data: this.newusers.users,
              order: [[ 2, "asc" ]],
              language: {
                "url": "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
              },
            });
          }
        }},500
      );
    });
  }

  ngAfterViewInit() {
    //タスク詳細説明欄の自動拡張
    autosize($('textarea.auto-growth'));

    $('.dropdown-menu li a').click( function() {
      $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text()	+ ' <span class="caret"></span>');
      $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
      // that.editstate = $(this).text();
    });

  }

  ngAfterViewChecked(){
    let that = this
    if(this.users){
      let i = 0
      for(let user of this.users){
        $('#radio_' + i).click( function() {
          that.selectUid = $(this).attr('id').split('_')[1]
          for(let j=0; j<10; j++){
            let data = $(this).closest('tr').children('td:nth-child('+j+')').html()
            if(j===3){
              $('#editNo').val(data)
            }
            if(j===4){
              let name = data.split(' ')
              $('#editLastName').val(name[0])
              $('#editFirstName').val(name[1])
            }
            if(j===5){
              $('#editDepartment').val(data)
            }
            if(j===6){
              $('#editPosition').val(data)
            }
            if(j===7){
              $('#editEmail').val(data)
            }
            if(j===8){
              $('#editOther').val(data)
            }
          }
        });
        i++
      }
    }
  }

  signin(){
    this.usersRef.update(this.currentUser.uid,{islogin: false})
    let Name = this.lastname + " " + this.firstname
    this.newUser={
      email: this.email,
      displayName: Name,
      No: this.No,
      department: this.department,
      position: this.position,
      other: this.other,
      password: this.password
    }
    this.userService.create(this.email, this.password, this.newUser)
    $('#registerModal').modal('hide')
    this.email = ""
    this.lastname = ""
    this.firstname = ""
    this.No = null
    this.department = ""
    this.position = ""
    this.other  = ""
    this.password = ""
  }

  edit(){
    let uid = this.userID[this.selectUid]
    
    let editNo = $('#editNo').val()
    let editDisplayName = $('#editLastName').val() + " " + $('#editFirstName').val()
    let editDepartment = $('#editDepartment').val()
    let editPosition = $('#editPosition').val()
    let editEmail = $('#editEmail').val()
    let editOther = $('#editOther').val()

    this.usersRef.update(uid,{
      No: editNo,
      displayName: editDisplayName,
      department: editDepartment,
      position: editPosition ? editPosition : "",
      email: editEmail,
      other: editOther ? editOther : ""
    })
    $('#editModal').modal('hide')


  }

  delete(){
    let uid = this.userID[this.selectUid]

    this.usersRef.remove(uid)
    $('#editModal').modal('hide')

  }

}
