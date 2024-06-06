function highlight(table) {
  const tableHeadRowCells = table.tHead.rows[0].cells;
  let statusIndex = null;
  let genderIndex = null;
  let ageIndex = null;
  
  for (const cell of tableHeadRowCells) {
    if (cell.textContent === 'Age') {
      ageIndex = cell.cellIndex;
      continue;
    }
    
    if (cell.textContent === 'Gender') {
      genderIndex = cell.cellIndex;
      continue;
    }
    
    if (cell.textContent === 'Status') {
      statusIndex = cell.cellIndex;
      continue;
    }
  }
  
  const tableBody = table.querySelector('tbody');
  const tableBodyRows = Array.from(tableBody.querySelectorAll('tr'));
  
  for (const tableBodyRow of tableBodyRows) {
    const bodyRowCellsArr = Array.from(tableBodyRow.cells);
    
    if (parseInt(bodyRowCellsArr[ageIndex].textContent) < 18) {
      tableBodyRow.style="text-decoration: line-through";
    }
    
    if (bodyRowCellsArr[genderIndex].textContent === 'm') {
      tableBodyRow.classList.add('male');
    }
    
    if (bodyRowCellsArr[genderIndex].textContent === 'f') {
      tableBodyRow.classList.add('female');
    }
    
    if (!bodyRowCellsArr[statusIndex].dataset.available) {
      tableBodyRow.setAttribute('hidden', 'true');
      continue;
    }
    
    if (bodyRowCellsArr[statusIndex].dataset.available === 'true') {
      tableBodyRow.classList.add('available');
      tableBodyRow.classList.remove('unavailable');
    } else {
      tableBodyRow.classList.add('unavailable');
      tableBodyRow.classList.remove('available');
    }
  }
}
