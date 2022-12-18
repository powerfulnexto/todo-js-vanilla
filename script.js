/*jshint esversion: 8 */

const URL = 'https://todo-api-example-production-34ec.up.railway.app/tasks';

renderTaskList();
async function renderTaskList(){
    console.log('RenderTaskList');

    let tasklist;
    let response;
    try{
        response = await fetch(URL+'?skip=0&limit=100',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }catch(err){
        alert('The site does not work in Russia, please use the VPN of another country.');
        return;
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
    }
}//>renderTaskList

async function getTaskList(){ // not used
    let response = await fetch(URL+'?skip=0&limit=100' ,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}//>getTaskList

async function getTaskById(taskId, keyname){ // not used
    if(!taskId || !keyname){
        return;
    }
    let response = await fetch(URL+'/'+taskId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    let info = await response.json();
    return await info.data[keyname];
}//>getTaskById

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

    let post = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    };
    let response = await fetch(URL, post);

    if(response.ok){
        renderTaskList();
        document.getElementById('descriptioninput').value = '';
    }
}//>createNewTask

async function deleteTask(taskId){
    deleteTaskById(taskId);
}
async function deleteTaskById(taskId){ //red button
    console.log('deleteTaskById');

    if(!taskId){
        return;
    }
    let response = await fetch(URL+'/'+taskId,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok){
        localDeleteTaskById(taskId);
    }
}//>deleteTaskById

async function localDeleteTaskById(taskId){
    block.removeChild(document.getElementById(taskId));
}

async function deleteAllTasks(){ // button 'Clear all'
    console.log('deleteAllTasks');

    let response = await fetch(URL,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

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

async function completeTask(taskId){
    console.log('completeTask');
    let state = await getTaskById(taskId, "isDone");

    state = state === true ? false : true;

    let details = {
        'isDone': state,
    };

    let response = await fetch(URL+'/'+taskId,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    });
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

var editState = {};
function editStateRender(taskId){
    editState[taskId] = false;
}

async function editTask(taskId){
    editState[taskId] = editState[taskId] === true ? false : true;

    if(editState[taskId]){
        document.getElementById(taskId).getElementsByTagName('p')[3].innerText = 'edit mode on';
        document.getElementById(taskId).getElementsByTagName('p')[0].setAttribute('contenteditable', 'true');
    }else{
        let details = {
            'description': document.getElementById(taskId).getElementsByTagName('p')[0].innerText,
        };

        let response = await fetch(URL+'/'+taskId,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        });
        if(response.ok){
            document.getElementById(taskId).getElementsByTagName('p')[3].innerText = 'edited';
            document.getElementById(taskId).getElementsByTagName('p')[0].setAttribute('contenteditable', 'false');
        }
    }
}

function simpleStateMachine(state){// not used
    return state === 0 ? 1 : 0;
}//>simpleStateMachine

function delay(ms) { // not used
    return new Promise(resolve => setTimeout(resolve, ms));
}//>delay