/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this._table = this._tableTemplate();
    
    this._addEventListener();
  }
  
  get elem() {
    return this._table;
  }
  
  _tableTemplate() {
    const table = document.createElement('table');
    table.insertAdjacentHTML('afterbegin',`
      <thead>
        <tr>
          <th>Имя</th>
          <th>Возраст</th>
          <th>Зарплата</th>
          <th>Город</th>
          <th></th>
        </tr>
      </thead>`
    );
    
    if (this.rows.length !== 0) table.append( this._generateTableRows() );
    
    return table;
  }
  
  _generateTableRows() {
    const tableBody = document.createElement('tbody');
    
    for (const {name, age, salary, city} of this.rows) {
      tableBody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${name}</td>
          <td>${age}</td>
          <td>${salary}</td>
          <td>${city}</td>
          <td><button>X</button></td>
        </tr>`)
    }
    
    return tableBody;
  }
  
  _removeRow(event) {
    if (event.target.textContent === 'X' && event.target.closest('button')) {
      event.target.closest('tr').remove();
    }
  }
  
  _addEventListener() {
    this._table.addEventListener('click', this._removeRow);
  }
}
