import * as _ from 'lodash-es';

import { getMaxNumClass } from './number';
import { getListOfGrade } from '../grade';
import { toGradeMap } from '../../utils/grade';

const emptyClassMap = Array<Array<null>>(24).fill(Array(3).fill(null));

export const setMapOfClass = () => {
  let classSheet = SpreadsheetApp.getActive().getSheetByName('DS_KHOI_LOP'),
    nthGrades = SpreadsheetApp.getActive()
      .getRangeByName('nthGrade')
      .getValues();

  let grades = getListOfGrade();

  let gradeCell = classSheet.getRange(13, 2);

  let row = gradeCell.getRow(),
    col = gradeCell.getColumn(),
    maxNumClass = getMaxNumClass();

  let classMapRange = classSheet.getRange(row, col, maxNumClass, grades.length);

  classSheet
    .getRange(row, col, 24, grades.length)
    .setValues(emptyClassMap)
    .clearFormat();

  SpreadsheetApp.getActive().setNamedRange("ClassList", classMapRange);

  classSheet.setRowHeights(row, maxNumClass, 45);

  classMapRange
    .setFontFamily('Quicksand')
    .setFontSize(11)
    .setBorder(true, true, true, true, true, true)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center')
    .setValues(toGradeMap(grades, nthGrades));
};
