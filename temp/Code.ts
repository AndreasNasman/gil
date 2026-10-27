// Original code from https://github.com/jamiewilson/form-to-google-sheets
// Updated for 2021 and ES6 standards

const sheetName = "Sheet1";
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty("spreadsheetId", activeSpreadsheet.getId());
}

function doGet() {
  const spreadsheetId = scriptProp.getProperty("spreadsheetId");

  if (!spreadsheetId) {
    throw new Error(
      `Spreadsheet ID "${spreadsheetId}" missing in script properties.`,
    );
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in the spreadsheet.`);
  }

  const data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();
  const headers = data[0];

  if (!headers) {
    throw new Error(`There was a problem retrieving headers.`);
  }

  const toReturn = headers.map((header, headerIndex) => ({
    header: header,
    values: data.slice(1).map((row) => row[headerIndex]).filter((value) =>
      value != ""
    ),
  }));
  console.log(toReturn);

  return ContentService
    .createTextOutput(JSON.stringify(toReturn))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event: GoogleAppsScript.Events.DoPost) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const spreadsheetId = scriptProp.getProperty("spreadsheetId");

    if (!spreadsheetId) {
      throw new Error(
        `Spreadsheet ID "${spreadsheetId}" missing in script properties.`,
      );
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in the spreadsheet.`);
    }

    const headers =
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    if (!headers) {
      throw new Error(`There was a problem retrieving headers.`);
    }

    const newRow = headers.map(function (header) {
      return header === "Date" ? new Date() : event.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
