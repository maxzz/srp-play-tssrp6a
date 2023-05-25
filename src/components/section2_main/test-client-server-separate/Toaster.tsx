import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { rowButtonClasses } from './RowButtons';
import { inputFocusClasses } from './Rows';
import { classNames } from '@/utils';

const rootClasses = [
    "bg-white rounded-md p-[15px]",
    "data-[state=open]:animate-slideIn",
    "data-[state=closed]:animate-hide",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
    "data-[swipe=end]:animate-swipeOut",
    "grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] items-center gap-x-[15px]",
    "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
].join(' ');

const titleClasses = ["[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]"].join(' ');

const descriptionClasses = ["[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]"].join(' ');

const actionClasses = [
    "px-[10px] h-[25px] leading-[25px] font-medium text-xs",
    "inline-flex items-center justify-center rounded",
    "text-green11 bg-green2",
    "focus:shadow-[0_0_0_2px] focus:shadow-green8",
    "shadow-green7 hover:shadow-green8 shadow-[inset_0_0_0_1px] hover:shadow-[inset_0_0_0_1px]",
].join(' ');

const viewportClasses = [
    "fixed bottom-0 right-0 w-[390px] max-w-[100vw] m-0",
    "[--viewport-padding:_25px] p-[var(--viewport-padding)]",
    "flex flex-col gap-[10px] list-none outline-none z-[2147483647]",
].join(' ');

const ToastDemo = () => {
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <Toast.Provider swipeDirection="right">
            <button
                className={classNames("px-3 py-2 text-xs", rowButtonClasses, inputFocusClasses)}
                onClick={() => {
                    setOpen(false);
                    clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                        eventDateRef.current = oneWeekAway();
                        setOpen(true);
                    }, 100);
                }}
            >
                Show toaster
            </button>

            <Toast.Root
                className={rootClasses}
                open={open}
                onOpenChange={setOpen}
            >
                <Toast.Title className={titleClasses}>
                    Scheduled: Catch up
                </Toast.Title>

                <Toast.Description asChild>
                    <time
                        className={descriptionClasses}
                        dateTime={eventDateRef.current.toISOString()}
                    >
                        {prettyDate(eventDateRef.current)}
                    </time>
                </Toast.Description>

                <Toast.Action className="[grid-area:_action]" asChild altText="Goto schedule to undo">
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

export default ToastDemo;
