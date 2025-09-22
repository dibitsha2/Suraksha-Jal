module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/components/theme-provider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/theme-provider.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
;
}}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}}),
"[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}}),
"[project]/src/components/ui/toaster.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/lib/translations.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "languages": (()=>languages),
    "translations": (()=>translations)
});
const languages = [
    {
        code: 'as',
        name: 'অসমীয়া (Assamese)'
    },
    {
        code: 'bn',
        name: 'বাংলা (Bengali)'
    },
    {
        code: 'brx',
        name: 'बोड़ो (Bodo)'
    },
    {
        code: 'doi',
        name: 'डोगरी (Dogri)'
    },
    {
        code: 'en',
        name: 'English'
    },
    {
        code: 'gu',
        name: 'ગુજરાતી (Gujarati)'
    },
    {
        code: 'hi',
        name: 'हिन्दी (Hindi)'
    },
    {
        code: 'kn',
        name: 'ಕನ್ನಡ (Kannada)'
    },
    {
        code: 'ks',
        name: 'कश्मीरी (Kashmiri)'
    },
    {
        code: 'kok',
        name: 'कोंकणी (Konkani)'
    },
    {
        code: 'mai',
        name: 'मैथिली (Maithili)'
    },
    {
        code: 'ml',
        name: 'മലയാളം (Malayalam)'
    },
    {
        code: 'mni',
        name: 'মৈতৈলোন্ (Manipuri)'
    },
    {
        code: 'mr',
        name: 'मराठी (Marathi)'
    },
    {
        code: 'ne',
        name: 'नेपाली (Nepali)'
    },
    {
        code: 'or',
        name: 'ଓଡ଼ିଆ (Odia)'
    },
    {
        code: 'pa',
        name: 'ਪੰਜਾਬੀ (Punjabi)'
    },
    {
        code: 'sa',
        name: 'संस्कृतम् (Sanskrit)'
    },
    {
        code: 'sat',
        name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)'
    },
    {
        code: 'sd',
        name: 'सिन्धी (Sindhi)'
    },
    {
        code: 'ta',
        name: 'தமிழ் (Tamil)'
    },
    {
        code: 'te',
        name: 'తెలుగు (Telugu)'
    },
    {
        code: 'ur',
        name: 'اردو (Urdu)'
    }
];
const generateTranslations = ()=>{
    const translations = {};
    const englishFallbacks = {
        dashboard: 'Dashboard',
        symptomChecker: 'Symptom Checker',
        reports: 'Local Reports',
        profile: 'Profile',
        languageSettings: 'Language Settings',
        logout: 'Logout',
        welcome: 'Welcome',
        checkSymptomsPrompt: 'Feeling unwell? Check your symptoms now.',
        getStarted: 'Get Started',
        casesLast30Days: 'Cases in last 30 days',
        precautions: 'Precautions',
        medicationSuggester: 'Medication Suggester',
        healthReminders: 'Health Reminders',
        reminders: 'Reminders',
        medicineChecker: 'Medicine Checker',
        waterQuality: 'Water Quality',
        aiChat: 'AI Chat',
        emergencyContacts: 'Emergency Contacts',
        viewReports: 'View Reports'
    };
    for (const lang of languages){
        translations[lang.code] = {
            ...englishFallbacks
        };
    }
    // Add specific known translations
    translations.hi = {
        dashboard: 'डैशबोर्ड',
        symptomChecker: 'लक्षण परीक्षक',
        reports: 'स्थानीय रिपोर्ट',
        profile: 'प्रोफ़ाइल',
        languageSettings: 'भाषा सेटिंग्स',
        logout: 'लॉग आउट',
        welcome: 'स्वागत है',
        checkSymptomsPrompt: 'अस्वस्थ महसूस कर रहे हैं? अभी अपने लक्षणों की जाँच करें।',
        getStarted: 'शुरू हो जाओ',
        casesLast30Days: 'पिछले 30 दिनों में मामले',
        precautions: 'सावधानियां',
        medicationSuggester: 'दवाइयाँ सुझाएँ',
        healthReminders: 'स्वास्थ्य अनुस्मारक',
        reminders: 'अनुस्मारक',
        medicineChecker: 'दवा परीक्षक',
        waterQuality: 'पानी की गुणवत्ता',
        aiChat: 'एआई चैट',
        emergencyContacts: 'आपातकालीन संपर्क',
        viewReports: 'रिपोर्ट देखें'
    };
    translations.bn = {
        dashboard: 'ড্যাশবোর্ড',
        symptomChecker: 'লক্ষণ পরীক্ষক',
        reports: 'স্থানীয় প্রতিবেদন',
        profile: 'প্রোফাইল',
        languageSettings: 'ভাষা সেটিংস',
        logout: 'লগ আউট',
        welcome: 'স্বাগতম',
        checkSymptomsPrompt: 'অসুস্থ বোধ করছেন? এখনই আপনার লক্ষণগুলি পরীক্ষা করুন।',
        getStarted: 'এবার শুরু করা যাক',
        casesLast30Days: 'গত ৩০ দিনে কেস',
        precautions: 'সতর্কতা',
        medicationSuggester: 'ঔষধের পরামর্শ',
        healthReminders: 'স্বাস্থ্য অনুস্মারক',
        reminders: 'অনুস্মারক',
        medicineChecker: 'ঔষধ পরীক্ষক',
        waterQuality: 'জলর গুণগত মান',
        aiChat: 'এআই চ্যাট',
        emergencyContacts: 'জরুরী যোগাযোগ',
        viewReports: 'রিপোর্ট দেখুন'
    };
    translations.as = {
        dashboard: 'ডেশ্বৰ্ড',
        symptomChecker: 'ৰোগৰ লক্ষণ পৰীক্ষক',
        reports: 'স্থানীয় প্ৰতিবেদন',
        profile: 'প্ৰফাইল',
        languageSettings: 'ভাষা ছেটিংছ',
        logout: 'লগ আউট',
        welcome: 'স্বাগতম',
        checkSymptomsPrompt: 'অসুস্থ অনুভৱ কৰিছে নেকি? এতিয়াই আপোনাৰ লক্ষণবোৰ পৰীক্ষা কৰক।',
        getStarted: 'আৰম্ভ কৰক',
        casesLast30Days: 'যোৱا ৩০ দিনত গোচৰ',
        precautions: 'সতৰ্কতামূলক ব্যৱস্থা',
        medicationSuggester: 'ঔষধৰ পৰামৰ্শ',
        healthReminders: 'স্বাস্থ্য স্মাৰক',
        reminders: 'স্মাৰক',
        medicineChecker: 'ঔষধ পৰীক্ষক',
        waterQuality: 'পানীৰ গুণগত মান',
        aiChat: 'এআই চেট',
        emergencyContacts: 'জৰুৰীকালীন যোগাযোগ',
        viewReports: 'প্ৰতিবেদন চাওক'
    };
    translations.gu = {
        dashboard: 'ડેશબોર્ડ',
        symptomChecker: 'લક્ષણ તપાસનાર',
        reports: 'સ્થાનિક અહેવાલો',
        profile: 'પ્રોફાઇલ',
        languageSettings: 'ભાષા સેટિંગ્સ',
        logout: 'લૉગ આઉટ',
        welcome: 'સ્વાગત છે',
        checkSymptomsPrompt: 'અસ્વસ્થતા અનુભવો છો? હવે તમારા લક્ષણો તપાસો.',
        getStarted: 'શરૂ કરો',
        casesLast30Days: 'છેલ્લા 30 દિવસમાં કેસ',
        precautions: 'સાવચેતીઓ',
        medicationSuggester: 'દવા સૂચવનાર',
        healthReminders: 'આરોગ્ય રીમાઇન્ડર્સ',
        reminders: 'રીમાઇન્ડર્સ',
        medicineChecker: 'દવા તપાસનાર',
        waterQuality: 'પાણીની ગુણવત્તા',
        aiChat: 'AI ચેટ',
        emergencyContacts: 'ઇમરજન્સી સંપર્કો',
        viewReports: 'અહેવાલો જુઓ'
    };
    translations.ta = {
        dashboard: 'แดชบอร์ด',
        symptomChecker: 'அறிகுறி சரிபார்ப்பு',
        reports: 'உள்ளூர் அறிக்கைகள்',
        profile: 'சுயவிவரம்',
        languageSettings: 'மொழி அமைப்புகள்',
        logout: 'வெளியேறு',
        welcome: 'வரவேற்கிறோம்',
        checkSymptomsPrompt: 'உடல்நிலை சரியில்லையா? உங்கள் அறிகுறிகளை இப்போது சரிபார்க்கவும்.',
        getStarted: 'தொடங்குங்கள்',
        casesLast30Days: 'கடந்த 30 நாட்களில் வழக்குகள்',
        precautions: 'முன்னெச்சரிக்கைகள்',
        medicationSuggester: 'மருந்து பரிந்துரையாளர்',
        healthReminders: 'உடல்நல நினைவூட்டல்கள்',
        reminders: 'நினைவூட்டல்கள்',
        medicineChecker: 'மருந்து சரிபார்ப்பு',
        waterQuality: 'நீரின் தரம்',
        aiChat: 'AI அரட்டை',
        emergencyContacts: 'அவசர தொடர்புகள்',
        viewReports: 'அறிக்கைகளைப் பார்க்கவும்'
    };
    translations.te = {
        dashboard: 'డాష్‌బోర్డ్',
        symptomChecker: 'లక్షణాల తనిఖీ',
        reports: 'స్థానిక నివేదికలు',
        profile: 'ప్రొఫైల్',
        languageSettings: 'భాషా సెట్టింగ్‌లు',
        logout: 'లాగ్ అవుట్',
        welcome: 'స్వాగతం',
        checkSymptomsPrompt: 'అనారోగ్యంగా అనిపిస్తుందా? మీ లక్షణాలను ఇప్పుడు తనిఖీ చేయండి.',
        getStarted: 'ప్రారంభించండి',
        casesLast30Days: 'గత 30 రోజులలో కేసులు',
        precautions: 'జాగ్రత్తలు',
        medicationSuggester: 'మందుల సూచన',
        healthReminders: 'ఆరోగ్య రిమైండర్‌లు',
        reminders: 'రిమైండర్‌లు',
        medicineChecker: 'మందుల తనిఖీ',
        waterQuality: 'నీటి నాణ్యత',
        aiChat: 'AI చాట్',
        emergencyContacts: 'అత్యవసర పరిచయాలు',
        viewReports: 'నివేదికలను వీక్షించండి'
    };
    translations.kn = {
        dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        symptomChecker: 'ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ',
        reports: 'ಸ್ಥಳೀಯ ವರದಿಗಳು',
        profile: 'ಪ್ರೊಫೈಲ್',
        languageSettings: 'ಭಾಷಾ ಸಂಯೋಜನೆಗಳು',
        logout: 'ಲಾಗ್ ಔಟ್',
        welcome: 'ಸ್ವಾಗತ',
        checkSymptomsPrompt: 'ಅನಾರೋಗ್ಯ ಅನಿಸುತ್ತಿದೆಯೇ? ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಈಗಲೇ ಪರಿಶೀಲಿಸಿ.',
        getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
        casesLast30Days: 'ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ ಪ್ರಕರಣಗಳು',
        precautions: 'ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
        medicationSuggester: 'ಔಷಧಿ ಸೂಚಕ',
        healthReminders: 'ಆರೋಗ್ಯ ಜ್ಞಾಪನೆಗಳು',
        reminders: 'ಜ್ಞಾಪನೆಗಳು',
        medicineChecker: 'ಔಷಧಿ ಪರೀಕ್ಷಕ',
        waterQuality: 'ನೀರಿನ ಗುಣಮಟ್ಟ',
        aiChat: 'AI ಚಾಟ್',
        emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
        viewReports: 'ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
    };
    translations.ml = {
        dashboard: 'ഡാഷ്ബോർഡ്',
        symptomChecker: 'ലക്ഷണ പരിശോധകൻ',
        reports: 'പ്രാദേശിക റിപ്പോർട്ടുകൾ',
        profile: 'പ്രൊഫൈൽ',
        languageSettings: 'ഭാഷാ ക്രമീകരണങ്ങൾ',
        logout: 'ലോഗ് ഔട്ട്',
        welcome: 'സ്വാഗതം',
        checkSymptomsPrompt: 'സുഖമില്ലേ? നിങ്ങളുടെ ലക്ഷണങ്ങൾ ഇപ്പോൾ പരിശോധിക്കുക.',
        getStarted: 'തുടങ്ങുക',
        casesLast30Days: 'കഴിഞ്ഞ 30 ദിവസത്തെ കേസുകൾ',
        precautions: 'മുൻകരുതലുകൾ',
        medicationSuggester: 'മരുന്ന് നിർദ്ദേശകൻ',
        healthReminders: 'ആരോഗ്യ ഓർമ്മപ്പെടുത്തലുകൾ',
        reminders: 'ഓർമ്മപ്പെടുത്തലുകൾ',
        medicineChecker: 'മരുന്ന് പരിശോധകൻ',
        waterQuality: 'വെള്ളത്തിന്റെ ഗുണനിലവാരം',
        aiChat: 'AI ചാറ്റ്',
        emergencyContacts: 'അടിയന്തര കോൺടാക്റ്റുകൾ',
        viewReports: 'റിപ്പോർട്ടുകൾ കാണുക'
    };
    translations.mr = {
        dashboard: 'डॅशबोर्ड',
        symptomChecker: 'लक्षण तपासक',
        reports: 'स्थानिक अहवाल',
        profile: 'प्रोफाइल',
        languageSettings: 'भाषा सेटिंग्ज',
        logout: 'लॉग आउट',
        welcome: 'स्वागत आहे',
        checkSymptomsPrompt: 'बरे वाटत नाहीये? आता तुमची लक्षणे तपासा.',
        getStarted: 'सुरु',
        casesLast30Days: 'गेल्या 30 दिवसांतील प्रकरणे',
        precautions: 'काळजी',
        medicationSuggester: 'औषध సూచక',
        healthReminders: 'आरोग्य स्मरणपत्रे',
        reminders: 'स्मरणपत्रे',
        medicineChecker: 'औषध तपासक',
        waterQuality: 'पाण्याची गुणवत्ता',
        aiChat: 'AI चॅट',
        emergencyContacts: 'आपत्कालीन संपर्क',
        viewReports: 'अहवाल पहा'
    };
    translations.pa = {
        dashboard: 'ਡੈਸ਼ਬੋਰਡ',
        symptomChecker: 'ਲੱਛਣ ਜਾਂਚਕਰਤਾ',
        reports: 'ਸਥਾਨਕ ਰਿਪੋਰਟਾਂ',
        profile: 'ਪ੍ਰੋਫਾਈਲ',
        languageSettings: 'ਭਾਸ਼ਾ ਸੈਟਿੰਗਾਂ',
        logout: 'ਲਾਗ ਆਉਟ',
        welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
        checkSymptomsPrompt: 'ਬਿਮਾਰ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ? ਹੁਣੇ ਆਪਣੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।',
        getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
        casesLast30Days: 'ਪਿਛਲੇ 30 ਦਿਨਾਂ ਵਿੱਚ ਕੇਸ',
        precautions: 'ਸਾਵਧਾਨੀਆਂ',
        medicationSuggester: 'ਦਵਾਈ ਸੁਝਾਉਣ ਵਾਲਾ',
        healthReminders: 'ਸਿਹਤ ਰੀਮਾਈਂਡਰ',
        reminders: 'ਰੀਮਾਈਂਡਰ',
        medicineChecker: 'ਦਵਾਈ ਜਾਂਚਕਰਤਾ',
        waterQuality: 'ਪਾਣੀ ਦੀ ਗੁਣਵੱਤਾ',
        aiChat: 'ਏਆਈ ਚੈਟ',
        emergencyContacts: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
        viewReports: 'ਰਿਪੋਰਟਾਂ ਵੇਖੋ'
    };
    translations.ur = {
        dashboard: 'ڈیش بورڈ',
        symptomChecker: 'علامت چیکر',
        reports: 'مقامی رپورٹس',
        profile: 'پروفائل',
        languageSettings: 'زبان کی ترتیبات',
        logout: 'لاگ آوٹ',
        welcome: 'خوش آمدید',
        checkSymptomsPrompt: 'بیمار محسوس کر رہے ہیں؟ اب اپنی علامات چیک کریں۔',
        getStarted: 'شروع کریں',
        casesLast30Days: 'گزشتہ 30 دنوں میں کیسز',
        precautions: 'احتیاطی تدابیر',
        medicationSuggester: 'دوا تجویز کرنے والا',
        healthReminders: 'صحت کی یاد دہانیاں',
        reminders: 'یاد دہانیاں',
        medicineChecker: 'دوا چیکر',
        waterQuality: 'پانی کا معیار',
        aiChat: 'اے آئی چیٹ',
        emergencyContacts: 'ہنگامی رابطے',
        viewReports: 'رپورٹس دیکھیں'
    };
    return translations;
};
const translations = generateTranslations();
}}),
"[project]/src/contexts/language-provider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LanguageContext": (()=>LanguageContext),
    "LanguageProvider": (()=>LanguageProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/translations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const LanguageProvider = ({ children })=>{
    const [language, setLanguageState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [effectiveLanguage, setEffectiveLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('en');
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"][storedLanguage]) {
            setLanguageState(storedLanguage);
        } else {
            setLanguageState(null);
        }
        setIsMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (language && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"][language]) {
            setEffectiveLanguage(language);
        } else {
            setEffectiveLanguage('en');
        }
    }, [
        language
    ]);
    const setLanguage = (lang)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"][lang]) {
            localStorage.setItem('language', lang);
            setLanguageState(lang);
        }
    };
    const t = (key)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"][effectiveLanguage]?.[key] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["translations"].en[key] || String(key);
    };
    if (!isMounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            setLanguage,
            t,
            effectiveLanguage
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/language-provider.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
};
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__1d27e091._.js.map