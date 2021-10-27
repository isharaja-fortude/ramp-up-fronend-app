import gql from "graphql-tag";
import { Student } from "../models/student.model";

export const getStudentsQuery = gql`
query Query($skip: Float!, $take: Float!) {
  students(skip: $skip, take: $take) {
    id
    name
    age
    dob
    address
    mobileNo
    gender  
  }
}`

export const addStudentMutation = (student: Student) => {

  return gql`
  	mutation Mutation($addStudentStudent: StudentInput!) {
      addStudent(student: $addStudentStudent) {
        address
        dob
        gender
        mobileNo
        name
      }
    }
  `
};

export const updateStudentMutation = (student:Student) => {

  return gql`
    mutation Mutation($addStudentStudent: StudentDto!) {
      updateStudent(student: $addStudentStudent) {
        id
        name
        address
        gender
        mobileNo
        dob
      }
    }
  `
}

export const deleteStudentMutation = () => {
  return gql`
    mutation DeleteStudentMutation($deleteStudentId: String!) {
      deleteStudent(id: $deleteStudentId) {
        id
      }
    }
`; 
}


