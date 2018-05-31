import { Component, OnInit, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { TodoTableColItems, TodoTableDateList } from '../shared/const/TodoTableData'
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Task } from '../shared/class/task'
import { format } from 'date-fns'
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2'

declare var jquery:any;  // jquery
declare var $ :any; // jquery

declare var autosize :any; // autosize

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit {

  @Input() userdata
   
  tasks: Task[];
  tasksRef: AngularFireList<any>;

  // TableDateList: Task[];
  bk_Data: Task[];
  newtasks: any;

  tasksNo: number;

  now = new Date()

  alltasks: Task[];
  alltasksRef: AngularFireList<any>;

  alltasksItemsRef: AngularFireObject<any>;

  title: string;
  description: string;
  priority: string;
  deadline: string;
  startdate: string;
  state: string;
  author: string;

  task:Task = { 
    No: null,
    title: '',
    description: '',
    priority: '',
    deadline: '',
    startdate: '',
    state: '',
    author: '',
    creatdate: '',
  }

  TaskInit:Task = { 
    No: null,
    title: '',
    description: '',
    priority: '',
    deadline: '',
    startdate: '',
    state: '',
    author: '',
    creatdate: '',
  }

  dataTable: any;
  
  editpriority: string
  editstate: string
  editdeadline: string
  editstartdate: string

  title_html: string

  constructor(private db: AngularFireDatabase,private chRef: ChangeDetectorRef) { 
    this.tasksRef = db.list('/tasks', ref => ref.orderByChild('isTrash').equalTo(false));
    this.alltasksRef = db.list('/tasks');
  }

  addtask(){
    this.tasksRef.push(new Task({
      No: this.tasksNo,
      title: this.title,
      description: this.description,
      priority: this.priority ? this.priority : '',
      state: this.state ? this.state : '',
      deadline: this.deadline,
      startdate: this.startdate,
      author: this.userdata.displayName
    }));
    //フォーム初期化
    this.title=""
    this.description=""
    this.priority=""
    this.state=""
    this.deadline=""
    this.startdate=""
    //HTML直編集（MOCK参考）
    $('.dropdown-menu li a').parents('.btn-group').find('.dropdown-toggle').html('未選択'	+ ' <span class="caret"></span>');
    //datepickerを開き、クリアをクリックする
    $('.datetimepicker-trigger').click();$('.dtp-btn-clear').click()
    $('.barDropdownToggle').click()
  }
  
  ngOnInit() {
    // trashtask以外
    this.tasksRef.snapshotChanges()
    .subscribe(snapshots => {
      this.tasks = snapshots.map(snapshot => {
        const values = snapshot.payload.val();
        return new Task({ key: snapshot.payload.key, ...values });
      });
      //値の反映まち（必要なさそう）
      // this.chRef.detectChanges();
      
      const table: any = $('.js-basic-tasks');
      let i = 0
      this.newtasks = { tasks: [] };

      for(let task of this.tasks){
        //値が無いとjquery data tableがエラーになるので対策
        if(!task.priority){task.priority=""}
        if(!task.deadline){task.deadline=""}
        if(!task.startdate){task.startdate=""}
        if(!task.state){task.state=""}

        //今の時間とタスクが作成された時間の差分計算
        let diff = this.now.getTime() - new Date(task.creatdate.slice(0,10)).getTime();
        let day = diff/(1000*60*60*24);

        //バッジのHTML格納
        const NewBadge = '<span class="badge bg-blue">New</span>'

        //三日以内に作られたタスクはバッジHTMLを付ける
        if(day <= 3){
          this.title_html =
          '<a data-target="#detailModal" data-toggle="modal" style="cursor: pointer" title=' + task.title +' id=0'+ i +'>' + NewBadge + task.title +'</a>'
        }else{
          this.title_html =
          '<a data-target="#detailModal" data-toggle="modal" style="cursor: pointer" title=' + task.title +' id=0'+ i +'>' + task.title +'</a>'
        }

        //テーブルに表示するテキスト・HTMLを格納
        this.newtasks.tasks[i] = [
            task.No, this.title_html, task.priority, task.deadline, task.startdate, task.state, 
            `<i class="material-icons" data-target="#registerModal" data-toggle="modal" id=`+ i +` style="cursor: pointer;">edit</i>`
          ]
        i++
      }
      
      //新しく読み込んだタスクをテーブルに反映させるため、テーブルの初期化し、再読み込み
      if(this.newtasks){
        table.DataTable({
          destroy: true,
          data: this.newtasks.tasks,
          language: {
            "url": "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
          },
        });
      }
    });
    //全てのタスク
    this.alltasksRef.snapshotChanges()
    .subscribe(snapshots => {
      this.alltasks = snapshots.map(snapshot => {
        const values = snapshot.payload.val();
        return new Task({ key: snapshot.payload.key, ...values });
      });
      this.tasksNo = this.alltasks.length + 1
    });

    let that = this
    //画面を閉じたときにisloginをfalse
    window.addEventListener('beforeunload', function(event) {
      if(that.task){
        if(that.task.key){
          that.tasksRef.update(that.task.key,{isEdit: false})
        }
        setTimeout(() => { },300);
      }
    });
    
  }
  select:number=0
  edit_No:number=0
  edit_title:string=""
  edit_creatdate:string=""
  edit_description:string=""
  edit_priority:string='未選択'
  edit_deadline:string=""
  edit_startdate:string=""
  edit_state:string='未選択'
  edit_author:string=""

  isEdit: boolean

  
  
  ngAfterViewChecked(){
  
    // SetNotifyClass(index: number){
    //   return 'icon-circle ' + this.NotificationsList[index].classname
    // }
    const that = this

    window.onbeforeunload = function(){
      if(that.task.key){
        that.tasksRef.update(that.task.key,{isEdit: false})
      }
    }

    if(this.tasks){
      let i = 0
      for(let task of this.tasks){
        if(task.isEdit){
          let name = that.userdata.displayName.split(' ')[0]
          $('#'+i).html('<th style="cursor: default;font-size: 12px;"><i>' + name + 'さん,編集中...</i></th>')
        }
        i++
      }
    }

    $("#datatables tbody .material-icons").click(function(){
      //タスク読み込み順にid要素に番号が振れ、その値がtasksに対応している
      //そのため　クリックした要素のidが $(this).attr("id")
      //tasks[○] に対応する
      that.select = $(this).attr("id")
      let task = that.tasks[that.select]
      that.tasksRef.update(task.key,{isEdit: true})
      
      that.edit_No = task.No
      that.edit_creatdate = task.creatdate
      that.edit_title = task.title
      that.edit_description = task.description ? task.description : ""
      that.edit_priority = task.priority ? task.priority : '未選択'
      that.edit_state = task.state ? task.state : '未選択'
      that.edit_deadline = task.deadline ? task.deadline : ''
      that.edit_startdate = task.startdate ? task.startdate : ''
      that.edit_author = that.userdata.displayName
      that.task = task
      that.task.author = that.userdata.displayName

      $('#edit-priority .dropdown-toggle').html(that.edit_priority	+ ' <span class="caret"></span>');
      $('#edit-state .dropdown-toggle').html(that.edit_state	+ ' <span class="caret"></span>');
    });

    $("#datatables tbody a").click(function(){
      //タスク読み込み順にid要素に番号が振れ、その値がtasksに対応している
      //そのため　クリックした要素のidが $(this).attr("id")
      //tasks[○] に対応する
      that.select = $(this).attr("id").slice(1, ); 
      let task = that.tasks[that.select]
      
      that.edit_No = task.No
      that.edit_creatdate = task.creatdate
      that.edit_title = task.title
      that.edit_description = task.description ? task.description : ""
      that.edit_priority = task.priority ? task.priority : '未選択'
      that.edit_state = task.state ? task.state : '未選択'
      that.edit_deadline = task.deadline ? task.deadline : ''
      that.edit_startdate = task.startdate ? task.startdate : ''
      that.edit_author = task.author
      that.task = task
      that.task.author = that.userdata.displayName
      $('#edit-priority .dropdown-toggle').html(that.edit_priority	+ ' <span class="caret"></span>');
      $('#edit-state .dropdown-toggle').html(that.edit_state	+ ' <span class="caret"></span>');
    });
  //   if(this.TableDateList && !this.bk_Data){
  //     this.orderTab = $('.js-basic-example').dataTable({
  //       destroy: true,
  //       responsive: true,
  //       language: {
  //           "url": "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
  //       },
  //       columnDefs: [{targets: 0}],
  //     });
  //     this.orderTab.fnSort([[0, 'asc']]);
  //     this.bk_Data = this.TableDateList
  //   }
  //   else if(this.TableDateList != this.bk_Data){
  //     this.orderTab = $('.js-basic-example').dataTable({
  //       destroy: true,
  //       responsive: true,
  //       language: {
  //           "url": "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
  //       },
  //     });
  //     this.bk_Data = this.TableDateList
  //   }
  // }

  // EditTask(key: string){

  //   this.task = this.tasks[index]
  //   this.task.isEdit = true
  //   if(!this.task.priority){this.task.priority='未選択'}
  //   if(!this.task.state){this.task.state='未選択'}
  //   if(!this.task.deadline){this.task.deadline=''}
  //   if(!this.task.startdate){this.task.startdate=''}
  //   if(!this.task.author){this.task.author=''}
  }

  ngAfterViewInit() {

    const that = this

    //modal.hideイベント時の処理、①編集フラグ切り替え、②保持しているタスクの初期化
    $('#registerModal').on('hidden.bs.modal', function () {
      that.tasksRef.update(that.task.key,{isEdit: false})
      that.task = that.TaskInit
      that.task.author = that.userdata.displayName
    })
      
    //タスク詳細説明欄の自動拡張
    autosize($('textarea.auto-growth'));

    //bootstrap-selectの値を取得
    $('#priority .dropdown-menu li a').click( function() {
      $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text()	+ ' <span class="caret"></span>');
      $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
      that.priority = $(this).text();
    });

    $('#state .dropdown-menu li a').click( function() {
      $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text()	+ ' <span class="caret"></span>');
      $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
      that.state = $(this).text();
    });

    $('#edit-priority .dropdown-menu li a').click( function() {
      $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text()	+ ' <span class="caret"></span>');
      $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
      that.editpriority = $(this).text();
    });

    $('#edit-state .dropdown-menu li a').click( function() {
      $(this).parents('.btn-group').find('.dropdown-toggle').html($(this).text()	+ ' <span class="caret"></span>');
      $(this).parents('.btn-group').find('input[name="dropdown-value"]').val($(this).attr("data-value"));
      that.editstate = $(this).text();
    });
      
    //datetimepickerの表示設定
    $('.datetimepicker').bootstrapMaterialDatePicker({
        format : 'YYYY/MM/DD HH:mm',
        clearButton : true,
        weekStart : 1,
        clearText : "クリア",
        cancelText : "キャンセル",
        lang : 'ja',
        triggerEvent : 'click'
    });

    //datetimepickerの値取得
    $('#deadline').on('change', () => { 
      this.deadline = ($('#deadline').val());
    });

    $('#startdate').on('change', () => { 
      this.startdate = ($('#startdate').val());
    });

    //datetimepickerの値取得(モーダル)
    $('#edit-deadline').on('change', () => { 
      this.editdeadline = ($('#edit-deadline').val());
    });

    $('#edit-startdate').on('change', () => { 
      this.editstartdate = ($('#edit-startdate').val());
    });

//Input - Function ========================================================================================================
//You can manage the inputs(also textareas) with name of class 'form-control'
// js/admin.js AdminBSBより入力フォームのアニメーション制御

    //On focus event
    $('.form-control').focus(function () {
      $(this).parent().addClass('focused');
    });

    //On focusout event
    $('.form-control').focusout(function () {
      var $this = $(this);
      if ($this.parents('.form-group').hasClass('form-float')) {
        if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
      }
      else {
        $this.parents('.form-line').removeClass('focused');
      }
    });

    //On label click
    $('body').on('click', '.form-float .form-line .form-label', function () {
      $(this).parent().find('input').focus();
    });

    //Not blank form
    $('.form-control').each(function () {
      if ($(this).val() !== '') {
        $(this).parents('.form-line').addClass('focused');
      }
    });
//Input - end ========================================================================================================
//==========================================================================================================================

    //パネル表示切替
    $("#expander").click(function() {
        if ($("#expander").find('i').text() == 'expand_more') {
            $("#expander").find('i').text("expand_less");
            $("#search_body").css("display", "block");
            $(this).attr("title", "最小化する");
        }
        else {
            $("#expander").find('i').text("expand_more");
            $("#search_body").css("display", "none");
            $(this).attr("title", "最大化する");
        }
    });

    //パネル表示切替をバーでもできるようにする
    $(".barDropdownToggle").click(function() {
      if ($("#expander").find('i').text() == 'expand_more') {
        $("#expander").find('i').text("expand_less");
        $("#search_body").css("display", "block");
        $(this).attr("title", "最小化する");
      } else {
        $("#expander").find('i').text("expand_more");
        $("#search_body").css("display", "none");
        $(this).attr("title", "最大化する");
      }
    });

    //二つないと開閉しない
    $("#expander").click(function() {
      if ($("#expander").find('i').text() == 'expand_more') {
        $("#expander").find('i').text("expand_less");
        $("#search_body").css("display", "block");
        $(this).attr("title", "最小化する");
      } else {
        $("#expander").find('i').text("expand_more");
        $("#search_body").css("display", "none");
        $(this).attr("title", "最大化する");
      }
    });
      
    $("#selectall_1").click(function() {
        if ($(this).prop('checked')) {
            $('#timeline').find('input:checkbox[name!=selectall]').each(function() {
                $(this).prop('checked', true);
            });
        }
        else {
            $('#timeline').find('input:checkbox[name!=selectall]').each(function() {
                $(this).prop('checked', false);
            });
        }
    });


    
      //時系列の背景色
      $(".modal .scrollDiv").find("tr:nth-child(2n-1)").css({"background": "rgba(244, 67, 54, 0.1)"});
      $(".modal .scrollDiv").find("tr:last").filter(function(){
        if($(this).text().indexOf("終票")>0){
          $(this).css({"background": "rgba(244, 67, 54, 0.1)"});
        }
      });
    
      $(".timeExpander").click(function() {
      if ($(this).find('i').text() == 'expand_more') {
        $(this).find('i').text("expand_less");
        $("[class='modal fade in']").find(".search_body").css("display", "block");
        $(this).attr("title", "最小化する");
    
        //スクロールを調整
        var globaleTableHeight = getTableHeight($("[class='modal fade in']").attr("id"),"reset");
        $("[class='modal fade in']").find(".scrollDiv").slimScroll({ destroy: true }).height(globaleTableHeight);
        setOpenedModalScroll(globaleTableHeight);
    
      } else {
        $(this).find('i').text("expand_more");
        $("[class='modal fade in']").find(".search_body").css("display", "none");
        $(this).attr("title", "最大化する");
    
        //スクロールを調整
        var globaleTableHeight = getTableHeight($("[class='modal fade in']").attr("id"),"init");
        $("[class='modal fade in']").find(".scrollDiv").slimScroll({ destroy: true }).height('auto');
        setOpenedModalScroll(globaleTableHeight);
      }
    });
    
    function setOpenedModalScroll( globaleTableHeight ){
      $("[class='modal fade in']").find(".scrollDiv").slimScroll({
        alwaysVisible: true,
        position: 'left',
        distance: '290px',
        height: globaleTableHeight + 'px'
      });
    }
    
    function getTableHeight( modal ,flg ){//flg:'init','reset'
      var tableHeight;
      var totalHeight =$("[class='modal fade in']").find(".card")[0].clientHeight + $("[class='modal fade in']").find(".card")[1].clientHeight;
      switch( modal ){
        case "editModal":
          if(flg == "init"){
            tableHeight = totalHeight + 10 - 122;
          }else if(flg == "reset"){
            tableHeight = totalHeight + 10 - 232 - 10;
          }
          break;
        default:
      }
      return tableHeight;
    }
  }

  TableColItems=TodoTableColItems

  isDisabled(){
    if(this.title){
      if(this.userdata.displayName){
        return false
      }
    }
    return true
  }

  remove(){
    swal({
      // customClass: this.ThemeColor,
      customClass: 'swal-modal',
      title: '注意！',
      text: `タスク「 ${this.task.title} 」を削除しますか？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'swal-btn--ok',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.value) {
        swal({
          // customClass: this.ThemeColor,
          customClass: 'swal-modal',
          title: '削除完了',
          text: `タスク「 ${this.task.title} 」を削除しました。`,
          type: 'success',
          confirmButtonClass: 'swal-btn--ok',
        })
        this.tasksRef.update(this.task.key,{isTrash: true})
        $('#registerModal').modal('hide')
        $('#detailModal').modal('hide')
      }
    })
  }

  edit(){

    if(!this.editpriority){
      this.editpriority = this.task.priority
    }
    if(this.editpriority=='未選択'){
      this.editpriority = ""
    }
    if(!this.editstate){
      this.editstate = this.task.state
    }
    if(this.editstate=='未選択'){
      this.editstate = ""
    }
    if(!this.editdeadline){
      this.editdeadline = this.task.deadline
    }
    if(!this.editstartdate){
      this.editstartdate = this.task.startdate
    }
    this.tasksRef.update(this.task.key,{
      title: this.edit_title,
      description: this.edit_description,
      priority: this.editpriority,
      state: this.editstate,
      deadline: this.editdeadline,
      startdate: this.editstartdate,
      author: this.edit_author,
      isEdit: false
    })
    this.editpriority=""
    this.editstate=""
    this.editdeadline=""
    this.editstartdate=""
    $('#registerModal').modal('hide')
  }

  toEdit(){
    this.tasksRef.update(this.task.key,{isEdit: true})
    $('#detailModal').modal('hide')
  }

}
