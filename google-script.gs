function doGet(e) {
    try {
      // Catch any errors and ouput in JSON format.
      // Grab the main sheet of the spreadsheet and convert the actual entries into a parsable array.
      var sheet = SpreadsheetApp.getActiveSheet();
      var arr = sheet.getSheetValues(
        1, 1,
        sheet.getLastRow(),
        sheet.getLastColumn()
      );
      
      return ContentService.createTextOutput(
        JSON.stringify({
          status: '200',
          messages: arr
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: '500',
          error: err
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }