import { parseClassAlias } from "./utils";

const getValidationRange = (
  remoteWorksheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  value: string
) => {
  let classInfo = parseClassAlias(value);
  let classRangeName = classInfo.classLetter + '_';

  if (!classInfo.isSingleton) {
    classRangeName += 'K';
  }
  classRangeName += classInfo.gradeYear;

  return remoteWorksheet.getRangeByName(
    `K${classInfo.gradeYear}!${classRangeName}`
  );
};

export const applyFirstLevelValidation = (
  worksheet: GoogleAppsScript.Spreadsheet.Sheet,
  remoteWorksheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  value: string,
  row: number,
  validationColumn: number,
) => {
  if (value === '') {
    worksheet.getRange(row, validationColumn + 1).clearContent();
    worksheet.getRange(row, validationColumn + 1).clearDataValidations();
  } else {
    let cell = worksheet.getRange(row, validationColumn);
    let listToApply = getValidationRange(remoteWorksheet, value).getValues();
    applyValidationToCell(listToApply, cell);
  }
};

const applyValidationToCell = (
  list: object[],
  cell: GoogleAppsScript.Spreadsheet.Range
) => {
  let rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(list.map(e => e.toString()))
    .setAllowInvalid(false)
    .build();

  cell.setDataValidation(rule);
};
