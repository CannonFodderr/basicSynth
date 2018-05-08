let startBtn = document.querySelector('#start_btn');
let stopBtn = document.querySelector('#stop_btn');
// OSC Elements
let gainSlider = document.querySelector('#gain');
let waveformSelector = document.querySelector('#waveform');
let frequencySelector = document.querySelector('#frequency');
// ADSR Envelope Elements
let attackTime = document.querySelector('#attackTime');
let attackGain = document.querySelector('#attackGain');
let decayTime = document.querySelector('#decayTime');
let decayGain = document.querySelector('#decayGain');
let sustainTime = document.querySelector('#sustainTime');
let sustainGain = document.querySelector('#sustainGain');
let releaseTime = document.querySelector('#releaseTime');
let releaseGain = document.querySelector('#releaseGain');
// Filter Elements
let filterSelector = document.querySelector('#filterType');
let filterFreqSelector = document.querySelector('#filterFreq');
let isRunning = false;


startBtn.addEventListener('click', ()=>{
    if(isRunning == false){
        isRunning = true;
        create(gainSlider.value, waveformSelector.value);
    }
    
});



create = (startGain, startWaveform, startFreq) => {
    let audioCtx = new AudioContext();
    let oscNode = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    let distortionNode = audioCtx.createWaveShaper();
    let filterNode = audioCtx.createBiquadFilter();
    let envlopeNode = audioCtx.createGain();
    let adsr = {
        attackTime: attackTime.value,
        attackGain: attackGain.value,
        decayTime: decayTime.value,
        decayGain: decayGain.value,
        sustainTime: sustainTime.value,
        sustainGain: sustainGain.value,
        releaseTime: releaseTime.value,
        releaseGain: releaseGain.value 
    }
    console.log(adsr);
    let output = audioCtx.destination;
    // Internal Functions
    setFilterFreq = (filterFreq) => {
        console.log(filterFreq);
        filterNode.frequency.setValueAtTime(filterFreq, audioCtx.currentTime);
    }
    setFilterType = (filterType) => {
        filterNode.type = filterType;
        console.log(filterNode.type);
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
        
        // General Gain
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(startGain, audioCtx.currentTime + 0.015);
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
    GainNode.gain = 0.001;
    oscNode.connect(envlopeNode);
    envlopeNode.connect(filterNode);
    filterNode.connect(distortionNode);
    distortionNode.connect(gainNode);
    gainNode.connect(output);
    
    start();
}



