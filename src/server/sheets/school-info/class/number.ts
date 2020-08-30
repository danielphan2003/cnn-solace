import * as _ from "lodash-es";

import { getFirstGrade, getMapOfGrade } from "../grade";
import { addNumberOfClass } from "../../utils/class";

export const setNumberOfClass = () => {
  let numClassSheet = SpreadsheetApp.getActive().getRangeByName(
      'DS_KHOI_LOP!NumOfClass'
    ),
    row = numClassSheet.getRow(),
    rowLength = numClassSheet.getLastRow();

  numClassSheet
    .setValues(
      _.range(0, rowLength - row + 1).map(i => [
        getMapOfGrade(getFirstGrade() + i).reduce(addNumberOfClass, 0),
      ])
    )
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
};

export const getMaxNumClass = () =>
  Math.max(
    ...SpreadsheetApp.getActive()
      .getRangeByName('DS_KHOI_LOP!NumOfClass')
      .getValues()
      .map(e => Number(e))
  );

export const getNumberOfClass = (grade: number): number =>
  Number(
    SpreadsheetApp.getActive()
      .getRangeByName('DS_KHOI_LOP!NumOfClass')
      .getValues()[0][grade - getFirstGrade()] ?? 0
  );