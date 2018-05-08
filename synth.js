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


startBtn.addEventListener('click', ()=>{
    if(isRunning == false){
        isRunning = true;
        create(Number(gainSlider.value), waveformSelector.value, Number(frequencySelector.value));
    }   
});



create = (startGain, startWaveform, startFreq) => {
    let audioCtx = new AudioContext();
    let now = audioCtx.currentTime;
    let oscNode = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    let distortionNode = audioCtx.createWaveShaper();
    let filterNode = audioCtx.createBiquadFilter();
    let envlopeNode = audioCtx.createGain();
    let output = audioCtx.destination;
    console.log(attackTime.value)
    // Internal Functions
    setFilterFreq = (filterFreq) => {
        console.log(filterFreq);
        filterNode.frequency.setValueAtTime(filterFreq, audioCtx.currentTime);
    }
    setFilterType = (filterType) => {
        filterNode.type = filterType;
    }

    setFrequecy = (freq) => {
        console.log(freq);
        oscNode.frequency.setValueAtTime(freq, audioCtx.currentTime);
    }

    setWaveform = (waveform) => {
        console.log(waveform)
        oscNode.type = waveform;
    }
    
    setGain = () => {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(gainSlider.value, audioCtx.currentTime + 0.015);
    }


    stop = () => {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
        setTimeout(() => oscNode.stop(), 1000);
        isRunning = false;
    }

    start = () => {
        oscNode.start();
        oscNode.type = startWaveform;
        oscNode.frequency.value = frequencySelector.value;
        // Add ADSR
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(Number(attackGain.value), Number(attackTime.value));
        gainNode.gain.linearRampToValueAtTime(0.0001 + startGain, now + Number(decayTime.value) + Number(attackTime.value));
        // gainNode.gain.linearRampToValueAtTime(startGain, now + sustainTime.value);
        gainNode.gain.linearRampToValueAtTime(startGain, now + Number(sustainTime.value) + Number(decayTime.value) + Number(attackTime.value));
        gainNode.gain.linearRampToValueAtTime(0.0001, now + Number(releaseTime.value) + Number(sustainTime.value) + Number(decayTime.value) + Number(attackTime.value));
        // General Gain
        // gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        // gainNode.gain.exponentialRampToValueAtTime(startGain, audioCtx.currentTime + 0.015);
        filterNode.type = filterSelector.value;
        filterNode.frequency.value = filterFreqSelector.value;
        stopBtn.addEventListener('click', ()=>{
            stop();
        });
        // OSC Listeners
        gainSlider.addEventListener('change', ()=>{
            setGain();
        });
        waveformSelector.addEventListener('change', ()=>{
            setWaveform(waveformSelector.value);
        });
        frequencySelector.addEventListener('change', ()=>{
            setFrequecy(frequencySelector.value);
        });


        // Filter Listeners
        filterSelector.addEventListener('change', ()=>{
            setFilterType(filterSelector.value);
        });
        filterFreqSelector.addEventListener('change', ()=>{
            setFilterFreq(filterFreqSelector.value)
        });
        
    }
    // startup config & routing
    gainNode.gain = 0.001;
    oscNode.connect(envlopeNode);
    envlopeNode.connect(filterNode);
    filterNode.connect(distortionNode);
    distortionNode.connect(gainNode);
    gainNode.connect(output);
    
    start();
}



