import React from 'react';

export function DataDriven() {
    return (
        <div>
            <div id="sequence">
                <div className="column column-left">Browser</div>
                <div className="column column-right">Server</div>
                <div className="lines"></div>
                <div id="sequence-inner">
                </div>
            </div>
            <div className="notes">
                <h3>This demo runs a TSSRP6A client and server.</h3>
                <p>
                    The request/responses are not really happening, everything runs in the
                    browser, but only the shown values would be "sent" to the other side.<br />
                    The code blocks are actually executed. The "return value" is printed out.<br />
                    On error, the block is marked in red with the error message instead.<br />
                    This page also serves as browser test.
                </p>
            </div>
        </div>
    );
}
