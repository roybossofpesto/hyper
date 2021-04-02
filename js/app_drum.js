console.log("drum machine")
let sampler_loaded = false;
let sampler = new Tone.Sampler({
    "C3": 'samples/kick.wav',
    "D3": 'samples/snare.wav',
    "E3": 'samples/tom.wav',
    "F3": 'samples/hihat.wav',
}, () => {
    console.log("loaded samples");
    sampler_loaded = true;
}).toDestination();

class Pattern {
    constructor(container, note, label) {
        this.label = label;

        this.elems = [];
        for (let kk=0; kk<16; kk++) {
            const elem = document.createElement("div");
            elem.classList.add("button");
            const text = document.createTextNode(`${kk + 1}`);
            elem.appendChild(text);
            elem.onclick = (event) => {
                elem.classList.toggle("active");
                this.displayHexa();
            }
            container.appendChild(elem);
            this.elems.push(elem);
        }

        this.pattern = new Tone.Pattern((time, elem) => {
            const is_active = elem.classList.contains("active");
            console.log("pattern", time, elem, is_active, note);
            if (is_active)
                sampler.triggerAttack(note, time);  // Tone.Frequency(sector.note).transpose(transpose), "16n", time);

        }, this.elems);
        this.pattern.interval = '16n';

        this.result = document.createElement("div");
        this.result.classList.add("result");
        container.appendChild(this.result);
        this.displayHexa();

        this.result.onclick = (event) => {
            let accum = "";
            for (let kk=0; kk<this.elems.length; kk++) {
                let elem = this.elems[kk];
                const is_active = elem.classList.contains("active");
                const value = is_active ? "X" : "_";
                accum += value;
            }
            console.log('play', accum, sampler_loaded);
            if (!sampler_loaded)
                return;

            Tone.context.lookAhead = 0;
            Tone.start();

            Tone.Transport.bpm.value = 120;
            Tone.Transport.start();
            this.pattern.start(0);
        };
    }

    getValue() {
        let accum = 0;
        for (let kk=0; kk<this.elems.length; kk++) {
            let elem = this.elems[kk];
            const is_active = elem.classList.contains("active");
            const value = is_active ? (1 << kk) : 0;
            accum += value;
        }
        return accum;
    }

    displayHexa() {
        const value = this.getValue();
        const value_fmt = `${this.label}-${value.toString(16).padStart(4, '0')}`;
        // console.log("displayHexa", value_fmt);
        this.result.textContent = value_fmt;
    }
}

class Patterns {
    constructor(container) {
        const elem = document.createElement("div");
        elem.classList.add("patterns_container");
        container.appendChild(elem);

        this.patterns = [];
        this.patterns.push(new Pattern(elem, "F3", "h"));
        this.patterns.push(new Pattern(elem, "D3", "s"));
        this.patterns.push(new Pattern(elem, "E3", "t"));
        this.patterns.push(new Pattern(elem, "C3", "k"));
    }
}

const main_container = document.getElementById('main_container');
const aa = new Patterns(main_container);
const bb = new Patterns(main_container);
