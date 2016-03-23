$(document).ready(function() {

    $('#submit-button').on('click', postData);
    getData();
    $('.tasks').on('click', '.change-status', updateTask);
    $('.tasks').on('click', '.delete-task', deleteTask);

});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#task-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: render
          //  console.log(data);

    });
}
function render(data) {
  console.log(data);
  var $tasks = $('.tasks');
  $tasks.empty();
  $tasks.append('<div class="task-list"></div>');
  var $el = $tasks.children().last();
  data.forEach(function (element) {
    $el.append('<p>Task: ' + element.task + '<br>' +
    '<p>Completed: ' + element.status + '<br>' + '<br>' +
    '<button class="change-status">Done!</button>' + ' ' +
    '<button class="delete-task">Delete Task</button>' + '</p>');
  });
  $('#task-form').trigger('reset');
}

function deleteTask() {
    $.ajax({
      type: 'DELETE',
      url: '/tasks',
      success: getData
    });
  }


// Updates data in the database
function updateTask() {
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    success: getData
  });
}
