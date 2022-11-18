var identify = 0;

function adddo() {
    if (document.getElementById("description").value){
        var description = document.getElementById("description").value;
        console.log("input: "+description);
        mainblock.innerHTML += 
        
        "<p id="
        +identify+
        ">"
        +description+

        "<button id=\""
        +identify+
        "\" class=\"deletebutton\" onclick=\"deletetask(id=\'"
        +identify+
        "\')\">☒</button>"+
        "<button id=\""
        +identify+
        "\" class=\"completebutton\" onclick=\"completetask(id=\'"
        +identify+
        "\')\">☑</button>"
        "</p>"
        ;

        identify++;
    }else{
        console.log("input is null"+identify);
    }
}

function deletetask(taskid){
    console.log("taskid:"+taskid);
    var aboba = document.getElementById(taskid);
    console.log(aboba);

    aboba.style.borderColor='red'
    setTimeout(() => {aboba.parentNode.removeChild(aboba)}, 3000 );
}

function completetask(taskid){
    console.log("taskid:"+taskid);
    var aboba = document.getElementById(taskid);
    console.log(aboba);

    aboba.style.borderColor='green'
}

function clear(taskid) {
    console.log("taskid:"+taskid);
    document.getElementById(taskid).innerHTML = "";
}