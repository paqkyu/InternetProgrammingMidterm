//Stores tasks in localStorage. If no tasks exist, creates an empty array
let tasks = JSON.parse(localStorage.getItem("stefGymTasks")) || [];
let editIndex = null; //tracks which task is being edited
const taskForm = $("#taskForm");
const taskName = $("#taskName");
const taskDescription = $("#taskDescription");
const taskdueDate = $("#taskdueDate");
const taskPriority = $("#taskPriority");
const taskTableBody = $("#taskTableBody");

//Function that saves the current tasks array to localStorage
function saveTasks() {
    localStorage.setItem("stefGymTasks", JSON.stringify(tasks));
}
//updates the task summary counters
function updateSummary() {
    $("#totalTasks").text(tasks.length);
    $("#completedTasks").text(tasks.filter(task=>task.status === "Completed").length);
    $("#pendingTasks").text(tasks.filter(task=>task.status === "Pending").length);
}
//Renders the tasks in the table based on selected filters and sorting options;
function renderTasks() {
    taskTableBody.empty(); //clearing the table before rebuilding
    //Filter and sort selections
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

        //Creates new table row (<tr>) for every task and adds it to the table
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
    updateCharts();
}
//function that enforces character constraints
taskForm.on("submit", function (event) {
    event.preventDefault()

    const name = taskName.val().trim();
    const description = taskDescription.val().trim();
    const dueDate = taskdueDate.val();
    const priority = taskPriority.val();

    if(name.length > 30) {
        alert("Name cannot exceed 30 characters");
        return;
    }
    if(description.length > 50) {
        alert("Description cannot exceed 50 characters");
        return;
    }

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
let statusChart;
let priorityChart;

function updateCharts(){
    //new arrays based on status and priority
    const completed = tasks.filter(task=>task.status ==="Completed").length;
    const pending = tasks.filter(task=>task.status ==="Pending").length;

    const high = tasks.filter(task=>task.priority ==="High").length;
    const medium = tasks.filter(task=>task.priority ==="Medium").length;
    const low = tasks.filter(task=>task.priority ==="Low").length;

    //checks if chart exists and if it does it deletes it. This is done because otherwise, charts would render on top of one another
    if (statusChart) {
        statusChart.destroy();
    }
    if (priorityChart){
        priorityChart.destroy();
    }
    //creates new chart. [0] is used because it $ returns a jquery object.
    statusChart = new Chart($("#statusChart")[0], {
        type: "bar",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                label: "Tasks",
                data: [completed, pending],
                backgroundColor: ["#2ec1ac", "#ffc107"]
            }]
        }
    });
    priorityChart = new Chart($("#priorityChart")[0], {
        type: "pie",
        data: {
            labels: ["High", "Medium", "Low"], //slices of the pie
            datasets: [{
                data: [high, medium, low],
                backgroundColor: ["#dc3545", "#ffc107", "#198754"]
            }]
        }
    });
};