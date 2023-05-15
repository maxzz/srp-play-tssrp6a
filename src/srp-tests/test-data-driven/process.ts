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

    const sq = document.getElementById("sequence-inner")!;

    let TEST_PASSED = null;

    const resultsAcc: Record<string, any> = {};

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
                    
                    if (result && step.return) {
                        resultsAcc[step.return] = result;
                    }
                } catch (error) {
                    div.innerText += `\n> ${(error as Error).toString()}`;
                    div.className += " code-error";
                    console.error(error);
                    TEST_PASSED = false;
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

    resolve(TEST_PASSED);
});

