import { applyFirstLevelValidation } from "../dropdown";
import { setMapOfClass, setNumberOfClass } from "../school-info/class";

export const onEdit = (e: GoogleAppsScript.Events.SheetsOnEdit) => {  
  let hostWsOptions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CNN");
  let hostWsUrl = hostWsOptions.getRange("WS_URL").getValue().toString();
  let hostWs = SpreadsheetApp.openById(hostWsUrl);

  let activeCell = e.range,
    val = activeCell.getValue().toString(),
    row = activeCell.getRow(),
    col = activeCell.getColumn(),
    wsName = activeCell.getSheet().getName();
   
  switch (wsName) {
    case "DS_KHOI_LOP":
      if (col === 3 && row > 4) {
        setMapOfClass();
      }
      if ((col === 4 || col === 5) && row > 4) {
        setNumberOfClass();
        setMapOfClass();
      }
      break;
    case ".../...":
      let currentDataRange = SpreadsheetApp
        .getActive()
        .getRangeByName(".../...!CURRENT_DATA");

      let validationColumn = currentDataRange.getColumn(),
        validationRow = currentDataRange.getRow();

      if (col === validationColumn && row >= validationRow) {
        let ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(".../...");
        applyFirstLevelValidation(ws, hostWs, val, row, validationColumn);
      }
      break;
    default:
      break;
  }
}