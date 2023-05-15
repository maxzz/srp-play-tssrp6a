import { createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines, SRPServerSession } from 'tssrp6a';

// BigInt.prototype.toJSON = function() {
//     const s = this.toString();
//     if (s.length > 50) {
//       return this.toString().slice(0, 50) + "…"
//     }
//     return s;
//   };
//   ArrayBuffer.prototype.toJSON = function() {
//     return this.toString();
//   };

window.PUPPETEER_PROMISE = new Promise(async resolve => {

    const sq = document.getElementById("sequence-inner");

    window.TEST_PASSED = null;

    for (const step of steps) {
        if (step.end) {
            const div = document.createElement("div");
            div.className = `code code-${step.end}`;
            div.innerHTML = step.code;
            sq.appendChild(div);
            if (!step.fakecode) {
                try {
                    let result = await eval(`(async () => { ${step.code}\n; return ${step.return}; })()`);
                    let str = JSON.stringify(result, null, "  ");
                    if (typeof str === "string") {
                        const valueDiv = document.createElement("div");
                        valueDiv.className = "codevalue";
                        valueDiv.innerText += `> ${step.return}: ` + str;
                        div.appendChild(valueDiv);
                    }
                    if (result !== undefined) {
                        window[step.return] = result;
                    }
                } catch (e) {
                    div.innerText += `\n> ${e.toString()}`;
                    div.className += " code-error";
                    console.error(e);
                    window.TEST_PASSED = false;
                }
            }
        } else if (step.request || step.reply) {
            const div = document.createElement("div");
            div.className = `comms-${step.request ? "right" : "left"}`;
            div.innerText = `${step.request || step.reply}(${step.send.join(", ")})`;
            sq.appendChild(div);
        } else if (step.break) {
            const div = document.createElement("div");
            div.className = "break";
            div.innerText = `${step.break}`;
            sq.appendChild(div);
        }
    }
    resolve(window.TEST_PASSED);
});

