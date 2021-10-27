import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentsTableComponent } from './students-table/students-table.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { EditService } from './students-table/services/edit.service';
import { GraphQLModule } from './graphql.module';
import { Apollo } from 'apollo-angular';
import { MatIconModule } from '@angular/material/icon'
import { NotificationService } from './students-table/services/notification.service';
import { WebSocketService } from './students-table/services/websocket.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';


@NgModule({
  declarations: [
    AppComponent,
    StudentsTableComponent,
    FileUploaderComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GraphQLModule,
    MatIconModule,
    MatSnackBarModule,
    DateInputsModule
  ],
  providers: [{
      deps: [Apollo],
      provide: EditService,
      useFactory: (apollo: Apollo) => () => new EditService(apollo)
    }, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
