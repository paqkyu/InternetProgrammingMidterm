//stores the tasks in memory so they stay when page is refreshed
let tasks = JSON.parse(localStorage.getItem("stefGymTasks")) || [];
let editIndex = null;
const taskForm = $("#taskForm");
const taskName = $("#taskName");
const taskDescription = $("#taskDescription");
const taskdueDate = $("#taskdueDate");
const taskPriority = $("#taskPriority");
const taskTableBody = $("#taskTableBody");

function saveTasks() {
    localStorage.setItem("stefGymTasks", JSON.stringify(tasks));
}
function updateSummary() {
    $("#totalTasks").text(tasks.length);
    $("#completedTasks").text(tasks.filter(task=>task.status === "Completed").length);
    $("#pendingTasks").text(tasks.filter(task=>task.status === "Pending").length);
}
function renderTasks() {
    taskTableBody.empty();

    let statusFilter =$("#statusFilter").val();
    let priorityFilter =$("#priorityFilter").val();
    let sortOption =$("#sortTasks").val();

    let filteredTasks = [...tasks];

    if (statusFilter !=="all") {
        filteredTasks = filteredTasks.filter(task=>task.status.toLowerCase() === statusFilter);
    }
    if (priorityFilter !=="all") {
        filteredTasks = filteredTasks.filter(task=>task.priority === priorityFilter);
    }
    if (sortOption === "name") {
        filteredTasks.sort((a, b)=>a.name.localeCompare(b.name));
    }
    if (sortOption ==="date") {
        filteredTasks.sort((a,b)=>new Date(a.dueDate) - new Date(b.dueDate));;
    }
    filteredTasks.forEach((task)=> {
        const originalIndex = tasks.indexOf(task);

        const priorityClass = task.priority.toLowerCase();
        const statusClass = task.status.toLowerCase();

        taskTableBody.append(`
            <tr>
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td>${task.dueDate}</td>
                <td><span class="badge priority-${priorityClass}">${task.priority}</span></td>
                <td><span class="badge status-${statusClass}">${task.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-success complete-btn" data-index="${originalIndex}">
                        Complete
                    </button>
                    <button class="btn btn-sm btn-warning edit-btn" data-index="${originalIndex}">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${originalIndex}">
                        Delete
                    </button>
                </td>
            </tr>
                `);
    });
    updateSummary();
}
taskForm.on("submit", function (event) {
    event.preventDefault()

    const name = taskName.val().trim();
    const description = taskDescription.val().trim();
    const dueDate = taskdueDate.val();
    const priority = taskPriority.val();

    if (name==="" || description==="" || dueDate ===""||priority==="") {
        alert("Fill in all fields");
        return;
    }
    const taskData = {
        name: name,
        description: description,
        dueDate: dueDate,
        priority: priority,
        status: "Pending"
    };
    if (editIndex === null) {
        tasks.push(taskData);
    } else {
        tasks[editIndex] = taskData;
        editIndex = null
        $("#taskForm button[type='submit']").text("Add Text");
    }
    saveTasks();
    renderTasks();
    taskForm[0].reset();
});
$(document).on("click", ".delete-btn", function() {
    const index = $(this).data("index");
    
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
});
$(document).on("click",".complete-btn", function() {
    const index =$(this).data("index");
    tasks[index].status="Completed";

    saveTasks();
    renderTasks();
});
$(document).on("click", ".edit-btn", function() {
    const index =$(this).data("index");
    const task = tasks[index];

    taskName.val(task.name);
    taskDescription.val(task.description);
    taskdueDate.val(task.dueDate);
    taskPriority.val(task.priority);

    editIndex=index;
    $("#taskForm button[type='submit']").text("Update Task");
});
$("#statusFilter, #priorityFilter, #sortTasks").on("change", renderTasks);

$(document).ready(function () {
    renderTasks();
});