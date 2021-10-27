import { TestBed } from "@angular/core/testing";
import { Apollo, QueryRef } from "apollo-angular";
import { Student } from "../models/student.model";
import { EditService } from "./edit.service";
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { getStudentsQuery } from "../consts/students.query";

describe('EditService', () => {
  let editService: EditService;
  let controller: ApolloTestingController;
  const skip = 0;
  const take = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [EditService]
    });

    controller = TestBed.inject(ApolloTestingController);

    editService = TestBed.inject(EditService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('getAll should provide a list of students', () => {
    editService.getAll(skip, take);
    const op = controller.expectOne(getStudentsQuery);
    op.flush({
      data: {
        students: [{
          id: 1,
          name: 'Ishara',
          dob: '1996-07-20T17:30:00.000Z',
          address: 'kottawa',
          gender: 'male',
          mobileNo: '0767223361',
          age: 25
        }],
      },
    });
    console.log(op);
    expect(editService.studentsQuery).toBeDefined();
    expect(editService.subscription).toBeDefined();
    controller.verify();
  });

  it('#read should trigger the getAll function', () => {
    spyOn(EditService.prototype, 'getAll');
    editService.read(skip, take);
    expect(editService.getAll).toHaveBeenCalled();
  });

  it('#read should trigger the getAll function', () => {
    spyOn(EditService.prototype, 'mutate');
    const student = new Student();
    student.name = 'Ishara';
    student.mobileNo = '0767223361';
    student.gender = 'male';
    student.address = 'Homagama';
    student.dob = new Date('1996-07-20T17:30:00.000Z')
    editService.save(student, true);
    expect(editService.mutate).toHaveBeenCalled();
  })

  it('#should trigger mutate function when remove method is called', () => {
    spyOn(EditService.prototype, 'mutate');
    const student = new Student();
    student.name = 'Ishara';
    student.mobileNo = '0767223361';
    student.gender = 'male';
    student.address = 'Homagama';
    student.dob = new Date('1996-07-20T17:30:00.000Z')
    editService.remove(student);
    expect(editService.mutate).toHaveBeenCalled();
  })

  it('#should revert items once the resetItem function is called', () => {
    const student = new Student();
    student.id = 1;
    student.name = 'Ishara';
    student.mobileNo = '0767223361';
    student.gender = 'male';
    student.address = 'Homagama';
    student.dob = new Date('1996-07-20T17:30:00.000Z')
    editService.d.students.push(student);

    const newStudent = new Student();
    newStudent.id = 1;
    newStudent.name = 'Ishara';
    newStudent.mobileNo = '0767223361';
    newStudent.gender = 'male';
    newStudent.address = 'kottawa';
    newStudent.dob = new Date('1996-07-20T17:30:00.000Z')
    editService.resetItem(newStudent);
    expect(editService.d.students[0].address).toBe('kottawa')
  });

  it(' #should return false when resetItem is called with undefined argument', () => {
    const result = editService.resetItem(undefined);
    expect(result).toBeFalse();
  })
})