export const setCellValue = 
  (currentSheet: GoogleAppsScript.Spreadsheet.Sheet, value: any, row: number, col: number) => 
    currentSheet
      .getRange(row, col)
      .setValue(value)
      .setBorder(true, true, true, true, null, null)
      .setVerticalAlignment('middle')
      .setHorizontalAlignment('center');