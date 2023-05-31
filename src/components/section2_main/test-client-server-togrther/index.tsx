import React from 'react';
import { buttonClasses } from '../test-client-server-separate';
import { testClientServerTogrther } from './test-client-server-togrther';

export function ClientServerTogether() {
    return (
        <button className={buttonClasses} onClick={async () => { testClientServerTogrther(); }}>
            Run client/server in the same process test
        </button>
    );
}
