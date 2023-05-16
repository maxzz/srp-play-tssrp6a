import { buttonClasses } from '.';
import { runSteps } from '../../srp-tests';

export function DataDriven() {
    return (
        <div className="p-4 text-sm space-y-4">
            <div className="notes">
                <div className="w-1/2 space-y-2">
                    <h3 className="font-semibold">This demo runs a TSSRP6A client and server.</h3>
                    
                    <p>The request/responses are not really happening, everything runs in the
                        browser, but only the shown values would be "sent" to the other side.</p>
                    <p>The code blocks are actually executed. The "return value" is printed out.</p>
                    <p>On error, the block is marked in red with the error message instead.</p>
                    <p>This page also serves as browser test.</p>
                </div>
            </div>

            <button className={buttonClasses} onClick={async () => { runSteps(); }}>
                Start
            </button>

            <div id="sequence">
                <div className="column column-left">Browser</div>
                <div className="column column-right">Server</div>
                <div className="lines"></div>
                <div id="sequence-inner"></div>
            </div>

        </div>
    );
}
