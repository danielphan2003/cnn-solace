import { range } from 'lodash-es';

import { setCellValue } from '../utils';

export const getFirstGrade = (): number =>
  Number(
    SpreadsheetApp.getActive()
      .getRangeByName('DS_KHOI_LOP!GradeName')
      ?.getValues()[0][0]
      ?.toString()
      .split(' ')[-1]
  );

export const getMapOfGrade = (grade: number): Object[][] => {
  let [polyGradeMap, monoGradeMap]: String[] = SpreadsheetApp.getActive()
    .getRangeByName('DS_KHOI_LOP!ClassMap')
    ?.getValues()
    [grade - 10].map(o => String(o));

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

export const setListOfClass = () => {
  let gradeSheet = SpreadsheetApp.getActive().getSheetByName('DS_KHOI_LOP'),
    nthClassRange = SpreadsheetApp.getActive()
      .getRangeByName('nthClass')
      .getValues();

  let grades = getListOfGrade();

  grades.forEach(grade => {
    let gradeCell = gradeSheet.createTextFinder('KHỐI ' + grade).findPrevious();

    let row = gradeCell.getRow(),
      col = gradeCell.getColumn(),
      classCountOffset = 0,
      gradeMap = getMapOfGrade(grade),
      gradeYear = nthClassRange[grade - 10][0].toString();

    gradeMap.map((classInfo, idx) => {
      let classLetter = classInfo[0].toString(),
        classCount = Number(classInfo[1]),
        prevClassCount = Number(gradeMap[idx - 1][1] ?? 0) + 1;

      if (isNaN(classCount)) {
        return classInfo.forEach(classLetter =>
          setCellValue(gradeSheet, classLetter + gradeYear, row++, col)
        );
      }

      return range(
        prevClassCount,
        (classCountOffset += classCount)
      ).forEach(i =>
        setCellValue(gradeSheet, classLetter + i + '-K' + gradeYear, row++, col)
      );
    });
  });
};

export const convertListOfClass = () => {
  var htmlOutput = HtmlService.createHtmlOutput(
    `<p>Converting lists of classes in full name is not implemented yet.</p>
    <p>This feature will be available in the near future.</p>`
  )
    .setWidth(250)
    .setHeight(300);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Oops!');
  // let sheet = SpreadsheetApp.getActiveSheet(),
  //   kStr = sheet.getSheetName(),
  //   kNum = kStr.substring(1),
  //   dsKhoiLop = ss
  //     .getActive()
  //     .getSheetByName('DS_KHOI_LOP'),
  //   dsFinder = dsKhoiLop
  //     .createTextFinder(kNum)
  //     .findNext(),
  //   row = dsFinder
  //     .getRowIndex(),
  //   col = dsFinder.getColumnIndex() + 3,
  //   classNum = dsKhoiLop.getRange(row, col).getValue();

  // for (let i = 1; i <= classNum; i++) {
  //   let classCell = sheet.getRange(1, i),
  //     className = classCell.getValue();
  //   if (className.slice(className.length - 2) != classNum) {
  //     if (isNaN(parseInt(className.slice(className.length - 1)))) {
  //       className = className.slice(className.length - 1) + kNum;
  //     } else {
  //       className = className.substring(2) + '-' + kStr;
  //     }
  //     classCell.setValue([className]);
  //   }
  // }
};
