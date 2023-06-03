import { HTMLAttributes } from "react";
import { ClientServerSeparate } from "./client-ui";
import { WebServer } from "./server-ui";
import { classNames } from "@/utils";

export * from "../tailwind-shared-classes";

export function ClientServerSeparateBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={classNames("relative", className)} {...rest}>
            <div className="absolute left-2 -top-2.5 px-2 text-primary-400 dark:text-primary-600 bg-primary-100 dark:bg-primary-800 z-10">
                SRP
            </div>

            <div className=" border-primary-300 dark:border-primary-700 divide-primary-300 dark:divide-primary-700 rounded-md border border-solid divide-y dark:divide-y drop-shadow">
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
