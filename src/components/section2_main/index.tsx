import { testAuthenticationSession } from "../../srp-tests";

export function Section2_Main() {
    return (
        <div className="p-4 text-slate-800">
            <button className="px-3 py-1.5 bg-slate-100 border-state-300 border rounded shadow" onClick={async () => { testAuthenticationSession(); }}>
                Start
            </button>
        </div>
    );
}
