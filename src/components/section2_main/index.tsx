import { ClientServerTogether } from "./test-client-server-togrther";
import { ClientServerSeparateBody } from "./test-client-server-separate";
import { ToastWithUITest } from "../ui/UIToaster";
// import { AccordionTest } from "./nun/GeneratedAccordion";
// import { AccordionTest2 } from "./nun/GeneratedAccordion2";

export function Section2_Main() {
    return (
        <div className="mt-2 text-sm text-primary-800 dark:text-primary-300 divide-primary-400 dark:divide-primary-600 divide-y divide-dotted">

            <ClientServerSeparateBody className="m-4 max-w-[84ch]" />

            <div className="p-4">
                <ClientServerTogether />
            </div>

            {/* <div className="p-4">
                <AccordionTest />
            </div> */}

            {/* <div className="p-4">
                <AccordionTest2 />
            </div> */}

            <div className="">
                <div className="max-w-[84ch] flex items-center">
                    <ToastWithUITest />
                </div>
            </div>

            <div />
        </div>
    );
}
//, {duration:2000}