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
// Tuning Elements
let octaveUp = document.getElementById('octaveUp');
let octaveDown = document.getElementById('octaveDown');
let detuneInput = document.getElementById('detune');
let detune = Number(detuneInput.value);

let isRunning = false;
let voiceArr = [];
let octave = 4;
let audioContext;

// Detune listener
detuneInput.addEventListener('change', ()=>{
    detune = Number(detuneInput.value);
})

// Generate Note
noteGenerator = (pressedKey) => {
    // Functions
    noteRoute = (key) => {
        key.oscNode.connect(key.gainNode);
        key.gainNode.connect(key.filterNode);
        key.filterNode.connect(audioContext.destination);
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
        this.filterNode.type = filterType.value;
        this.filterNode.frequency.value = Number(filterFreq.value);
    }
    
}
// Create audio context & Buffer
init = () => {
    try{
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audioContext = new AudioContext();
        let buffer = audioContext.createBuffer(2, audioContext.sampleRate * 3, audioContext.sampleRate)
    }
    catch(e){
        alert('Audio Context API not available in this browser');
    }
}

// listen for keyress and assign keys to notes  
// On first press change state to running &  create AudioContext + Buffer
window.addEventListener('keypress', (event)=>{
    if(isRunning === false){
        init();
    }
    isRunning = true;
    if(event.keyCode === 97){
        noteGenerator(16.35 * octave + detune);
    }
    if(event.keyCode === 119){
        noteGenerator(17.32 * octave + detune);
    }
    if(event.keyCode === 115){
        console.log(detune);
        noteGenerator(18.35 * octave + detune);
    }
    if(event.keyCode === 116){
        noteGenerator(23.12 * octave + detune);
    }
    if(event.keyCode === 117){
        noteGenerator(29.14 * octave + detune);
    }
    if(event.keyCode === 121){
        noteGenerator(25.96 * octave + detune);
    }
    if(event.keyCode === 100){
        noteGenerator(20.60 * octave + detune);
    }
    if(event.keyCode === 101){
        noteGenerator(19.45 * octave + detune);
    }
    if(event.keyCode === 102){
        noteGenerator(21.83 * octave + detune);
    }
    if(event.keyCode === 103){
        noteGenerator(24.50 * octave + detune);
    }
    if(event.keyCode === 104){
        noteGenerator(27.50 * octave + detune);
    }
    if(event.keyCode === 106){
        noteGenerator(30.87 * octave + detune);
    }
    if(event.keyCode === 107){
        noteGenerator(32.70 * octave + detune);
    }
});

// Set Octave

octaveUp.addEventListener('click', ()=> {
    if(octave < 10){
        octave += 1;
    }
})
octaveDown.addEventListener('click', ()=> {
    if(octave > 1){
        octave -= 1;
    }
})