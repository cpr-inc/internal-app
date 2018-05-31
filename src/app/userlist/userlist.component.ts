import { Component, OnInit } from '@angular/core';

declare var jquery:any;  // jquery
declare var $ :any; // jquery

declare var autosize :any; // autosize

const UserInfoCol=[
  '選択',
  '社員番号',
  '姓',
  '名',
  '役職',
  '部署',
  'メールアドレス',
  'その他'
]

// {no: '001',lastname: '田中', firstname: '太郎',position: '',department: 'ソリューション事業部',email: 'y-ebinuma@cpr.jp',other: ''}

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  TableColItems = UserInfoCol

  selected: any
  MOCKuser: any

  constructor() {
    this.selected = new Array()
    for(let i=0; i<7; i++){
      this.selected[i] = `<span><input name="group" type="radio" class="with-gap" id="radio_` + i +`" /><label for="radio_` + i +`"></label></span>`
    }
    
    this.MOCKuser=[
      [this.selected[0], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[1], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[2], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[3], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[4], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[5], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
      [this.selected[6], '001','田中', '太郎','','ソリューション事業部','y-ebinuma@cpr.jp',''],
    ]
   }

  ngOnInit() {
  }

  ngAfterViewChecked(){

  }

  ngAfterViewInit() {
    const table: any = $('.js-basic-example');
    const dataTable = table.DataTable({
      destroy: true,
      data: this.MOCKuser,
      language: {
        "url": "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
      },
    });
    
    autosize($('textarea.auto-growth'));

    $('table#userInfoListTable').dataTable({
            responsive : true,
            retrieve: true,
            language : {
              "url" : "http://cdn.datatables.net/plug-ins/1.10.15/i18n/Japanese.json"
            }
    });

    $('.datetimepicker').bootstrapMaterialDatePicker({
      format : 'YYYY/MM/DD HH:mm',
      clearButton : true,
      weekStart : 1,
      clearText : "クリア",
      cancelText : "キャンセル",
      lang : 'ja',
      triggerEvent : 'click'
    });

// 				$(".dropdown-menu li a")
// 						.click(
// 								function() {
// 									$(this)
// 											.parents('.btn-group')
// 											.find(
// 													'.dropdown-toggle')
// 											.html(
// 													$(this).text()
// 															+ ' <span class="caret"></span>');
// 									$(this)
// 											.parents('.btn-group')
// 											.find(
// 													'input[name="dropdown-value"]')
// 											.val(
// 													$(this)
// 															.attr(
// 																	"data-value"));
// 								});

    // Dropzone.autoDiscover = false;
    // $("#csvModalDropzone").dropzone({
    //   url: "/file/post",//TODO
    //   hiddenInputContainer: "#csvModalDropzone",
    //   dictDefaultMessage: "ここにファイルをドロップしてアップロード",
    //   dictFallbackMessage: "あなたのブラウザはファイルのアップロードをサポートしていません。",
    //   dictFallbackText: "ファイルをアップロードするには、以下の代替フォームを使用してください。",
    //   dictFileTooBig: "ファイルが大きすぎます（{{filesize}} MiB）。 最大ファイルサイズ：{{maxFilesize}} MiB。",
    //   dictInvalidFileType: "この種類のファイルはアップロードできません。",
    //   dictResponseError: "サーバーは{{statusCode}}コードで応答しました。",
    //   dictCancelUpload: "アップロードをキャンセルする",
    //   dictCancelUploadConfirmation: "アップロードをキャンセルしてもよろしいですか？",
    //   dictRemoveFile: "ファイルを削除",
    //   dictRemoveFileConfirmation: "null",
    //   dictMaxFilesExceeded: "これ以上ファイルをアップロードすることはできません。",
    // });
  }




  
}
