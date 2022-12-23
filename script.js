/*jshint esversion: 8 */

const URL = 'http://151.248.126.231:8000/tasks';

//---------------------------------RENDER---------------------------------

renderTaskList();
async function renderTaskList(){
    console.log('RenderTaskList');

    let tasklist, response;
    try{
        response = await fetchGetAll();
    }catch(error){
        return alert('The site does not work in your country, please use the VPN of another country.');
    }

    tasklist = await response.json();

    for(let arrayid = 0; arrayid < tasklist.data.taskList.length; arrayid++){
        if(document.getElementById(tasklist.data.taskList[arrayid].id)){
            continue;
        }

        editStateRender(tasklist.data.taskList[arrayid].id);

        let color;
        if(tasklist.data.taskList[arrayid].isDone){
            color = '#6abe30'; //green
        }else{
            color = 'gray';
        }

        const task = document.createElement('div');
        task.setAttribute('class', 'task');
        task.setAttribute('id', tasklist.data.taskList[arrayid].id);
        task.setAttribute('style', `box-shadow: ${color} -3px 0px 0px`);

        console.log(tasklist.data.taskList[arrayid]);
        let details = tasklist.data.taskList[arrayid];

        if(tasklist.data.taskList[arrayid].isEdited){
            details.isEdited = 'edited';
        }else{
            details.isEdited = '';
        }

        const date = new Date(details.createdAt);
        date.toLocaleString();

        details.createdAt = `
        ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}
        ${date.getHours()}:${date.getMinutes()}
        `;

        addToHTML(task, details);
        //deleteForHTML(tasklist); //Сейчас нет смысла юзать, заготовка на будущее.
    }
}//>renderTaskList

function deleteForHTML(tasklist){
    let task = document.getElementsByClassName('task');
    for(let i = 0,j,s = false; i < task.length; i++ , s = false){

        for(j = 0; j < tasklist.data.taskList.length; j++){

            if(task[i].id==tasklist.data.taskList[j].id){
                s = true;
            }

        }

        if(!s){
            block.removeChild(document.getElementById(task[i].id));
        }
    }
}

function addToHTML(task, details){
    task.innerHTML = `
        <div class="description">
                <div class="buttonsLeft">
                    <button class="completeButton" onclick="completeTask(id='${details.id}')">
                        <img src="complete.png">
                    </button>
                </div>
                <p>
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
                    <p class="edit">${details.isEdited}</p>
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
    if(!taskId || !keyname){
        return;
    }

    let response = await fetchGetId(taskId);

    let info = await response.json();

    return info.data[keyname];

}//>getTaskById

//---------------------------------CREATE---------------------------------

async function addTask(){
    createNewTask();
}//>addTask
async function createNewTask(){ // button 'Add task'
    console.log('CreateNewTask');

    if(!document.getElementById('descriptioninput').value){
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
        renderTaskList();
        //localCreateNewTask(await response.json());
        document.getElementById('descriptioninput').value = '';
    }
}//>createNewTask

function localCreateNewTask(response){ // not used
    let details = response.data;

    const date = new Date(details.createdAt);
    date.toLocaleString();

    details.createdAt = `
        ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}
        ${date.getHours()}:${date.getMinutes()}
    `;

    let color;
    if(tasklist.data.taskList[arrayid].isDone){
        color = '#6abe30'; //green
    }else{
        color = 'gray';
    }

    const task = document.createElement('div');
    task.setAttribute('class', 'task');
    task.setAttribute('id', tasklist.data.taskList[arrayid].id);
    task.setAttribute('style', `box-shadow: ${color} -3px 0px 0px`);

    //addToHTML(task, details);
}

//---------------------------------DELETE---------------------------------

async function deleteTask(taskId){ 
    deleteTaskById(taskId);
}
async function deleteTaskById(taskId){ //red button
    console.log('deleteTaskById');

    if(!taskId) return;

    response = await fetchDeleteId(taskId);
    if(response.ok)localDeleteTaskById(taskId);
}//>deleteTaskById

async function localDeleteTaskById(taskId){
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
    task = document.getElementById(taskId);
    if(state){
        task.style.boxShadow='-3px 0px 0px #6abe30';
    }else{
        task.style.boxShadow='-3px 0px 0px gray';
    }
}

//---------------------------------EDIT---------------------------------

var editState = {};
function editStateRender(taskId){
    editState[taskId] = false;
}

async function editTask(taskId){
    console.log('editTask');

    editState[taskId] = editState[taskId] === true ? false : true;

    if(editState[taskId]){
        document.getElementById(taskId).getElementsByTagName('p')[3].innerText = 'edit mode on';
        document.getElementById(taskId).getElementsByTagName('p')[0].setAttribute('contenteditable', 'true');
    }else{
        let details = {
            'description': document.getElementById(taskId).getElementsByTagName('p')[0].innerText,
        };
        let response = await fetchPut(taskId, details);
        if(response.ok){
            document.getElementById(taskId).getElementsByTagName('p')[3].innerText = 'edited';
            document.getElementById(taskId).getElementsByTagName('p')[0].setAttribute('contenteditable', 'false');
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

getTaskList();
async function getTaskList(){ // not used
    let response = await fetchGetAll();

    console.log(await response.json());
}//>getTaskList

function simpleStateMachine(state){// not used
    return state === 0 ? 1 : 0;
}//>simpleStateMachine

function delay(ms) { // not used
    return new Promise(resolve => setTimeout(resolve, ms));
}//>delay