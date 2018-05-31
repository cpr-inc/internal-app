import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() task

  tasksRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { 
    this.tasksRef = db.list('/tasks');
  }

  ngOnInit() {
  }



}
