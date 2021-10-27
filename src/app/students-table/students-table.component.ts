import { Component, Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, Subscription } from 'rxjs';
import { State, process, SortDescriptor } from '@progress/kendo-data-query';
import { EditService } from './services/edit.service';
import { Student } from './models/student.model';
import { map } from 'rxjs/operators';
import { Notification } from './models/notification.dto';
import { io, Socket } from "socket.io-client";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss']
})

export class StudentsTableComponent implements OnInit, OnDestroy {
  public view: Observable<GridDataResult> | undefined;
  private sorting: SortDescriptor[] | undefined = []
  public gridState: State = {
    sort: this.sorting,
    skip: 0,
    take: 25,
  };

  private editedRowIndex: number | undefined;
  private editedStudent: Student | undefined;
  private editService: EditService;
  notification: Notification | undefined;
  private socket: Socket | undefined;

  constructor(@Inject(EditService) editServiceFactory: any, private snackBar: MatSnackBar) {
    this.editService = editServiceFactory();
    this.socket = io("ws://localhost:3137");
    this.socket.on('remove', (...args: any) => {
      this.snackBar.open('successfully removed', 'close');
    })
    this.socket.on('create', (...args) => {
      this.snackBar.open('successfully added', 'close');
      this.editService.refreshTable();
    })
    this.socket.on('update', (...args) => {
      this.snackBar.open('successfully updated', 'close');
    })
    this.socket.on('upload', (...args) => {
      console.log(args);
      this.snackBar.open('successfully uploaded', 'close');
    })
  } 
  ngOnDestroy(): void {
    this.socket?.disconnect();
  }

  ngOnInit(): void {
    this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    this.editService.read((this.gridState.skip? this.gridState.skip: 0), (this.gridState.take? this.gridState.take: 10));
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.read((this.gridState.skip? this.gridState.skip: 0), (this.gridState.take? this.gridState.take: 10));
  }

  public addHandler({sender}: any) {
    this.closeEditor(sender);
    sender.addRow(new Student());
  }  

  public editHandler({sender, rowIndex, dataItem}: any) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    this.editedStudent = Object.assign({}, dataItem);
    sender.editRow(rowIndex);
  }

  public cancelHandler({sender, rowIndex}: any) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, dataItem, isNew}: any) {
    this.editService.save(dataItem, isNew);
    sender.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedStudent = undefined;
  }

  public removeHandler({dataItem}: any) {
    if(confirm('Are you sure you want to delete the student?')){
      this.editService.remove(dataItem);
    }
  }

  private closeEditor(grid: any, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editService.resetItem(this.editedStudent);
    this.editedRowIndex = undefined;
    this.editedStudent = undefined;
  }
}
