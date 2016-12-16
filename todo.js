/**
 * Created by Marina on 21.11.2016.
 */
$(document).ready(function () {

    var $mainList = $('#todoList');
    var tasks;
    var tasksJson = localStorage.getItem('todo');
    tasks = tasksJson != null ? JSON.parse(tasksJson) : [];

    function Task(taskValue, isChecked) {
        this.taskValue = taskValue;
        this.isChecked = isChecked;
    }

    $('#addTask').on('click', function () {
        var $item = $('#todoInput').val();
        if ($item) {
            var newToDo = new Task($item, false);
            tasks.push(newToDo);
            $('#todoList').append("<li class='row valign-wrapper' id=" + (tasks.length - 1) + ">" +
                "<p class='valign'>" + $item + "</p>" +
                "<button class='btn button-edit blue lighten-1'>edit</button>" +
                "<button class='btn button-delete pink darken-1'>✕</button></li>");
        }
        save();
        $('#todoInput').val('');
    });

    function redraw() {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].isChecked) {
                $('#todoList').append("<li class='row valign-wrapper' id=" + i + ">" +
                    "<p class='valign checked'>" + tasks[i].taskValue + "</p>" +
                    "<button class='btn button-edit blue lighten-1'>edit</button>" +
                    "<button class='btn button-delete pink darken-1'>✕</button></li>");
            }
            else {
                $('#todoList').append("<li class='row valign-wrapper' id=" + i + ">" +
                    "<p class='valign'>" + tasks[i].taskValue + "</p>" +
                    "<button class='btn button-edit blue lighten-1'>edit</button>" +
                    "<button class='btn button-delete pink darken-1'>✕</button></li>");
            }
        }
        $('#listContainer').append($('#todoList'));
        countTasks();
    }

    $('#todoInput').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#addTask').click();
        }
    });

    $mainList.on('click', 'li p', function (e) {
        $(this).toggleClass('checked');
        for(var i=0; i<tasks.length; i++){
            if(tasks[i].taskValue == $(this).text() && $(this).hasClass('checked') ){
                tasks[i].isChecked = true;
            }
            else if(tasks[i].taskValue == $(this).text()){
                tasks[i].isChecked = false;
            }
        }
        save();
        countTasks();
    });

    $mainList.on('click', '.button-delete', function (e) {
        e = $(e.target).parent();
        tasks.splice(e.getAttribute('id'), 1);
        $(this).parent().fadeOut('slow');
        save();
    });

    $mainList.on('click', '.button-edit', function (e) {
        var id = $(this).parent().attr('id');
        $('body').append("<div class='edit'><div id='edit'>" +
            "<input id='editInput'>" +
            "<button class='btn button-save blue lighten-1'>save</button>" +
            "<button class='btn button-cancel pink darken-1'>cancel</button>" +
            "</div></div>");

        $('#editInput').val($(this).siblings('p')[0].innerHTML);

        $('#edit').on('click', '.button-cancel', function (event) {
            var $div = $(event.target).parent();
            $div.parent().remove();
        });

        $('#edit').on('click', '.button-save', function (event) {
            var $div = $(event.target).parent();
            tasks[id].taskValue = $('#editInput').val();
            $('li#' + id + ' p').text(tasks[id].taskValue);
            save();
            $div.parent().remove();
        });

    });
    $mainList.sortable({
        connectWith: $('#todoList'),
        update: function (event, ui) {
            var order = $(this).sortable('toArray');
            for (var i = 0; i < $('#todoList li').length; i++) {
                tasks[i].taskValue = $('#todoList li#' + order[i] + ' p').text();
                tasks[i].isChecked = $('#todoList li#' + order[i] + ' p').hasClass('checked') ? true : false;
                save();
            }

        }
    });

    function countTasks() {
        var $allTasks = $('li');
        var $checkedTasks = $('.checked');
        $('#countOfDone').text($checkedTasks.length);
        $('#countOfAll').text($allTasks.length);
        $('#countOfNotDone').text($allTasks.length - $checkedTasks.length);
    }

    function save() {
        localStorage.setItem('todo', JSON.stringify(tasks));
    }

    redraw();
    countTasks();
});