// Retrieve tasks and nextId from localStorage
// Here we are saying or [] for if we have no data yet and same goes with nextId as if we have no id we need to set it to 1 otherwise it would be null
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
let taskId = nextId - 1;

// This function is used to generate the next taskId
function generateTaskId() {
    return nextId++;
}

// This function is used to create the cards themselves using the information collected in the form
// This is how it will be structured on the HTML page.
function createTaskCard(task) {
    let card = `
    <div id="task-${task.id}" class="card task-card mb-3" data-task-id="${task.id}">
        <div class="card-header">    
            <h5 class="card-title">${task.title}</h5>
        </div>
        <div class="card-body">
            <p class="card-text">${task.description}</p>
            <p class="card-text">Due Date: ${task.dueDate}</p>
            <button class="btn btn-danger delete-task">Delete</button>
        </div>
    </div>
    `;
    return card;
}

// This function renders the cards on the page by first removing any to stop having duplicates rendered.
// It then generates the cards via the taskList until each once has been generated.
function renderTaskList() {
    $(".lane .task-card").remove();
    taskList.forEach(task => {
        $(`#${task.status}-cards`).append(createTaskCard(task));
        applyStyle(task.id);
    });
    // This handles the draggable cards and makes it so if they are placed somewhere they cannot
    // attach to, they revert back to where they were with no animation time.
    $(".task-card").draggable({
        revert: function(droppable) {
            return !droppable;
        },
        revertDuration: 0,
        zIndex: 1000
    });
}

// This function handles adding a new task but first to help with not having the tasks not generate endlessly,
// it runs an if check and if there are no tasks saved in the array, it sets the nextId to 1 and saves it in storage first
// Next it grabs the data from the form and puts it into an object to be saved to the array.
function handleAddTask(event){
    if(taskList.length === 0){
        nextId = 1;
        localStorage.setItem("nextId", nextId);
    }
    event.preventDefault();
    let title = $("#task-title").val();
    let description = $("#task-description").val();
    let dueDate = $("#task-due-date").val();
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "to-do"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    renderTaskList();
    $("#formModal").modal("hide");
}

// This function handles deleting a task, when a user clicks on the delete button, it removes that specific task
// from the array and sets the taskList to be without the deleted task and reload the list.
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".task-card").data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// This function handles when you drop a task after dragging it, making sure it falls into one of the three coloums
// it then updates the status to match its new coloumn and save it to localStorage so that when the page
// is refreshed it will still stay in the same location.
function handleDrop(event, ui) {
    let taskId = ui.draggable.data("task-id");
    let newStatus = $(event.target).closest(".lane").attr("id");
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    taskList[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    // This check here is to see when a task is dropped into the "Done" section and set them to the default grey colorscheme
    let taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
        if (newStatus === "done") {
            taskElement.style.backgroundColor = 'lightgray';
            taskElement.style.color = 'black';
        } else {
            applyStyle(taskId);
        }
    }
}

// This function runs when the page is loaded, it allows us to have a datepicker for when we select
// our date in the form. We also run the renderTaskList function to display all tasks saved from localStorage
// it also handles adding the form when selecting the submit button on the modal.
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

// This function was created to handle the stlying for the tasks based on the Due Date. if the task is overdue 
function applyStyle(taskId) {
    let taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
        let task = taskList.find(task => task.id === taskId);
        if (task) {
            // Get today's date using day.js
            let today = dayjs().startOf('day');

            // Parse the due date
            let dueDate = dayjs(task.dueDate).startOf('day');

            // Calculate difference in days
            let diffDays = dueDate.diff(today, 'day');

            // Apply color based on due date
            if (diffDays < 0) {
                // Past due (Red)
                taskElement.style.backgroundColor = 'darkred';
                taskElement.style.color = 'white';
                taskElement.querySelector(`.card-header`).style.backgroundColor = `red`;
            } else if (diffDays <= 1) {
                // Due within 2 days (Yellow)
                taskElement.style.backgroundColor = '#FFE066';
                taskElement.style.color = 'black';
                taskElement.querySelector(`.card-header`).style.backgroundColor = `yellow`;
            } else {
                // Otherwise its default (Grey)
                taskElement.style.backgroundColor = 'lightgray';
                taskElement.style.color = 'black';
                taskElement.querySelector(`.card-header`).style.backgroundColor = `lightgrey`;
            }
        }
        // We also have our check here if a task is in the "Done" section to style it as we call this function when the page loads
        if (task && task.status === "done") {
        taskElement.style.backgroundColor = 'lightgray';
        taskElement.style.color = 'black';
        taskElement.querySelector(`.card-header`).style.backgroundColor = `lightgrey`;
        }
    }
}