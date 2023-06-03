import { ClientServerSeparate } from "./client-ui";
import { WebServer } from "./server-ui";

export * from "../tailwind-shared-classes";

export function ClientServerSeparateBody() {
    return (
        <div className="p-4 relative">
            <div className="absolute left-8 top-1 px-2 text-primary-400 dark:text-primary-600 bg-primary-100 dark:bg-primary-800">SRP</div>

            <div className="max-w-[84ch] border-primary-300 dark:border-primary-700 divide-primary-300 dark:divide-primary-700 rounded-md border border-solid divide-y dark:divide-y drop-shadow">
                <div className="">
                    <div className="">
                        <ClientServerSeparate />
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <WebServer />
                    </div>
                </div>
            </div>
        </div>
    );
}
