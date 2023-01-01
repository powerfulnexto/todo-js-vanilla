/*jshint esversion: 8 */

const URL = 'https://151.248.126.231.nip.io'+'/tasks';
const color = {
    green : '#6abe30',
    gray : '#808080',
    skyblue : '#87ceeb',
    red : '#ff0000',
};

//---------------------------------RENDER---------------------------------

init();
async function init(){
    console.log('init');

    let response;
    try{
        response = await getAllTasks();
    }catch(error){
        return alert('The site does not work in your country, please use the VPN of another country.');
    }

    responseJSON = await response.json();

    let taskList = responseJSON.data.taskList;

    for(let taskDetails of taskList){
        if(document.getElementById(taskDetails.id)){
            continue;
        }

        addEditState(taskDetails.id);
        
        const taskElement = createTaskElement(taskDetails);

        render(taskElement, taskDetails);
    }

    removeFantomTasks(taskList);
}

function convertTime(createdAt){
    console.log('convertTime');
    const date = new Date(createdAt);
    date.toLocaleString();

    return `
    ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}
    ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}
    `;
}

function createTaskElement(taskDetails){
    console.log('createTaskElement');
    const taskElement = document.createElement('div');
    taskElement.setAttribute('class', 'task');
    taskElement.setAttribute('id', taskDetails.id);
    taskElement.setAttribute('style', `box-shadow: ${taskDetails.isDone ? color.green : color.gray} -3px 0px 0px`);
    return taskElement;
}

function removeFantomTasks(taskList){
    console.log('removeFantomTasks');

    let localTaskList = document.getElementsByClassName('task');
    localTaskList = Array.from(localTaskList);

    let fantomTaskList;
    fantomTaskList = localTaskList.filter(localTask => !(taskList.map(serverTask => serverTask.id.toString()).includes(localTask.id)));
    fantomTaskList.forEach(task => block.removeChild(document.getElementById(task.id)));
}

function render(taskElement, taskDetails){
    console.log('render');
    taskElement.innerHTML = `
        <div class="description">
                <div class="buttonsLeft">
                    <button class="completeButton" onclick="completeTaskState(id='${taskDetails.id}')">
                        <img src="complete.png">
                    </button>
                </div>
                <p id="description${taskDetails.id}">
                ${taskDetails.description}
                </p>
                <div class="buttonsRight">
                    <button class="deleteButton" onclick="removeTask(id='${taskDetails.id}')">
                        <img src="delete.png">
                    </button>
                    <button class="editButton" onclick="editTask(id='${taskDetails.id}')">
                        <img src="edit.png">
                    </button>
                </div>
                
            </div>
            <div class="footer">
                <div class="userLight">
                    <p class="nickname">${taskDetails.username}</p>
                    <p class="email">${taskDetails.email}</p>
                </div>
                <div class="userRight">
                    <p class="edit" id="edit${taskDetails.id}">${taskDetails.isEdited ? 'edited' : ''}</p>
                    <span>&nbsp</span>
                    <p class="date">${convertTime(taskDetails.createdAt)}</p>
                </div>
            </div>
        </div>
        `;

        block.appendChild(taskElement);
}

//---------------------------------CREATE---------------------------------

async function addTask(){ // button 'Add task'
    console.log('addTask');
    createNewTask();
}//>addTask
async function createNewTask(){
    console.log('CreateNewTask');

    if(!document.getElementById('descriptioninput').value){ // if description input is empty
        document.getElementById('descriptioninput').style.boxShadow = `inset -1px -1px ${color.red}, inset 1px 1px ${color.red}`;
        await delay(2000);
        document.getElementById('descriptioninput').style.boxShadow = ``;
        return;
    }

    let description = document.getElementById('descriptioninput').value;

    let body = {
        'username': 'nickname',
        'email': 'email@email.email',
        'description': description,
    };

    let response = await postNewTask(body);

    if(response.ok){
        localCreateNewTask(await response.json());
        document.getElementById('descriptioninput').value = '';
    }
}

async function localCreateNewTask(response){ // not used
    console.log('localCreateNewTask');
    let taskDetails = response.data;

    addEditState(taskDetails.id);

    const taskElement = createTaskElement(taskDetails);

    render(taskElement, taskDetails);
}

//---------------------------------DELETE---------------------------------

async function removeTask(taskId){ //red button
    console.log('removeTask');
    removeTaskById(taskId);
}
async function removeTaskById(taskId){
    console.log('removeTaskById');

    if(!taskId) return;

    response = await deleteTaskById(taskId);

    if(response.ok)localRemoveTaskById(taskId);
}

async function localRemoveTaskById(taskId){
    console.log('localRemoveTaskById');
    block.removeChild(document.getElementById(taskId));
}

//---------------------------------DELETE-ALL---------------------------------

async function removeAllTasks(){ // button 'Clear all'
    console.log('removeAllTasks');

    response = await deleteAllTasks();

    if(response.ok){
        await localRemoveAllTasks();
    }
}

async function localRemoveAllTasks(){
    console.log('localRemoveAllTasks');

    let taskList = document.getElementsByClassName('task');
    taskList = Array.from(taskList);

    taskList.forEach(task => block.removeChild(task));
}

//---------------------------------COMPLETE---------------------------------

async function completeTaskState(taskId){
    console.log('completeTaskState');
    let completeState = await getTaskDetail(taskId, "isDone");

    completeState = completeState === true ? false : true;

    let body = {
        'isDone': completeState,
    };

    let response = await putTaskDetail(taskId, body);

    if(response.ok){
        await localCompleteTaskState(taskId,completeState);
    }
}

async function localCompleteTaskState(taskId,state){
    console.log('localCompleteTaskState');
    taskElement = document.getElementById(taskId);
    if(state){
        taskElement.style.boxShadow =`-3px 0px 0px ${color.green}`;
    }else{
        taskElement.style.boxShadow =`-3px 0px 0px ${color.gray}`;
    }
}

//---------------------------------EDIT---------------------------------

var editState = {};
function addEditState(taskId){
    console.log('addEditState');
    editState[taskId] = false;
}

async function editTask(taskId){
    console.log('editTask');

    editState[taskId] = editState[taskId] === true ? false : true;

    if(editState[taskId]){
        document.getElementById(`edit${taskId}`).innerText = 'edit mode on';
        document.getElementById(`description${taskId}`).setAttribute('contenteditable', 'true');
        document.getElementById(`description${taskId}`).style.boxShadow = `inset -1px -1px ${color.skyblue}, inset 1px 1px ${color.skyblue}`;
    }else{
        let body = {
            'description': document.getElementById('description'+taskId).innerText,
        };

        let response = await putTaskDetail(taskId, body);

        if(response.ok){
            document.getElementById(`edit${taskId}`).innerText = 'edited';
            document.getElementById(`description${taskId}`).setAttribute('contenteditable', 'false');
            document.getElementById(`description${taskId}`).style.boxShadow=``;
        }
    }
}

//---------------------------------FETCHS---------------------------------

async function getAllTasks(){
    let response = await fetch(URL+'?skip=0&limit=100' ,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

async function getTaskById(taskId){
    let response = await fetch(URL+'/'+taskId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

async function postNewTask(body){
    let response = await fetch(URL,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return response;
}

async function putTaskDetail(taskId, body){
    let response = await fetch(URL+'/'+taskId,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return response;
}

async function deleteTaskById(taskId){
    let response = await fetch(URL+'/'+taskId,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

async function deleteAllTasks(){
    let response = await fetch(URL,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

//---------------------------------OTHER---------------------------------

async function getTaskDetail(taskId, detailsName){
    console.log('getTaskDetail');
    if(!taskId || !detailsName){
        return;
    }

    let response = await getTaskById(taskId);

    let taskDetails = await response.json();

    return taskDetails.data[detailsName];
}

async function getTaskList(){
    console.log('getTaskList');
    let response = await getAllTasks();

    console.log(await response.json());
}

function simpleStateMachine(state){
    return state === true ? false : true;
}

function delay(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}