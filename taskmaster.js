const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");
const btnAdd = document.getElementById("btnAdd");
const taskContainer = document.getElementById("tasksContainer");
const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statCompleted = document.getElementById("statCompleted");
const statHigh = document.getElementById("statHigh");
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const btnClearCompleted = document.getElementById("btnClearCompleted");
const searchInput = document.getElementById("searchInput");


let tasklist = [];
let countId = 0;

const mostrarTareas = (arrTask)=>{

        taskContainer.innerHTML = "";
        taskInput.value = "";
        dateInput.value = "";

        contador = 0;
        countComplete = 0;
        countPending = 0;
        countStatHigh = 0;

    arrTask.forEach(task => {

        const newTask = document.createElement("div");
        newTask.classList.add("task-card");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";

        if (task.complete) {
        newTask.classList.add("completed");
        checkBox.checked = true; // i

        }
        checkBox.addEventListener("change", () =>{
            task.complete = checkBox.checked;
            localStorage.setItem("tasklist", JSON.stringify(tasklist)); 
            mostrarTareas(tasklist);
        })

        const info = document.createElement("div");
        info.classList.add("task-info");

        const taskName = document.createElement("h3");
        taskName.textContent = task.title;

        const badge = document.createElement("span");
        badge.classList.add("badge", task.priority);
        badge.textContent = task.priority;
        
        const date = document.createElement("p");
        date.textContent = task.date;

        info.appendChild(taskName);
        info.appendChild(badge);
        info.appendChild(date);

        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        const editButton = document.createElement("button");
        editButton.classList.add("btn-edit");
        editButton.textContent = "Editar";

        editButton.addEventListener("click", ()=>{
            const newTaskName = prompt("Nuevo Tarea:", task.title);
            const newPriority = prompt("Nueva prioridad:", task.priority);
            const newDate = prompt("Nueva fecha:", task.date);

            // tasklist = tasklist.find(u => u.id === task.id);
            task.title = newTaskName;
            task.priority = newPriority;
            task.date = newDate;

            taskName.textContent = newTaskName;
            badge.textContent = newPriority;
            badge.className = `badge ${task.priority}`;

            // badge.classList.add("badge", task.priority);

            date.textContent = newDate;
            localStorage.setItem("tasklist", JSON.stringify(tasklist));

            mostrarTareas(tasklist);

        })

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn-edit");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", ()=>{

            tasklist = tasklist.filter( u => u.id !== task.id)
        localStorage.setItem("tasklist", JSON.stringify(tasklist));

            mostrarTareas(tasklist);

        })

        contador++;

        if(task.complete === true){
            countComplete++;
        }else{task.complete === false
            countPending++;
        }
        
        if(task.priority === "alta"){
            countStatHigh++;
        }

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

         newTask.appendChild(checkBox);
         newTask.appendChild(info)
         newTask.appendChild(actions);

         taskContainer.appendChild(newTask);

    });

    statTotal.textContent = contador;
    statCompleted.textContent = countComplete;
    statPending.textContent = countPending;
    statHigh.textContent = countStatHigh;

}

const saved = localStorage.getItem("tasklist");
if (saved) {
    tasklist = JSON.parse(saved);
    countId = tasklist.length; 
    mostrarTareas(tasklist);
}

btnAdd.addEventListener('click', ()=>{

const task = taskInput.value;
const priorityValue = prioritySelect.value;
const date = dateInput.value;


    if(!task || !priorityValue || !date){
        alert("Debe llenar los campos correctamente")
        return;
    }

   const today = new Date();
    today.setHours(0, 0, 0, 0);

const dateValue = new Date(dateInput.value);
dateValue.setHours(0, 0, 0, 0);

if (dateValue < today) {
    alert("La fecha colocada no puede ser seleccionada");
    return;
}



    tasklist.push({
        id: countId++,
        title: task,
        priority: priorityValue,
        date: date,
        complete: false
    })
    localStorage.setItem("tasklist", JSON.stringify(tasklist));
    mostrarTareas(tasklist);
    
});

    btnClearCompleted.addEventListener("click", ()=>{
        tasklist = tasklist.filter(u => u.complete === false);
        localStorage.setItem("tasklist", JSON.stringify(tasklist));

            mostrarTareas(tasklist);
        })

    filterStatus.addEventListener("change", ()=>{
        aplicarFiltro(tasklist, filterStatus.value);
    });

    filterPriority.addEventListener("change", ()=>{
        prioridadFiltro(tasklist, filterPriority.value);
    });

    const aplicarFiltro = (tasklist, filterType) =>{
    let filteredList = tasklist;
    if(filterType === "completadas"){
        filteredList = tasklist.filter(u => u.complete === true)
    }
    if(filterType === "pendientes"){
        filteredList = tasklist.filter(u => u.complete === false)
    };

    mostrarTareas(filteredList);
    // tasklist = tasklist.filter(u => u.complete === filterType);
};

const prioridadFiltro = (tasklist, priorityType) =>{

    // let filteredPriority = tasklist;
     if (priorityType === "todas") {
        mostrarTareas(tasklist);
        return;
     }

    const filtered = tasklist.filter(u => u.priority === priorityType);
    mostrarTareas(filtered);
    
};

searchInput.addEventListener("input", ()=>{
    const text = searchInput.value.toLowerCase();

    const respuesta = tasklist.filter(task => task.title.toLowerCase().includes(text));
    mostrarTareas(respuesta);

});