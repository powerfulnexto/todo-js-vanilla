var identify = 0;
const timerMax = 3000;

function adddo1(){
    if(!document.getElementById("description").value){
        console.log("input is null"+identify)
        return
    }
    identify ++;
    let description = document.getElementById("description").value;
        console.log("input: "+description);
        mainblock.innerHTML += 
        `
        <p id="${identify}">${description}
            <button id="${identify}" class="deletebutton" onclick="deletetask(id='${identify}')">☒</button>
            <button id="${identify}" class="completebutton" onclick="completetask(id='${identify}')">☑</button>
            <button id="${identify}" class="editbutton" onclick="completetask(id='${identify}')">☐</button>
            <progress id="${identify}progressbar" class="progresstodelete" value="0" max="0"></progress>
        </p>
        `
}

async function deletetask(taskid){
    let aboba = document.getElementById(taskid);

    //aboba.style.borderColor='red'
    
    let progressBar = document.getElementById(taskid+'progressbar');
    let progressBarMax = 10;
    let progressBarValue = 0;
    progressBar.setAttribute("max", progressBarMax);
    progressBar.setAttribute("value", progressBarValue);


    for(let i = 0; i <= progressBarMax; i++){
        await progressBarToDelete(i);
    }
    async function progressBarToDelete(progressValue) {
        progressBar.setAttribute("value", progressValue);
        await delay(timerMax / progressBarMax);
    }

    aboba.parentNode.removeChild(aboba);
}

function completetask(taskid){
    let aboba = document.getElementById(taskid);

    aboba.style.borderColor='green'
}

function clear(taskid) {
    document.getElementById(taskid).innerHTML = "";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}