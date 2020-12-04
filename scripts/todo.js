let showPopup = false;
let showDropdown = false;
let i = 0;

document.getElementById("todoButton").addEventListener("click", () => {
    onToDoClick();
});

document.getElementById("todoMenu").addEventListener("click", () => {
    onToDoMenuClick();
});

document.getElementById("todoDelete").addEventListener("click", () => {
    document.getElementById("todoList").innerHTML = "";
    deleteTask();
    onToDoMenuClick();
});

document.getElementById("todoInput").addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        let task = document.getElementById("todoInput").value;
        if (task) {
            addTask(task);
            document.getElementById("todoList").appendChild(createListItem(false, task));
            document.getElementById("todoInput").value = "";
        }
    }
});

function onToDoClick() {
    showPopup = !showPopup;
    if (!showPopup) {
        document.getElementById("todoListContainer").classList.add("todo-list-hide");
    } else {
        document.getElementById("todoListContainer").classList.remove("todo-list-hide");
    }

    if (showDropdown) {
        onToDoMenuClick();
    }
}

function onToDoMenuClick() {
    showDropdown = !showDropdown;
    if (!showDropdown) {
        document.getElementById("todoDropdown").classList.add("todo-list-dropdown-hide");
    } else {
        document.getElementById("todoDropdown").classList.remove("todo-list-dropdown-hide");
    }
}

function getTask() {
    i = 0;
    let todolist = JSON.parse(window.localStorage.getItem("todolist"));
    if (typeof todolist == "undefined" || todolist == null) {
        todolist = [{checked: false, text: "Create awesome new task"}];
        window.localStorage.setItem("todolist", JSON.stringify(todolist));
    }
    todolist.forEach(task  => {
        document.getElementById("todoList").appendChild(createListItem(task.checked, task.text));
    });
}

function addTask(task) {
    let todolist = [];
    todolist = JSON.parse(window.localStorage.getItem("todolist"));
    todolist.push({checked: false, text: task});
    window.localStorage.setItem("todolist", JSON.stringify(todolist));
}

function checkTask(index, checked) {
    let todolist = [];
    todolist = JSON.parse(window.localStorage.getItem("todolist"));
    debugger
    todolist[index].checked = checked;
    window.localStorage.setItem("todolist", JSON.stringify(todolist));
}

function deleteTask() {
    window.localStorage.setItem("todolist", JSON.stringify([]));
}

function createListItem(checked, task) {
    const listItemNode = document.createElement("li");
    listItemNode.classList.add("todo-list-content-list-item");

    const checkBoxNode = document.createElement("input");
    checkBoxNode.classList.add("todo-list-content-list-item-checkbox");
    checkBoxNode.type = "checkbox";
    checkBoxNode.checked = checked;
    checkBoxNode.addEventListener("change", (event) => {
        let index = event.target.index;
        let checked = event.target.value;
        checkTask(index, checked);
    });
    checkBoxNode.index = i;
    i++;

    const spanNode = document.createElement("span");
    spanNode.classList.add("todo-list-content-list-item-text");
    spanNode.innerText = task;

    listItemNode.appendChild(checkBoxNode);
    listItemNode.appendChild(spanNode);

    return listItemNode;
}

getTask();