$(document).ready(function () {
  let storageKey = 'todolist';
  let items;
  let input = $('input[name="task"]');
  let table = $('#table');
  let emptyAlert = $('#empty-alert');

  function init() {
    getItems();
    update();
    $('#form').on('submit', createItem);
  }

  function getItems() {
    let data = localStorage.getItem(storageKey);
    data = data !== undefined ? JSON.parse(data) : [];
    items = Array.isArray(data) ? data : [];
    table.empty();
    items.forEach(buildItem);
  }

  function update() {
    localStorage.setItem(storageKey, JSON.stringify(items));
    emptyAlert.toggleClass('d-none', Boolean(items.length));
  }

  function buildItem(item) {
    const row = $('<tr>');
    const cbCol = $('<td>');
    const cbInput = $('<input>');
    const contentCol = $('<td>');
    const delBtnCol = $('<td>');
    const delBtn = $('<button>');
    const delBtnIcon = $('<i>');

    row.append(cbCol, contentCol, delBtnCol);

    cbCol.append(cbInput);

    cbInput.addClass('form-check-input');
    cbInput.attr('type', 'checkbox');
    cbInput.prop('checked', item.done);
    cbInput.change(function () {
      updateItem(item, $(this), contentCol);
    });

    contentCol.text(item.content);
    contentCol.addClass('w-100');
    contentCol.toggleClass('text-decoration-line-through', item.done);

    delBtnCol.append(delBtn);

    delBtn.append(delBtnIcon);
    delBtn.addClass('btn btn-secondary btn-sm');
    delBtn.attr('type', 'button');
    delBtn.click(function () {
      deleteItem(item.id, row);
    });

    delBtnIcon.addClass('bi bi-trash3-fill');

    table.append(row);
  }

  function createItem(event) {
    event.preventDefault();

    const item = {
      id: Date.now(),
      content: input.val(),
      done: false,
    };

    buildItem(item);
    items.push(item);
    update();
    input.val('');
  }

  function updateItem(item, input, content) {
    item.done = input.is(':checked');
    content.toggleClass('text-decoration-line-through', item.done);
    update();
  }

  function deleteItem(id, row) {
    const index = items.findIndex(item => item.id === id);

    if (confirm('Você realmente deseja excluir essa tarefa?')) {
      items.splice(index, 1);
      update();
      row.remove();
    }
  }

  init();
});
