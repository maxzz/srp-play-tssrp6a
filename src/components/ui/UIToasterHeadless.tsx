import toast, { resolveValue, useToaster } from "react-hot-toast";

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;
    return (
        <div
            style={{
                position: "fixed",
                top: 8,
                left: 8
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

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        style={{
                            position: "absolute",
                            width: "200px",
                            background: "papayawhip",
                            transition: "all 0.5s ease-out",
                            opacity: toast.visible ? 1 : 0,
                            transform: `translateY(${offset}px)`
                        }}
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
            <button onClick={() => toast("Hello World!")}>Add Toast</button>
        </div>
    );
}