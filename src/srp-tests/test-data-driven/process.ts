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

export type ProcessItem = {
    className: string;
    text: string;
    items?: ProcessItem;
};

function* allSteps() {
    yield 1;
    yield 2;
    yield 3;
}

export async function runStepsTest() {

    for (const res of allSteps()) {
        console.log('res', res);    
    }
    
    return [];
}

export async function runSteps() {

    const sequenceElm = document.getElementById("sequence-inner")!;

    let rv: ProcessItem[] = [];

    const processItems: ProcessItem[] = [];

    const resultsAcc: Record<string, any> = {};

    const context = {};

    for (const step of steps) {
        if (step.end) {

            processItems.push({ className: `code code-${step.end}`, text: step.code || '' });

            // const stepDivElm = document.createElement("div");
            // stepDivElm.className = `code code-${step.end}`;
            // stepDivElm.innerHTML = step.code || '';
            // sequenceElm.appendChild(stepDivElm);
            if (!step.fakecode) {
                try {

                    let result = await eval(`(async () => { ${step.code}\n; return ${step.return}; })()`);

                    let str = JSON.stringify(result, null, 4);
                    if (typeof str === "string") {

                        processItems.push({ className: 'codevalue', text: `> ${step.return}: ` + str });

                        // const valueDiv = document.createElement("div");
                        // valueDiv.className = "codevalue";
                        // valueDiv.innerText += `> ${step.return}: ` + str;
                        // stepDivElm.appendChild(valueDiv);
                    }

                    if (result && step.return) {
                        resultsAcc[step.return] = result;
                    }
                } catch (error) {
                    processItems.push({ className: 'code-error', text: `\n> ${(error as Error).toString()}` });

                    // stepDivElm.innerText += `\n> ${(error as Error).toString()}`;
                    // stepDivElm.className += " code-error";
                    console.error(error);
                    // rv = [];
                    return [];
                }
            }
        } else if (step.request || step.reply) {
            processItems.push({ className: `comms-${step.request ? "right" : "left"}`, text: `${step.request || step.reply}(${(step.send || []).join(", ")})` });

            // const div = document.createElement("div");
            // div.className = `comms-${step.request ? "right" : "left"}`;
            // div.innerText = `${step.request || step.reply}(${(step.send || []).join(", ")})`;
            // sequenceElm.appendChild(div);
        } else if (step.break) {
            processItems.push({ className: 'break', text: `${step.break}` });

            // const div = document.createElement("div");
            // div.className = "break";
            // div.innerText = `${step.break}`;
            // sequenceElm.appendChild(div);
        }
    }

    return rv;
}
