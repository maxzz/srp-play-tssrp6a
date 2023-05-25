import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { rowButtonClasses } from './RowButtons';
import { inputFocusClasses } from './Rows';
import { classNames } from '@/utils';

// export const rowButtonClasses = [
//     "bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-600 border rounded shadow active:scale-y-[.97] disabled:opacity-20",
// ].join(' ');

// export const inputFocusClasses = "focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-primary-200 dark:focus:ring-offset-primary-800 focus:ring-1 focus:ring-offset-1 focus:outline-none";

const rootClasses = [
    "px-4 py-2 bg-red-500 rounded",

    "data-[state=open]:animate-slideIn",
    "data-[state=closed]:animate-hide",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
    "data-[swipe=end]:animate-swipeOut",

    "grid [grid-template-areas:_'title_action'_'description_action']",
    "grid-cols-[auto_max-content] items-center gap-x-4",
].join(' ');

const titleClasses = ["[grid-area:title] mb-2 font-medium text-primary-800 dark:text-primary-200 text-[15px]"].join(' ');

const descriptionClasses = ["[grid-area:description] m-0 text-slate11 text-[13px] leading-[1.3]"].join(' ');

const actionClasses = ["px-3 py-2 text-xs", rowButtonClasses, inputFocusClasses].join(' ');

const viewportClasses = "fixed bottom-8 right-4 w-96 max-w-[80vw] z-50";

export const ToastDemo = () => {
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    function onShowClick() {
        setOpen(false);
        clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            eventDateRef.current = oneWeekAway();
            setOpen(true);
        }, 100);
    }

    return (
        <Toast.Provider swipeDirection="right" duration={20000}>
            <button className={classNames("px-3 py-2 text-xs", rowButtonClasses, inputFocusClasses)} onClick={onShowClick}>
                Show toaster
            </button>

            <Toast.Root className={rootClasses} open={open} onOpenChange={setOpen}>
                <Toast.Title className={titleClasses}>
                    Scheduled: Catch up
                </Toast.Title>

                <Toast.Description asChild>
                    <time className={descriptionClasses} dateTime={eventDateRef.current.toISOString()}>
                        {prettyDate(eventDateRef.current)}
                    </time>
                </Toast.Description>

                <Toast.Action className="[grid-area:action]" asChild altText="Goto schedule to undo">
                    <button className={actionClasses}>
                        Undo
                    </button>
                </Toast.Action>
            </Toast.Root>

            <Toast.Viewport className={viewportClasses} />

        </Toast.Provider>
    );
};

function oneWeekAway() {
    const now = new Date();
    const inOneWeek = now.setDate(now.getDate() + 7);
    return new Date(inOneWeek);
}

function prettyDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date);
}
