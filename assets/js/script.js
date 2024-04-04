// Retrieve tasks and nextId from localStorage
// Here we are saying or [] for if we have no data yet and same goes with nextId as if we have no id we need to set it to 1 otherwise it would be null
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = `
    <div id="task${task.id}" class="card task-card mb-3" data-task-id=${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text">${task.dueDate}</p>
            <button class="btn btn-danger delete-task">Delete</button>
        </div>
    </div>
    `;
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        $(`#${task.status}-cards`).append(createTaskCard(task));
        // to add in a function call to add styles to each card6
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $("#task-title").val();
    let description = $("#task-description").val();
    let dueDate = $("#task-due-date").val();
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "todo"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#task-due-date").datepicker();
    renderTaskList();
    $("#formModal form").submit(handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
});

// make a function to add styles to each card
// function addStyles(taskId) {

// }