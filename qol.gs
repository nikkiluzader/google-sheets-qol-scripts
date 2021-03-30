function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Scripts");
  menu.addItem("combine", "combine");
  menu.addItem("regex shift", "xShift");
  menu.addItem("regex move", "xMove");
  menu.addItem("fill blanks left", "fillBlanksLeft");
  menu.addItem("test", "test");
  menu.addToUi();

}

////////////////////////////////////////////////////////////////////////////////////////

function test() {
  try {
  }
  catch (err) {
    ui.alert(err);
  }
}

////////////////////////////////////////////////////////////////////////////////////////

function fnTemplate() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const as = ss.getActiveSheet();
  const ar = as.getActiveRange();
  const asv = as.getDataRange().getValues();
  const arv = ar.getValues();
}

////////////////////////////////////////////////////////////////////////////////////////

function combine() {

  // combine values of two adjacent columns, seperated by a space
  // only works with a selection. selection can only be two adjacent columns wide.
  // if your selection is larger then two columns, it will only combine the first two columns

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const as = ss.getActiveSheet();
  const ar = as.getActiveRange();
  const vals = ar.getValues();


  for (let x = 0; x < vals.length; x++) {
    vals[x][0] = vals[x][0] + " " + vals[x][1]; //col1 = col1 + col2
    vals[x][1] = ''; //col2 is empty string
  }

  ar.setValues(vals);

}

////////////////////////////////////////////////////////////////////////////////////////

function xShift() {

  // shift all cells containing your regex to the right by one column
  // an input box will apear to take your regex parameter
  // if there is data in the adjacent column, it will be replaced with your text parameter
  // only works with a selection. selection can only be two adjacent columns wide.
  // if your selection is larger then two columns, it will only modify the first two columns

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const as = ss.getActiveSheet();
  const ar = as.getActiveRange();
  const vals = ar.getValues();

  const response = ui.prompt('input regex');
  const regExp = new RegExp(response.getResponseText());

  for (let r = 0; r < vals.length; r++) {
    if (regExp.exec(vals[r][0])) {
      let c;
      const cols = [];
      for (c = 0; c < vals[r].length; c++) {
        if (c == 0) {
          cols[c + 1] = vals[r][c];
          cols[c] = "";
        }
        else {
          cols[c + 1] = vals[r][c];
        }
      }
      for (c = 0; c < vals[r].length; c++) {
        vals[r][c] = cols[c];
      }
    }
  }
  ar.setValues(vals);
}

////////////////////////////////////////////////////////////////////////////////////////

function xMove() {

  // move all matching cells from your selection to a single column of your choice (regex used for matching)
  // matches will move to the chosen column and maintain their row
  // an input box will apear to take your regex parameter
  // only works with a selection. selection can only be as large as you want
  // selection must start on row 1
  // if there are multiple matches in the same row, they will not be combined, only one match will move to the new column

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const as = ss.getActiveSheet();
  const ar = as.getActiveRange();

  const vals = ar.getValues();

  const respRegex = ui.prompt('input regex');
  const respCol = ui.prompt('move values to what column?');
  const mr = as.getRange(respCol.getResponseText() + ar.getRowIndex() + ':' + respCol.getResponseText() + (ar.getHeight() + ar.getRowIndex() - 1).toString());
  const mrVals = mr.getValues();
  const regExp = new RegExp(respRegex.getResponseText());

  ui.alert("moving data to " + mr.getA1Notation());

  for (let r = 0; r < vals.length; r++) {
    const row = vals[r];
    for (let c = 0; c < row.length; c++) {
      const col = row[c];
      if (regExp.exec(col) != null) {
        mrVals[r][0] = col;
        vals[r][c] = "";
      }
    }
  }
  mr.setValues(mrVals);
  ar.setValues(vals);
}

////////////////////////////////////////////////////////////////////////////////////////

function fillBlanksLeft() {

  // shift all data to the left, filling any available blank cells
  // only works witha selection, selection can be as large as you want

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const as = ss.getActiveSheet();
  const ar = as.getActiveRange();
  const vals = ar.getValues();

  for (let r = 0; r < vals.length; r++) {
    const row = vals[r];
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell == "" && row[c + 1] == "") {
        continue;
      }
      else if (cell == "" && row[c + 1] != undefined) {
        for (c; c < row.length; c++)
          if (row[c + 1] == undefined) {
            vals[r][c] = "";
          }
          else {
            if (row[c + 1] == "") {
              continue;
            }
            else {
              vals[r][c] = row[c + 1];
              vals[r][c + 1] = "";
            }
          }
      }
    }
  }
  ar.setValues(vals);
}

////////////////////////////////////////////////////////////////////////////////////////

