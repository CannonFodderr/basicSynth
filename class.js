let startBtn = document.querySelector('#start_btn');
let stopBtn = document.querySelector('#stop_btn');
// OSC Elements
let gainSlider = document.querySelector('#gainSlider');
let waveformSelector = document.querySelector('#waveform');
let frequencySelector = document.querySelector('#frequency');
// ADSR Envelope Elements
let attackTime = document.querySelector('#attackTime');
let attackGain = document.querySelector('#attackGain');
let decayTime = document.querySelector('#decayTime');
let sustainTime = document.querySelector('#sustainTime');
let releaseTime = document.querySelector('#releaseTime');
// Filter Elements
let filterSelector = document.querySelector('#filterType');
let filterFreqSelector = document.querySelector('#filterFreq');
let isRunning = false;

// let data = {
//     waveformSelector: document.querySelector('#waveform').value,
//     attackTime: document.querySelector('#attackTime').value,
//     attackGain: document.querySelector('#attackGain').value,
//     decayTime: document.querySelector('#decayTime').value,
//     sustainTime: document.querySelector('#sustainTime').value,
//     releaseTime: document.querySelector('#releaseTime').value,
//     filterSelector: document.querySelector('#filterType').value,
//     filterFreqSelector: document.querySelector('#filterFreq').value
// }

// Generate Note
noteGenerator = (pressedKey) => {
    // Functions
    noteRoute = (key) => {
        key.oscNode.connect(key.gainNode);
        key.gainNode.connect(audioContext.destination);
        playNote(key);
    }
    playNote = (key) =>  {
        key.oscNode.start();
        key.gainNode.gain.linearRampToValueAtTime(0.0001, key.attackTime);
        key.gainNode.gain.linearRampToValueAtTime(0.0001 + key.gainNode.gain.value, key.now + Number(key.decayTime) + Number(key.attackTime));
        key.gainNode.gain.linearRampToValueAtTime(key.gainNode.gain.value, key.now + Number(key.sustainTime) + Number(key.decayTime) + Number(key.attackTime));
        key.gainNode.gain.linearRampToValueAtTime(0.0001, key.now + Number(key.releaseTime) + Number(key.sustainTime) + Number(key.decayTime) + Number(key.attackTime));
    }
    let audioContext = new AudioContext();
    let note = new Note(audioContext, pressedKey);
    noteRoute(note);    
}

// Note Class
class Note {
    constructor(context, pressedKey){
        // Audio Context    
        this.now = context.currentTime;
        this.oscNode = context.createOscillator();
        this.gainNode = context.createGain();
        this.filterNode = context.createBiquadFilter();
        // OSC
        this.oscNode.waveformType = waveformSelector.value;
        this.oscNode.frequency.value = pressedKey;
        this.gainNode.gain.value = Number(gainSlider.value)
        // ADSR
        this.attackTime = Number(attackTime.value);
        this.attackGain = Number(attackGain.value);
        this.decayTime = Number(decayTime.value);
        this.sustainTime = Number(sustainTime.value);
        this.releaseTime = Number(releaseTime.value);
        // Filter
        this.filterType = filterType.value;
        this.filterFreq = Number(filterFreq.value);
        console.log(this);

    }
    
}

window.addEventListener('keypress', ()=>{
    noteGenerator(500);
})