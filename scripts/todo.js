window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

let db;
const dbName = "todoDatabase";

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    document.getElementById("todoButton").parentElement.classList.add("todo-hide");
} else {
    let request = indexedDB.open(dbName, 1);
    request.onerror = function (event) {
        console.log("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
    };
}

let showPopup = false;

document.getElementById("todoButton").addEventListener("click", () => {
    onToDoClick();
});

document.getElementById("todoInput").addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        let task = document.getElementById("todoInput").value;
        if (task) {
            // addTask(task);
            document.getElementById("todoList").appendChild(createListItem(task));
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
}

// function addTask(task) {
//     window.localStorage.setItem("mydata", task);
// }

function createListItem(task) {
    const listItemNode = document.createElement("li");
    listItemNode.classList.add("todo-list-content-list-item");

    const checkBoxNode = document.createElement("input");
    checkBoxNode.classList.add("todo-list-content-list-item-checkbox");
    checkBoxNode.type = "checkbox";

    const spanNode = document.createElement("span");
    spanNode.classList.add("todo-list-content-list-item-text");
    spanNode.innerText = task;

    listItemNode.appendChild(checkBoxNode);
    listItemNode.appendChild(spanNode);

    return listItemNode;
}