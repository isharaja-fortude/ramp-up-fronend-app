import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import { Student } from '../models/student.model';
import { addStudentMutation, deleteStudentMutation, getStudentsQuery, updateStudentMutation } from '../consts/students.query';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
  
  public d: {students: Student[]} = {students: []}
  loading = true;
  error: any;
  studentsQuery: QueryRef<any, { skip: number; take: number; }> | undefined;
  subscription!: Subscription;

  constructor(private apollo: Apollo){
    super([]);
  }

  public read(skip: number, take: number) {
    if (this.d.students.length) {
      return super.next(this.d.students);
    }
    if (this.subscription) {
      return false;
    }
    console.log('about to trigger getAll')
    this.getAll(skip, take);
  }

  public save(data: Student, isNew?: boolean): void {
    const mutation = isNew ? addStudentMutation(data) : updateStudentMutation(data);
    let updatedStudent = new Student();
    updatedStudent.name = data.name;
    updatedStudent.gender = data.gender;
    updatedStudent.mobileNo = data.mobileNo;
    updatedStudent.dob = data.dob;
    updatedStudent.address = data.address
    if(!isNew){
    updatedStudent.id = data.id;
    } else {
      this.d.students.push(updatedStudent)
    }
    const args = {addStudentStudent: updatedStudent}
    this.mutate(mutation, args);
  }

  public resetItem(dataItem: any) {
    if (!dataItem) { return false; }
    const originalDataItem = this.d.students.find(item => item.id === dataItem.id);
    Object.assign(originalDataItem, dataItem);
    super.next(this.d.students);
    return true;
  }

  public remove(data: Student) {
    const args = {deleteStudentId: data.id?.toString()}
    this.mutate(deleteStudentMutation(), args);
  }

  public refreshTable () {
    this.studentsQuery?.refetch();
  }

  public mutate(mutation: any, data: any): void {
    this.apollo.mutate({
      mutation,
      variables: data,
    })
    .subscribe(({ data, loading }: any) => {
      this.studentsQuery?.refetch();
    });
  }

  public getAll(skip: number, take: number) {
    this.studentsQuery = this.apollo.watchQuery({
      query: getStudentsQuery,
      variables: {
        skip,
        take
      },
    })

    this.subscription = this.studentsQuery
    .valueChanges
    .pipe(
      map((changes: any) => {
        return changes.data.students
      }
      ),
    )
    .subscribe(data => {
      this.d.students = data;
      super.next(this.d.students)
    });
  }
}