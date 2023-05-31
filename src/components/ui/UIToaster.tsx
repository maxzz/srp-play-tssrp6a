import { classNames } from '@/utils';
import { HTMLAttributes, ReactNode } from 'react';
import toast, { Toast, ToastOptions, Toaster as ToasterComponent } from 'react-hot-toast';
import { IconClose } from '.';
import { buttonClasses } from '../section2_main';

export function UIToaster() {
    return (
        <div className="toaser">
            <ToasterComponent position="bottom-right" reverseOrder={false} gutter={24} />
        </div>
    );
}

type ToastHandler = typeof toast.custom;

export const toastWarning: ToastHandler = (message, options) => {
    return toast(message, {
        ...{ style: { backgroundColor: 'tomato' } },
        ...options,
    });
};

const toastNotificationClasses = "-m-2 w-full max-w-md pointer-events-auto shadow rounded overflow-hidden";
const textClasses = "text-primary-300 dark:text-primary-300 bg-primary-600 dark:bg-primary-700";

// regular notification

function NotificationBody({ message, thisToast, showClose, ...rest }: { message: ReactNode; thisToast: Toast; showClose?: boolean; } & HTMLAttributes<HTMLElement>) {
    console.log('thisToast.visible', thisToast);
    return (
        <div className={`${toastNotificationClasses} ${textClasses}`} {...rest}>
            <div className={classNames("p-4 w-full rounded animate-[enter-from-right_.2s_ease-out]", "flex items-center justify-between")}>
                {message}
                {showClose &&
                    <button className="p-1.5 hover:bg-primary-600 rounded active:scale-95" onClick={() => toast.dismiss(thisToast.id)}>
                        <IconClose className="w-5 h-5" />
                    </button>
                }
            </div>
        </div>
    );
}

export const toastNotification = (message: ReactNode, options?: ToastOptions & { showClose?: boolean; }): string => {
    return toast.custom(
        (thisToast: Toast) => <NotificationBody message={message} thisToast={thisToast} showClose={options?.showClose} />,
        { duration: 2000, ...options }
    );
};

export function ToastWithUITest() {
    return (
        <div className="p-4">
            <button
                className={classNames("px-1.5 py-1", buttonClasses)}
                onClick={() => {
                    toastNotification('ready', { duration: 552000, showClose: true });
                }}
            >
                Add toast with standard UI
            </button>
        </div>
    );
}
