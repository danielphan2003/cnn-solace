import * as _ from "lodash-es";
import { getFirstGradeYear, getFirstGrade, getMapOfGrade } from "../school-info/grade";

export const toGrade = (gradeYear: number): number => 
  getFirstGradeYear() - gradeYear + getFirstGrade();

export const toGradeMap = (grades: number[], nthGradeRange: object[][]): any[][] =>
  _.unzip(
    grades.map(grade => getMapOfGrade(grade).reduce(
      gradeMapReducer(
        nthGradeRange[grade - getFirstGrade()][0].toString()
      ),
      []
    )
    )
  );

const gradeMapReducer = (gradeYear: string) => (acc: any[], currClassInfo: any[]) => {
  let classLetter = currClassInfo[0].toString(),
      classCount = Number(currClassInfo[1] ?? 1);
  if (classCount == 1) {
    return [
      ...acc,
      ..._.range(1, classCount).map(i => `${classLetter}${i}-K${gradeYear}`)
    ];
  }
  return [
    ...acc,
    `${classLetter}${gradeYear}`
  ];
}