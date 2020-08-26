import { range } from 'lodash-es';
import { getMapOfGrade, getFirstGrade } from './index';

const addNumberOfClass = (a: Object[], b: Object[]): Object[] => [
  0,
  Number(a[1] ?? 1) + Number(b[1] ?? 1),
];

export const setNumberOfClass = () => {
  let numClassSheet = SpreadsheetApp.getActive().getRangeByName(
      'DS_KHOI_LOP!NumOfClass'
    ),
    row = numClassSheet.getRow(),
    maxRow = numClassSheet.getLastRow();

  range(row, maxRow).forEach(i => {
    const offset = i - 10 + 1;
    let gradeMap = getMapOfGrade(getFirstGrade() + offset),
      numClass = gradeMap.reduce(addNumberOfClass)[1];

    numClassSheet
      .getCell(row + offset, 0)
      .setValue(numClass)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
  });
};
