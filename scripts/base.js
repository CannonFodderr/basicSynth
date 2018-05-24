const waveforms = document.querySelectorAll('.wForm');
const filters = document.querySelectorAll('.filter');
const selectedForm = document.querySelector('#selectedForm');
const selectedFilter = document.querySelector('#selectedFilter');


let draggedItem = {};
let draggedfilter = {};

// ====================
// WAVEFORMS SELECTION
// ==================== 
// loop through waveforms
for (const wave of waveforms){
    wave.addEventListener('dragstart', dragStart);
    wave.addEventListener('dragend', dragEnd);
}

function dragStart(e){
    draggedItem = this;
    console.log(draggedItem);
}
function dragEnd(){
    
}
// Selected waveform
selectedForm.addEventListener('dragenter', dragEnter);
selectedForm.addEventListener('dragover', dragOver);
selectedForm.addEventListener('dragleave', dragLeave);
selectedForm.addEventListener('drop', dragDrop);


function dragEnter(e){
    e.preventDefault();
    this.className += " drag";
}

function dragLeave(e){
    e.preventDefault();
}
function dragOver(e){
    e.preventDefault();
    
}
function dragDrop(e){
    if(draggedItem.className == "wForm"){

    
    this.className = "wForm";
    this.src = draggedItem.src;
    this.alt = draggedItem.alt;
    console.log(this.alt);
    }
}

// ====================
// FILTER SELECTION
// ==================== 



for (const f of filters){
    f.addEventListener('dragstart', filterDragStart);
    f.addEventListener('dragend', filterDragEnd);
}

function filterDragStart () {
    draggedItem = this;
}

function filterDragEnd(){
    
}

selectedFilter.addEventListener('dragenter', filterDragEnter);
selectedFilter.addEventListener('dragover', filterDragOver);
selectedFilter.addEventListener('dragleave', filterDragLeave);
selectedFilter.addEventListener('drop', filterDragDrop);

function filterDragEnter(e){
    e.preventDefault();
    this.className += " drag";
}

function filterDragLeave(e){
    e.preventDefault();
}
function filterDragOver(e){
    e.preventDefault();
    
}
function filterDragDrop(e){
    if(draggedItem.className == "filter"){
        this.className = "filter";
        this.src = draggedItem.src;
        this.alt = draggedItem.alt;
        console.log(this.alt);
    }
}