import * as _ from 'lodash-es';

export const getFirstGrade = (): number =>
  Number(
    SpreadsheetApp.getActive()
      .getRangeByName('DS_KHOI_LOP!GradeName')
      ?.getValues()[0][0]
      ?.toString()
      .split(' ')[-1]
  );

export const getMapOfGrade = (grade: number): any[] => {
  let [polyGradeMap, monoGradeMap]: string[] = SpreadsheetApp.getActive()
    .getRangeByName('DS_KHOI_LOP!ClassMap')
    ?.getValues()
    [grade - getFirstGrade()].map(o => String(o));

  return [
    ...polyGradeMap
      .split(' ')
      .map(c => [c.substring(0, 1).toUpperCase(), c.length - 1]),
    ...monoGradeMap.split('').map(c => [c]),
  ];
};

export const getListOfGrade = (): number[] =>
  SpreadsheetApp.getActive()
    .getRangeByName('GradeName')
    .getValues()
    .map(gradeCols => Number(String(gradeCols[0]).split(' ')[-1]));

export const getFirstGradeYear = () => 
  new Date().getFullYear() - 1968;
