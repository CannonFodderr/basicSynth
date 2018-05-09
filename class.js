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
let voiceArr = [];
let audioContext;

// Generate Note
noteGenerator = (pressedKey) => {
    // Functions
    noteRoute = (key) => {
        key.oscNode.connect(key.gainNode);
        key.gainNode.connect(audioContext.destination);
        playNote(key);
    }
    playNote = (key) =>  {
        key.oscNode.start(0);
        key.gainNode.gain.linearRampToValueAtTime(0.0001, key.attackTime);
        key.gainNode.gain.linearRampToValueAtTime(0.0001 + key.gainNode.gain.value, key.now + Number(key.decayTime) + Number(key.attackTime));
        key.gainNode.gain.linearRampToValueAtTime(key.gainNode.gain.value, key.now + Number(key.sustainTime) + Number(key.decayTime) + Number(key.attackTime));
        key.gainNode.gain.linearRampToValueAtTime(0.0001, key.now + Number(key.releaseTime) + Number(key.sustainTime) + Number(key.decayTime) + Number(key.attackTime));
    }
    
    let note = new Note(audioContext, pressedKey);
    if(voiceArr.length > 15){
        voiceArr[0].oscNode.stop(0);
        voiceArr.shift();

    }
        
    voiceArr.push(note);
    console.log(voiceArr);
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
        this.buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
        // OSC
        this.oscNode.type = waveformSelector.value;
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
// Create audio context
init = () => {
    try{
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    catch(e){
        alert('Audio Context API not available in this browser');
    }
}

window.addEventListener('mouseover',init,false)
window.addEventListener('keypress', (event)=>{
    console.log(event.keyCode);
    if(event.keyCode === 97){
        noteGenerator(261.6);
    }
    if(event.keyCode === 119){
        noteGenerator(277.2);
    }
    if(event.keyCode === 115){
        noteGenerator(293.7);
    }
    if(event.keyCode === 116){
        noteGenerator(370.0);
    }
    if(event.keyCode === 117){
        noteGenerator(466.2);
    }
    if(event.keyCode === 121){
        noteGenerator(415.3);
    }
    if(event.keyCode === 100){
        noteGenerator(329.6);
    }
    if(event.keyCode === 101){
        noteGenerator(311.1);
    }
    if(event.keyCode === 102){
        noteGenerator(349.2);
    }
    if(event.keyCode === 103){
        noteGenerator(392.0);
    }
    if(event.keyCode === 104){
        noteGenerator(440.0);
    }
    if(event.keyCode === 106){
        noteGenerator(493.9);
    }
    if(event.keyCode === 107){
        noteGenerator(523.3);
    }
})