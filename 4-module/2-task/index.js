function makeDiagonalRed(table) {
  const rowsArr = Array.from(table.rows);
  
  for (const row of rowsArr) {
    const cellsArr = Array.from(row.cells);
    for (const cell of cellsArr) {
      if (cell.cellIndex === row.rowIndex) {
        cell.style.backgroundColor = 'red';
      }
    }
  }
}
