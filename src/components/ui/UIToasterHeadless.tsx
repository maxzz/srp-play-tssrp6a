import toast, { resolveValue, useToaster } from "react-hot-toast";

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;
    return (
        <div
            style={{
                position: 'fixed',
                // top: 8,
                // left: 8
                // position: 'absolute',
                // top: 0,
                // left: 0,
                inset: 0,
                zIndex: 9999,
                pointerEvents: 'none',
            }}
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map((toast) => {

                const offset = calculateOffset(toast, { reverseOrder: false, gutter: 8 });

                const ref = (el: HTMLDivElement) => {
                    if (el && typeof toast.height !== "number") {
                        const height = el.getBoundingClientRect().height;
                        updateHeight(toast.id, height);
                    }
                };

                console.log('Notifications', toast);

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        className="absolute right-0 bottom-0 w-[200px] m-2 p-4 text-green-950 bg-green-200 z-50"
                        style={{
                            //position: "absolute",
                            //width: "200px",
                            //background: "papayawhip",
                            transition: "all 0.5s ease-out",
                            opacity: toast.visible ? 1 : 0,
                            transform: `translateY(-${offset}px)`
                        }}
                        {...toast.ariaProps}
                    >
                        {resolveValue(toast.message, toast)}
                    </div>
                );
            })}
        </div>
    );
};

export function HeadlessToastTest() {
    return (
        <div className="">
            <Notifications />
            <button
                className="m-4 px-2 py-1.5 bg-primary-700 hover:bg-primary-600 border-primary-500 border rounded"
                onClick={() => toast(<div className="text-2xl font-semibold">"Hello World!"</div>, { duration: 2000 })}
            >
                Add Headless Toast
            </button>
        </div>
    );
}
