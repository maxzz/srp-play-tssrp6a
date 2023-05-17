import { testClientServerTogrther } from "../../srp-tests";

export const buttonClasses = "px-3 py-1.5 bg-slate-100 border-state-300 border rounded shadow";

export function Section2_Main() {
    return (
        <div className="text-sm text-slate-800 divide-y divide-solid divide-slate-300">
            <div className="p-4">
                <button className={buttonClasses} onClick={async () => { testClientServerTogrther(); }}>
                    Start
                </button>
            </div>

            <div className=""></div>
        </div>
    );
}
