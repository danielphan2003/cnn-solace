import * as _ from 'lodash-es';

import { getNumberOfClass } from './class';
import { getFirstGrade, getFirstGradeYear } from './grade';

import { parseClassAlias, toClassAlias } from '../utils/class';

export const setNamedClassRange = () => {
  let gradeWs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('K52');
  let gradeYear = parseClassAlias('K52').gradeYear;

  _.range(
    1,
    getNumberOfClass(getFirstGradeYear() - gradeYear + getFirstGrade())
  ).forEach(i => {
    let classNameCell = gradeWs.getRange(1, i),
      classNameVal = classNameCell.getValue().toString(),
      classAlias = toClassAlias(classNameVal, gradeYear, '-K', ''),
      classRangeName = toClassAlias(classNameVal, gradeYear, '_K', '_');

    if (SpreadsheetApp.getActive().getRangeByName(classRangeName) == null) {
      return;
    }

    classNameCell.setValue([classAlias]);

    SpreadsheetApp.getActive().setNamedRange(
      classRangeName,
      gradeWs.getRange(3, i, 58)
    );
  });
};
