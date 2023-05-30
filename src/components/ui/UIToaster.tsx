import { classNames } from '@/utils';
import { HTMLAttributes, ReactNode } from 'react';
import toast, { Toast, ToastOptions, Toaster as ToasterComponent } from 'react-hot-toast';

export function UIToaster() {
    return (
        <div className="toaser">
            <ToasterComponent
                position="bottom-right"
                reverseOrder={false}
                gutter={24}
            //containerClassName=""
            //containerStyle={{}}
            // toastOptions={{
            //     // Define default options
            //     //className: '',
            //     duration: 5000,
            //     // style: {
            //     //     background: '#363636',
            //     //     color: '#fff',
            //     // },
            //     // // Default options for specific types
            //     // success: {
            //     //     duration: 3000,
            //     //     iconTheme: {
            //     //         primary: 'green',
            //     //         secondary: 'black',
            //     //     },
            //     // },
            // }}
            />
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
const textClasses = "text-primary-300 dark:text-primary-600 bg-primary-600 dark:bg-primary-300";

// regular notification

function NotificationBodyWorkingaBodyAnimation({ message, thisToast, onClick, ...rest }: { message: ReactNode; thisToast: Toast; } & HTMLAttributes<HTMLElement>) {
    console.log('thisToast.visible', thisToast);

    return (
        <div className={`${toastNotificationClasses} ${textClasses}`} {...rest}>
            {/* <div className={`p-4 w-full bg-green-400 rounded animate-enter-from-right duration-1000`}> */}
            <div className={`p-4 w-full bg-green-400 rounded animate-[enter-from-right_.2s_ease-out]`}>
                {message}
            </div>
        </div>
    );
}

function NotificationBodyNonWorkingaBodyAnimation({ message, thisToast, onClick, ...rest }: { message: ReactNode; thisToast: Toast; } & HTMLAttributes<HTMLElement>) {
    console.log('thisToast.visible', thisToast.visible);

    return (
        <div className={classNames(toastNotificationClasses, "")} {...rest}>
            <div className={classNames("p-4 w-full bg-white dark:bg-primary-300 rounded shadow animate-scale-in origin-right")}>
                {message}
            </div>
        </div>
    );
}

export const toastNotification = (message: ReactNode, options?: ToastOptions): string => {
    return toast.custom(
        (thisToast: Toast) => <NotificationBodyWorkingaBodyAnimation message={message} thisToast={thisToast} onClick={() => toast.dismiss(thisToast.id)} />,
        { duration: 2000, ...options }
    );
};

// with close

const toastRootClasses = "-m-2 w-full max-w-md bg-white dark:bg-primary-300 ring-1 ring-black ring-opacity-5 shadow rounded pointer-events-auto flex";

const toastBtnClasses = [
    "p-4 w-full text-sm font-medium flex items-center justify-center",
    "border border-transparent rounded-none rounded-r",
    "text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
].join(' ');

function ToastBodyWithClose({ message, thisToast, onClick, ...rest }: { message: ReactNode; thisToast: Toast; } & HTMLAttributes<HTMLElement>) {
    return (
        <div className={`${thisToast.visible ? 'slide-in2' : 'fade-out2'} ${toastRootClasses}`} {...rest}>
            <div className="flex-1 p-4 slide-in">
                {message}
            </div>

            <div className="flex border-l border-gray-200">
                <button className={toastBtnClasses} onClick={onClick}>
                    Close
                </button>
            </div>
        </div>
    );
}

export const toastTw = (message: ReactNode, options?: ToastOptions): string => {
    return toast.custom(
        (thisToast: Toast) => <ToastBodyWithClose message={message} thisToast={thisToast} onClick={() => toast.dismiss(thisToast.id)} />,
        { duration: 141000, ...options }
    );
};
