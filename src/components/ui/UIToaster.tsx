import React from 'react';
import toast, { Toaster as ToasterComponent } from 'react-hot-toast';

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
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </div>
    );
}

export const toastWarning: typeof toast.custom = (message, options) => {
    return toast(message, {
        ...{ style: { backgroundColor: 'tomato' } },
        ...options,
    });
};

const toastRootClasses = "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5";
const toastBtnClasses = "w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

toast.custom((thisToast) => (
    <div className={`${thisToast.visible ? 'animate-enter' : 'animate-leave'} ${toastRootClasses}`}>
        
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                        alt=""
                    />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        Emilia Gates
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Sure! 8:30pm works great!
                    </p>
                </div>
            </div>
        </div>

        <div className="flex border-l border-gray-200">
            <button className={toastBtnClasses} onClick={() => toast.dismiss(thisToast.id)}>
                Close
            </button>
        </div>
    </div>
));
