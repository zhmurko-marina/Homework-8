/**
 * Created by Marina on 21.11.2016.
 */
$(document).ready(function () {

    var $mainList = $("#todoList");

    function Task(taskValue, isChecked) {
        this.taskValue = taskValue;
        this.isChecked = isChecked;
    }

    function getTasks() {
        var tasks = [];
        var tasksJson = localStorage.getItem('todo');
        if (tasksJson != null) {
            tasks = JSON.parse(tasksJson);
        }
        return tasks;
    }

    $('#addTask').on('click', function () {
        var tasks = getTasks();
        var $item = $("#todoInput").val();
        if ($item) {
            var newToDo = new Task($item, false);
            tasks.push(newToDo);
        }
        localStorage.setItem("todo", JSON.stringify(tasks));
        $("#todoInput").val('');
        redraw();
    });

    function redraw() {
        var tasks = getTasks();
        var taskList = document.getElementById('todoList');
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].isChecked) {
                $("#todoList").append("<li class='row valign-wrapper' id=" + i + ">" +
                    "<p class='valign checked'>" + tasks[i].taskValue + "</p>" +
                    "<button class='btn button-edit blue lighten-1'>edit</button>" +
                    "<button class='btn button-delete pink darken-1'>✕</button></li>");
            }
            else{
                $("#todoList").append("<li class='row valign-wrapper' id=" + i + ">" +
                    "<p class='valign'>" + tasks[i].taskValue + "</p>" +
                    "<button class='btn button-edit blue lighten-1'>edit</button>" +
                    "<button class='btn button-delete pink darken-1'>✕</button></li>");
            }
        }
        countTasks();
    }

    $('#todoInput').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#addTask').click();
        }
    });

    $mainList.on('click', 'li p', function (e) {
        var tasks = getTasks();
        $(this).toggleClass("checked");
        if ($(this).hasClass('checked')) {
            tasks[this.parentNode.id].isChecked = true;
        }
        else {
            tasks[this.parentNode.id].isChecked = false;
        }
        localStorage.setItem('todo', JSON.stringify(tasks));
        countTasks();
    });



    $mainList.on('click', '.button-delete', function (e) {
        var tasks = getTasks();
        e = e.target.parentNode;
        tasks.splice(e.getAttribute('id'), 1);
        localStorage.setItem("todo", JSON.stringify(tasks));
        redraw();
        return false;
    });

    $mainList.on('click', '.button-edit', function (e) {
        var tasks = getTasks();
        var id = $(this).parent().attr('id');
        $('body').append("<div class='edit'><div id='edit'>" +
            "<input id='editInput'>" +
            "<button class='btn button-save blue lighten-1'>save</button>" +
            "<button class='btn button-cancel pink darken-1'>cancel</button>" +
            "</div></div>");

        $('#editInput').val($(this).siblings('p')[0].innerHTML);

        $("#edit").on('click', '.button-cancel', function (event) {
            var $div = event.target.parentNode;
            $div = $div.parentNode;
            $div.parentNode.removeChild($div);
        });

        $("#edit").on('click', '.button-save', function (event) {
            var $div = event.target.parentNode;
            tasks[id].taskValue = $('#editInput').val();
            localStorage.setItem('todo', JSON.stringify(tasks));
            $div = $div.parentNode;
            $div.parentNode.removeChild($div);
            redraw();
        });

    });
    $mainList.sortable({

        connectWith: $("#todoList"),
        update: function(event, ui) {
            var tasks = getTasks();
            var order = $(this).sortable('toArray');

            for(var i=0; i<$("#todoList li").length; i++) {
                tasks[i].taskValue = $('#todoList li#'+order[i]+' p').text();
                tasks[i].isChecked = $('#todoList li#'+order[i]+' p').hasClass('checked') ? true : false;


            }
            localStorage.setItem('todo', JSON.stringify(tasks));
            console.log(tasks);
            redraw();
        }
    });

    function countTasks() {
        var $allTasks = $('li');
        var $checkedTasks = $('.checked');
        document.getElementById("countOfDone").textContent = $checkedTasks.length;
        document.getElementById("countOfAll").textContent = $allTasks.length;
        document.getElementById("countOfNotDone").textContent = $allTasks.length - $checkedTasks.length;
    }
    redraw();
    countTasks();

});