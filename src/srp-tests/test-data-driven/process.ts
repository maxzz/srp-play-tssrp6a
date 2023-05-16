import { createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines, SRPServerSession } from 'tssrp6a';
import { steps } from './steps-data';

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

export const PUPPETEER_PROMISE = new Promise(async (resolve) => {

    const sequenceElm = document.getElementById("sequence-inner")!;

    let TEST_PASSED = null;

    const resultsAcc: Record<string, any> = {};

    for (const step of steps) {
        if (step.end) {
            const stepDivElm = document.createElement("div");
            stepDivElm.className = `code code-${step.end}`;
            stepDivElm.innerHTML = step.code;
            sequenceElm.appendChild(stepDivElm);

            if (!step.fakecode) {
                try {
                    let result = await eval(`(async () => { ${step.code}\n; return ${step.return}; })()`);

                    let str = JSON.stringify(result, null, "  ");
                    if (typeof str === "string") {
                        const valueDiv = document.createElement("div");
                        valueDiv.className = "codevalue";
                        valueDiv.innerText += `> ${step.return}: ` + str;
                        stepDivElm.appendChild(valueDiv);
                    }
                    
                    if (result && step.return) {
                        resultsAcc[step.return] = result;
                    }
                } catch (error) {
                    stepDivElm.innerText += `\n> ${(error as Error).toString()}`;
                    stepDivElm.className += " code-error";
                    console.error(error);
                    TEST_PASSED = false;
                }
            }
        } else if (step.request || step.reply) {
            const div = document.createElement("div");
            div.className = `comms-${step.request ? "right" : "left"}`;
            div.innerText = `${step.request || step.reply}(${step.send.join(", ")})`;
            sequenceElm.appendChild(div);
        } else if (step.break) {
            const div = document.createElement("div");
            div.className = "break";
            div.innerText = `${step.break}`;
            sequenceElm.appendChild(div);
        }
    }

    resolve(TEST_PASSED);
});

