var identify = 0;
const TIMERMAX = 3000;
var stateDictionary = {
    deleteState: {},
    completeState: {},
    editState:{},
};

function adddo(){
    if(!document.getElementById("description").value){
        console.log("input is null"+identify);
        return;
    }
    let description = document.getElementById("description").value;
        mainblock.innerHTML += 
        `
        <p id="${identify}">${description}
            <button id="${identify}" class="deletebutton" contenteditable='false' onclick="deleteTask(id='${identify}')">☒</button>
            <button id="${identify}" class="completebutton" contenteditable='false' onclick="completeTask(id='${identify}')">☑</button>
            <button id="${identify}" class="editbutton" contenteditable='false' onclick="editable(id='${identify}')">☐</button>
            <progress id="${identify}progressbar" class="progresstodelete" value="0" max="0"></progress>
        </p>
        `;

        addDictionary(identify);
        identify ++;
}//>adddo

function addDictionary(identify){
    stateDictionary.deleteState[identify] = 0;
    stateDictionary.completeState[identify] = 0;
    stateDictionary.editState[identify] = 0;
}//>addDictionary
function removeDictionary(identify){
    delete stateDictionary.deleteState[identify];
    delete stateDictionary.completeState[identify];
    delete stateDictionary.editState[identify];

    delete aboba[identify];
    delete progressBar[identify];
}//>removeDictionary

var aboba = {};
var progressBar = {};
async function deleteTask(taskid) {
    aboba[taskid] = document.getElementById(taskid);

    stateDictionary.deleteState[taskid] = simpleStateMachine(stateDictionary.deleteState[taskid]);

    //<progress bar block
    progressBar[taskid] = document.getElementById(taskid+'progressbar')
    let progressBarMax = 10;
    let progressBarValue = 0;
    zeroProgressBar();
    function zeroProgressBar(){
        progressBar[taskid].setAttribute("max", progressBarMax);
        progressBar[taskid].setAttribute("value", progressBarValue);
    }
    for(let i = 0; i <= progressBarMax; i++){
        dogNail(taskid);
        if(stateDictionary.deleteState[taskid] == 0){
            zeroProgressBar();
            return;
        }
        await progressBarToDelete(i);
    }
    async function progressBarToDelete(progressValue) {
        progressBar[taskid].setAttribute("value", progressValue);
        await delay(TIMERMAX / progressBarMax);
    }
    //>progress bar block

    dogNail(taskid);
    if(stateDictionary.deleteState[taskid] == 1){
        //aboba.parentNode.removeChild(aboba);
        aboba[taskid].parentNode.removeChild(aboba[taskid]);
        removeDictionary(taskid);
    }else{
        stateDictionary.deleteState[taskid] = 0;
        zeroProgressBar();
    }

}//>deleteTask

function dogNail(taskid){
    if(aboba[taskid] && aboba[taskid].parentNode){
        return;
    }else{
        aboba[taskid] = document.getElementById(taskid);
        progressBar[taskid] = document.getElementById(taskid+'progressbar');
    }
}//>dogNail

function completeTask(taskid){
    let aboba = document.getElementById(taskid);

    if(stateDictionary.completeState[taskid] == 1){
        stateDictionary.completeState[taskid] = simpleStateMachine(stateDictionary.completeState[taskid]);
        borderColorAutomate(taskid);
    }else{
        stateDictionary.completeState[taskid] = simpleStateMachine(stateDictionary.completeState[taskid]);
        borderColorAutomate(taskid);
    }
}//>completeState

function editable(taskid) {
    let aboba = document.getElementById(taskid);
    
    if(stateDictionary.editState[taskid] == 1){
        aboba.setAttribute('contenteditable', 'false');
        stateDictionary.editState[taskid] = simpleStateMachine(stateDictionary.editState[taskid]);
        borderColorAutomate(taskid);
    }else{
        aboba.setAttribute('contenteditable', 'true');
        stateDictionary.editState[taskid] = simpleStateMachine(stateDictionary.editState[taskid]);
        borderColorAutomate(taskid);
    }
}//>editable

function borderColorAutomate(taskid){
    let aboba = document.getElementById(taskid);

    if(stateDictionary.editState[taskid] == 1){
        aboba.style.borderColor='SkyBlue';
    }else if(stateDictionary.editState[taskid] == 0 && stateDictionary.completeState[taskid] == 1){
        aboba.style.borderColor='Green';
    }else{
        aboba.style.borderColor='DarkGray';
    }
}//>borderColorAutomate

function simpleStateMachine(state){
    if(state != 0){
        state = 0;
    }else{
        state = 1;
    }
    return state;
}//>simpleStateMachine

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}//>delay