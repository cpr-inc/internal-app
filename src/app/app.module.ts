import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from './core/core.module' 

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { TodolistComponent } from './todolist/todolist.component';
import { DatePipe } from './shared/pipe/date.pipe';
import { ModalComponent } from './todolist/modal/modal.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ActiveuserComponent } from './activeuser/activeuser.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    DatePipe,
    ModalComponent,
    UserlistComponent,
    ActiveuserComponent,
    UserComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    CoreModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }