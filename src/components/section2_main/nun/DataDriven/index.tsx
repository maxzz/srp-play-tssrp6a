import { useState } from 'react';
import { buttonClasses } from '../..';
import { ProcessItem, runSteps, runStepsTest } from './test-data-driven';

export function DataDriven() {
    const [steps, setSteps] = useState<ProcessItem[]>([]);
    async function run() {
        const results = await runStepsTest();
        setSteps(results);

        // const results = await runSteps();
        // setSteps(results);
    }
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

            <button className={buttonClasses} onClick={async () => { run(); }}>
                Start
            </button>

            {/* <div id="sequence">
                <div className="column column-left">Browser</div>
                <div className="column column-right">Server</div>
                <div className="lines"></div>
                <div id="sequence-inner"></div>
            </div> */}

            {steps.map((step) => (
                <div className={`${step.className}`}>{step.text}</div>
            ))}

        </div>
    );
}

/*
const toastRootClasses = "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5";
const toastBtnClasses = "w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

export const toastTw: typeof toast.custom = (message, options) => {
    return toast.custom((thisToast) => (
        <div className={`${thisToast.visible ? 'animate-enter' : 'animate-leave'} ${toastRootClasses}`}>
    
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <img
                            className="h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            Emilia Gates
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Sure! 8:30pm works great!
                        </p>
                    </div>
                </div>
            </div>
    
            <div className="flex border-l border-gray-200">
                <button className={toastBtnClasses} onClick={() => toast.dismiss(thisToast.id)}>
                    Close
                </button>
            </div>
        </div>
    ));
}
*/

/*
    theme: {
        extend: {
            colors: {
                primary: colors.slate,
                // ui: {
                //     bg: colors.slate[100],
                //     text: '#5a3543',
                // },
            },

            keyframes: {
                hide: {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
                slideIn: {
                    from: { transform: 'translateX(100%)' }, //12px for --viewport-padding
                    to: { transform: 'translateX(0)' },
                },
                swipeOut: {
                    from: { transform: 'translateX(var(12px))' }, //12px for --radix-toast-swipe-end-x
                    to: { transform: 'translateX(calc(100% + var(12px)))' }, //12px for --viewport-padding
                },
            },
            animation: {
                hide: 'hide 100ms ease-in',
                slideIn: 'slideIn 1150ms cubic-bezier(0.16, 1, 0.3, 1)',
                swipeOut: 'swipeOut 1100ms ease-out',
            },
        },
    },
*/
