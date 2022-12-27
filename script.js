/*jshint esversion: 8 */

const URL = 'https://151.248.126.231.nip.io'+'/tasks';
const color = {
    green : '#6abe30',
    gray : '#808080',
    skyblue : '#87ceeb',
    red : '#ff0000',
};

//---------------------------------RENDER---------------------------------

renderTaskList();
async function renderTaskList(){
    console.log('RenderTaskList');

    let taskList, taskCount, response;
    try{
        response = await fetchGetAll();
    }catch(error){
        return alert('The site does not work in your country, please use the VPN of another country.');
    }

    taskList = await response.json();
    //taskCount = await taskList.data.totalTaskCount;
    taskList = await taskList.data.taskList;

    for(let arrayId = 0; arrayId < taskList.length; arrayId++){
        if(document.getElementById(taskList[arrayId].id)){
            continue;
        }

        let details = taskList[arrayId];

        editStateRender(details.id);

        let taskColor = isDoneStateColor(details.isDone);
        
        const task = createTaskElement(details.id, taskColor);

        if(details.isEdited){
            details.isEdited = 'edited';
        }else{
            details.isEdited = '';
        }

        details.createdAt = createtDate(details.createdAt);

        addToHTML(task, details);
        deleteForHTML(taskList); //Сейчас нет смысла юзать, заготовка на будущее.
    }
}//>renderTaskList

function isDoneStateColor(isDone){
    console.log('isDoneStateColor');
    let taskColor;

    if(isDone){
        taskColor = color.green;
    }else{
        taskColor = color.gray;
    }

    return taskColor;
}

function createtDate(createdAt){
    console.log('createtDate');
    const date = new Date(createdAt);
    date.toLocaleString();

    createdAt = `
    ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}
    ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
    `;

    return createdAt;
}

function createTaskElement(taskId, taskColor){
    console.log('createTaskElement');
    const task = document.createElement('div');
    task.setAttribute('class', 'task');
    task.setAttribute('id', taskId);
    task.setAttribute('style', `box-shadow: ${taskColor} -3px 0px 0px`);
    return task;
}

function deleteForHTML(taskList){
    console.log('deleteForHTML');
    let task = document.getElementsByClassName('task');
    for(let i = 0,j,s = false; i < task.length; i++ , s = false){

        for(j = 0; j < taskList.length; j++){

            if(task[i].id==taskList[j].id){
                s = true;
            }

        }

        if(!s){
            block.removeChild(document.getElementById(task[i].id));
        }
    }
}

function addToHTML(task, details){
    console.log('addToHTML');
    task.innerHTML = `
        <div class="description">
                <div class="buttonsLeft">
                    <button class="completeButton" onclick="completeTask(id='${details.id}')">
                        <img src="complete.png">
                    </button>
                </div>
                <p id="description${details.id}">
                ${details.description}
                </p>
                <div class="buttonsRight">
                    <button class="deleteButton" onclick="deleteTask(id='${details.id}')">
                        <img src="delete.png">
                    </button>
                    <button class="editButton" onclick="editTask(id='${details.id}')">
                        <img src="edit.png">
                    </button>
                </div>
                
            </div>
            <div class="footer">
                <div class="userLight">
                    <p class="nickname">${details.username}</p>
                    <p class="email">${details.email}</p>
                </div>
                <div class="userRight">
                    <p class="edit" id="edit${details.id}">${details.isEdited}</p>
                    <span>&nbsp</span>
                    <p class="date">${details.createdAt}</p>
                </div>
            </div>
        </div>
        `;

        block.appendChild(task);
}//>addHTML

//---------------------------------GET---------------------------------

async function getTaskById(taskId, keyname){
    console.log('getTaskById');
    if(!taskId || !keyname){
        return;
    }

    let response = await fetchGetId(taskId);

    let info = await response.json();

    return info.data[keyname];

}//>getTaskById

//---------------------------------CREATE---------------------------------

async function addTask(){
    console.log('addTask');
    createNewTask();
}//>addTask
async function createNewTask(){ // button 'Add task'
    console.log('CreateNewTask');

    if(!document.getElementById('descriptioninput').value){
        document.getElementById('descriptioninput').style.boxShadow = `inset -1px -1px ${color.red}, inset 1px 1px ${color.red}`;
        await delay(2000);
        document.getElementById('descriptioninput').style.boxShadow = ``;
        return;
    }

    let description = document.getElementById('descriptioninput').value;

    let details = {
        'username': 'nickname',
        'email': 'email@email.email',
        'description': description,
    };

    let response = await fetchPost(details);

    if(response.ok){
        localCreateNewTask(await response.json());
        document.getElementById('descriptioninput').value = '';
    }
}//>createNewTask

async function localCreateNewTask(response){ // not used
    console.log('localCreateNewTask');
    let details = response.data;

    editStateRender(details.id);

    let taskColor = isDoneStateColor(details.isDone);

    const task = createTaskElement(details.id, taskColor);

    if(details.isEdited){
        details.isEdited = 'edited';
    }else{
        details.isEdited = '';
    }

    details.createdAt = createtDate(details.createdAt);

    addToHTML(task, details);
}

//---------------------------------DELETE---------------------------------

async function deleteTask(taskId){ 
    console.log('deleteTask');
    deleteTaskById(taskId);
}
async function deleteTaskById(taskId){ //red button
    console.log('deleteTaskById');

    if(!taskId) return;

    response = await fetchDeleteId(taskId);
    if(response.ok)localDeleteTaskById(taskId);
}//>deleteTaskById

async function localDeleteTaskById(taskId){
    console.log('localDeleteTaskById');
    block.removeChild(document.getElementById(taskId));
}

async function deleteAllTasks(){ // button 'Clear all'
    console.log('deleteAllTasks');

    response = await fetchDeleteAll();

    if(response.ok){
        await localDeleteAllTasks();
    }
}//>deleteAllTasks

async function localDeleteAllTasks(){
    console.log('localDeleteAllTasks');

    let collection = document.getElementsByClassName('task');
    for(let i = 0; i< collection.length;){
        block.removeChild(collection[0]);
    }
}//>localDeleteAllTasks

//---------------------------------COMPLETE---------------------------------

async function completeTask(taskId){
    console.log('completeTask');
    let state = await getTaskById(taskId, "isDone");

    state = state === true ? false : true;

    let details = {
        'isDone': state,
    };

    let response = await fetchPut(taskId, details);

    if(response.ok){
        await localCompleteTask(taskId,state);
    }
}

async function localCompleteTask(taskId,state){
    console.log('localCompleteTask');
    task = document.getElementById(taskId);
    if(state){
        task.style.boxShadow =`-3px 0px 0px ${color.green}`;
    }else{
        task.style.boxShadow =`-3px 0px 0px ${color.gray}`;
    }
}

//---------------------------------EDIT---------------------------------

var editState = {};
function editStateRender(taskId){
    console.log('editStateRender');
    editState[taskId] = false;
}

async function editTask(taskId){
    console.log('editTask');

    editState[taskId] = editState[taskId] === true ? false : true;

    if(editState[taskId]){
        document.getElementById('edit'+taskId).innerText = 'edit mode on';
        document.getElementById('description'+taskId).setAttribute('contenteditable', 'true');
        document.getElementById('description'+taskId).style.boxShadow = `inset -1px -1px ${color.skyblue}, inset 1px 1px ${color.skyblue}`;
    }else{
        let details = {
            'description': document.getElementById('description'+taskId).innerText,
        };

        let response = await fetchPut(taskId, details);

        if(response.ok){
            document.getElementById(`edit${taskId}`).innerText = 'edited';
            document.getElementById('description'+taskId).setAttribute('contenteditable', 'false');
            document.getElementById('description'+taskId).style.boxShadow=``;
        }
    }
}

//---------------------------------FETCHS---------------------------------

async function fetchGetAll(){
    let response = await fetch(URL+'?skip=0&limit=100' ,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

async function fetchGetId(taskId){
    let response = await fetch(URL+'/'+taskId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

async function fetchPost(details){
    let response = await fetch(URL,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    return response;
}

async function fetchPut(taskId, details){
    let response = await fetch(URL+'/'+taskId,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    return response;
}

async function fetchDeleteId(taskId){
    let response = await fetch(URL+'/'+taskId,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

async function fetchDeleteAll(){
    let response = await fetch(URL,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

//---------------------------------UNUSED---------------------------------

//getTaskList();
async function getTaskList(){ // not used
    console.log('getTaskList');
    let response = await fetchGetAll();

    console.log(await response.json());
}//>getTaskList

function simpleStateMachine(state){// not used
    return state === 0 ? 1 : 0;
}//>simpleStateMachine

function delay(ms) { // not used
    return new Promise(resolve => setTimeout(resolve, ms));
}//>delay