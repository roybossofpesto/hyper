console.log("drum machine")

class Pattern {
    constructor(container) {
        this.result = document.createElement("div");
        this.result.classList.add("result");
        this.result.appendChild(document.createTextNode(`foo`));
        this.result.onclick = (event) => {
            let accum = "";
            for (let kk=0; kk<this.elems.length; kk++) {
                let elem = this.elems[kk];
                const is_active = elem.classList.contains("active");
                const value = is_active ? "X" : "_";
                accum += value;
            }
            console.log('play', accum);
        };
        container.appendChild(this.result);

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
        const value_fmt = value.toString(16).padStart(4, '0');
        console.log("displayHexa", value_fmt);
        this.result.textContent = value_fmt;
    }

}

const main_container = document.getElementById('main_container');
console.log(main_container.clientWidth, main_container.clientHeight);

const pattern = new Pattern(main_container);
const pattern2 = new Pattern(main_container);
const pattern3 = new Pattern(main_container);
console.log(pattern);
