import { testClientServerTogrther } from "./test-client-server-togrther";
import { ClientServerSeparate } from "./test-client-server-separate";

export const buttonClasses = "px-3 py-1.5 bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-500 border rounded shadow active:scale-y-95";

export function Section2_Main() {
    return (
        <div className="text-sm text-primary-800 dark:text-primary-300 divide-y divide-dotted divide-primary-300">

            <div className="p-4">
                <button className={buttonClasses} onClick={async () => { testClientServerTogrther(); }}>
                    Start
                </button>
            </div>

            <div className="">
                <ClientServerSeparate />
            </div>

            <div className=""></div>
        </div>
    );
}
