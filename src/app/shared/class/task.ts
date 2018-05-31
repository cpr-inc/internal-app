import { format } from 'date-fns/esm'

export interface TASK {
    key?: string;
    No: number;
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
    startdate?: string;
    state?: string;
    creatdate: string;
    author: string;
    isEdit?: boolean;
    isTrash?: boolean;
}

export class Task {
    key?: string;
    No: number;
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
    startdate?: string;
    state?: string;
    creatdate: string;
    author: string;
    isEdit?: boolean;
    isTrash?: boolean;

    constructor(values){
        //配列key
        if(values.key){
            this.key = values.key;
        }
        //タスクナンバー
        this.No = values.No;
        //タスクタイトル
        this.title = values.title;
        //タスク詳細説明
        if(values.description){
            this.description = values.description;
        }
        //タスク重要度
        if(values.priority){
            this.priority = values.priority;
        }
        //タスク期限日
        if(values.deadline){
            this.deadline = values.deadline;
        }
        //タスク作業状況
        if(values.state){
            this.state = values.state;
        }
        //タスク開始日
        if(values.startdate){
            this.startdate = values.startdate;
        }
        //タスク作成日
        if(!values.creatdate){
            this.creatdate = format(new Date(),"YYYY-MM-DDTHH:mm:ss.SSSZ",);
        }else{
            this.creatdate = values.creatdate;
        }
        this.author = values.author;
        //タスク編集フラグ
        if(!values.isEdit){
            this.isEdit = false;
        }else{
            this.isEdit = values.isEdit;
        }
        //タスク削除フラグ
        if(!values.isTrash){
            this.isTrash = false;
        }else{
            this.isTrash = values.isTrash;
        }

    }
}