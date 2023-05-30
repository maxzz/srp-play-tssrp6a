import { ReactNode } from 'react';
import toast, { Toast, ToastOptions, Toaster as ToasterComponent } from 'react-hot-toast';

export function UIToaster() {
    return (
        <div className="toaser">
            <ToasterComponent
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                //containerClassName=""
                //containerStyle={{}}
                toastOptions={{
                    // Define default options
                    //className: '',
                    duration: 5000,
                    // style: {
                    //     background: '#363636',
                    //     color: '#fff',
                    // },
                    // // Default options for specific types
                    // success: {
                    //     duration: 3000,
                    //     iconTheme: {
                    //         primary: 'green',
                    //         secondary: 'black',
                    //     },
                    // },
                }}
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

const toastRootClasses = "-m-2 w-full max-w-md bg-white dark:bg-primary-300 ring-1 ring-black ring-opacity-5 shadow rounded pointer-events-auto flex";
const toastBtnClasses = [
    "p-4 w-full text-sm font-medium flex items-center justify-center",
    "border border-transparent rounded-none rounded-r",
    "text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
].join(' ');

export const toastTw = (message: ReactNode, options: ToastOptions): string => {
    return toast.custom(
        (thisToast: Toast) => (
            <div className={`${thisToast.visible ? 'slide-in2' : 'fade-out2'} ${toastRootClasses}`}>

                <div className="flex-1 p-4 slide-in">
                    {message}
                </div>

                <div className="flex border-l border-gray-200">
                    <button className={toastBtnClasses} onClick={() => toast.dismiss(thisToast.id)}>
                        Close
                    </button>
                </div>
            </div>
        ),
        { duration: 141000, ...options }
    );
};
