import React from 'react';
import { buttonClasses } from '..';
import { testClientServerTogrther } from './test-client-server-togrther';

export function ClientServerTogether() {
    return (
        <button className={buttonClasses} onClick={async () => { testClientServerTogrther(); }}>
            Start
        </button>
    );
}
