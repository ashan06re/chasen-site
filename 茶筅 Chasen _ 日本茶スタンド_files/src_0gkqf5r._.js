(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const storesJa = [
    {
        label: "Chasen 高台寺店",
        href: "/stores/kyoto",
        area: "Kyoto"
    },
    {
        label: "Chasen 熊本店",
        href: "/stores/kumamoto",
        area: "Kumamoto"
    }
];
const storesEn = [
    {
        label: "Chasen Kodaiji",
        href: "/stores/kyoto",
        area: "Kyoto"
    },
    {
        label: "Chasen Kumamoto",
        href: "/stores/kumamoto",
        area: "Kumamoto"
    }
];
const nav = {
    ja: {
        brand: "ブランド",
        stores: "店舗",
        news: "お知らせ",
        contact: "お問い合わせ"
    },
    en: {
        brand: "Brand",
        stores: "Stores",
        news: "News",
        contact: "Contact"
    }
};
function Header({ initialDark = false }) {
    _s();
    const { lang, setLang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialDark);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [storeOpen, setStoreOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const t = nav[lang];
    const stores = lang === "en" ? storesEn : storesJa;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            if (initialDark) return;
            const handleScroll = {
                "Header.useEffect.handleScroll": ()=>setScrolled(window.scrollY > 60)
            }["Header.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll, {
                passive: true
            });
            return ({
                "Header.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], [
        initialDark
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const handleClick = {
                "Header.useEffect.handleClick": (e)=>{
                    if (storeRef.current && !storeRef.current.contains(e.target)) {
                        setStoreOpen(false);
                    }
                }
            }["Header.useEffect.handleClick"];
            document.addEventListener("mousedown", handleClick);
            return ({
                "Header.useEffect": ()=>document.removeEventListener("mousedown", handleClick)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#1A1A18]/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-3 hover:opacity-80 transition-opacity",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-full overflow-hidden bg-white ring-1 ring-white/30 flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/logo.jpg",
                                    alt: "Chasen logo",
                                    width: 36,
                                    height: 36,
                                    className: "object-cover w-full h-full scale-110",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-[var(--font-cormorant)] text-[#F7F5F0] text-xl tracking-[0.3em] font-light",
                                children: "Chasen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden md:flex items-center gap-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/#brand",
                                className: "text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]",
                                children: t.brand
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: storeRef,
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setStoreOpen((o)=>!o),
                                        className: "flex items-center gap-1.5 text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]",
                                        children: [
                                            t.stores,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: `w-2.5 h-2.5 transition-transform duration-300 ${storeOpen ? "rotate-180" : ""}`,
                                                fill: "none",
                                                viewBox: "0 0 10 6",
                                                stroke: "currentColor",
                                                strokeWidth: 1.8,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    d: "M1 1l4 4 4-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Header.tsx",
                                                lineNumber: 94,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 transition-all duration-300 ease-out ${storeOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative bg-[#1A1A18] border border-[#B8A882]/25 min-w-[248px] shadow-[0_20px_56px_rgba(0,0,0,0.55)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#1A1A18] rotate-45 border-t border-l border-[#B8A882]/25"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-gradient-to-r from-transparent via-[#B8A882]/55 to-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 17
                                                }, this),
                                                stores.map((store)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: store.href,
                                                        className: "group relative flex flex-col px-7 py-[18px] border-b border-[#F7F5F0]/5 last:border-0 overflow-hidden",
                                                        onClick: ()=>setStoreOpen(false),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-0 top-0 bottom-0 w-[2px] bg-[#3D6B35] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Header.tsx",
                                                                lineNumber: 123,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-[var(--font-cormorant)] text-[#B8A882]/55 group-hover:text-[#B8A882] text-[10px] tracking-[0.6em] uppercase mb-1.5 transition-colors duration-200",
                                                                children: store.area
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Header.tsx",
                                                                lineNumber: 124,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-[var(--font-cormorant)] text-[#F7F5F0]/65 group-hover:text-[#F7F5F0] text-[13px] tracking-[0.15em] transition-colors duration-200",
                                                                children: store.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/Header.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, store.href, true, {
                                                        fileName: "[project]/src/components/Header.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 19
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-gradient-to-r from-transparent via-[#B8A882]/20 to-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/news",
                                className: "text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]",
                                children: t.news
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/#contact",
                                className: "text-[#F7F5F0]/75 hover:text-[#F7F5F0] text-sm tracking-[0.15em] transition-colors font-[var(--font-cormorant)]",
                                children: t.contact
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-1 text-[#F7F5F0]/60 text-xs tracking-widest font-[var(--font-cormorant)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setLang("ja"),
                                className: `transition-colors px-1 ${lang === "ja" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`,
                                children: "JP"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "/"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setLang("en"),
                                className: `transition-colors px-1 ${lang === "en" ? "text-[#F7F5F0]" : "hover:text-[#F7F5F0]"}`,
                                children: "EN"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "md:hidden text-[#F7F5F0] flex flex-col gap-1.5 p-2",
                        onClick: ()=>setMenuOpen(!menuOpen),
                        "aria-label": "メニュー",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"} bg-[#1A1A18]/98`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "px-6 py-6 flex flex-col gap-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/#brand",
                            className: "text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]",
                            onClick: ()=>setMenuOpen(false),
                            children: t.brand
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)] mb-3",
                                    children: t.stores
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pl-4 flex flex-col gap-3 border-l border-[#F7F5F0]/10",
                                    children: stores.map((store)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: store.href,
                                            className: "text-[#F7F5F0]/55 text-sm tracking-wider font-[var(--font-cormorant)] hover:text-[#F7F5F0] transition-colors",
                                            onClick: ()=>setMenuOpen(false),
                                            children: store.label
                                        }, store.href, false, {
                                            fileName: "[project]/src/components/Header.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/news",
                            className: "text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]",
                            onClick: ()=>setMenuOpen(false),
                            children: t.news
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/#contact",
                            className: "text-[#F7F5F0]/80 text-lg tracking-widest font-[var(--font-noto-serif-jp)]",
                            onClick: ()=>setMenuOpen(false),
                            children: t.contact
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 pt-2 border-t border-[#F7F5F0]/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setLang("ja");
                                        setMenuOpen(false);
                                    },
                                    className: `font-[var(--font-cormorant)] text-sm tracking-widest transition-colors ${lang === "ja" ? "text-[#F7F5F0]" : "text-[#F7F5F0]/40 hover:text-[#F7F5F0]"}`,
                                    children: "JP"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#F7F5F0]/30",
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setLang("en");
                                        setMenuOpen(false);
                                    },
                                    className: `font-[var(--font-cormorant)] text-sm tracking-widest transition-colors ${lang === "en" ? "text-[#F7F5F0]" : "text-[#F7F5F0]/40 hover:text-[#F7F5F0]"}`,
                                    children: "EN"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(Header, "nrncWN4F2H9/Xd6umspkjZOphmQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/storeContent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ===================================================
 *  茶筅 Chasen — 店舗コンテンツ 一元管理ファイル
 * ===================================================
 *
 * ホームページのメニューカード・各店舗ページのニュースは
 * すべてここを編集するだけで反映されます。
 *
 * ▼ 編集方法
 *   - メニューカードを追加/変更 → 各店舗の `menuCards` を編集
 *   - ニュース・お知らせを追加/変更 → 各店舗の `news` を編集
 *   - 店舗情報を変更 → 各店舗の `info` を編集
 *
 * 将来的に Notion CMS と連携する場合は、このファイルの
 * データを Notion API のレスポンスに差し替えるだけで対応できます。
 * ===================================================
 */ // ────────────────────────────────────────────────────
// 型定義
// ────────────────────────────────────────────────────
__turbopack_context__.s([
    "allStores",
    ()=>allStores,
    "brandNewsFallback",
    ()=>brandNewsFallback,
    "defaultBrandStory",
    ()=>defaultBrandStory,
    "defaultBrandStoryEn",
    ()=>defaultBrandStoryEn,
    "defaultSiteSettings",
    ()=>defaultSiteSettings,
    "defaultSiteSettingsEn",
    ()=>defaultSiteSettingsEn,
    "defaultYoshidaFeatures",
    ()=>defaultYoshidaFeatures,
    "defaultYoshidaFeaturesEn",
    ()=>defaultYoshidaFeaturesEn,
    "defaultYoshidaSettings",
    ()=>defaultYoshidaSettings,
    "defaultYoshidaSettingsEn",
    ()=>defaultYoshidaSettingsEn,
    "storeContent",
    ()=>storeContent
]);
const defaultSiteSettings = {
    heroEnglishLabel: "Japanese Tea Stand",
    heroCatchphrase: "日本の茶文化を、現代の日常へ。",
    footerTagline: "日本茶スタンド",
    contactDescription: "ご来店のご予約や、各種お問い合わせはこちらから。\n担当者が確認の上、メールにてご返信いたします。",
    contactReservationUrl: "#",
    contactEmail: "chasen.ky01@gmail.com"
};
const defaultSiteSettingsEn = {
    heroEnglishLabel: "Japanese Tea Stand",
    heroCatchphrase: "Bringing Japanese tea culture into modern everyday life.",
    footerTagline: "Japanese Tea Stand",
    contactDescription: "For reservations and general inquiries, please use the links below.\nWe will respond by email as soon as possible.",
    contactReservationUrl: "#",
    contactEmail: "chasen.ky01@gmail.com"
};
const defaultBrandStory = {
    catchphrase: "一杯の茶が、",
    catchphraseHighlight: "日常を変える。",
    body1: "茶筅（Chasen）は、日本茶の持つ豊かな香りと味わいを、もっと気軽に、もっと日常に取り入れてほしいという想いから生まれた日本茶スタンドです。",
    body2: "厳選した産地の茶葉を丁寧に仕入れ、一杯一杯を心を込めて仕上げます。京都・熊本の二店舗から、茶の文化を現代の暮らしへとつなぎます。",
    body3: "茶筅という名前には、「一杯の茶の価値を見直してほしい」という願いが込められています。"
};
const defaultBrandStoryEn = {
    catchphrase: "A single cup",
    catchphraseHighlight: "changes your day.",
    body1: "Chasen is a Japanese tea stand born from a simple desire — to make the rich flavors and aromas of Japanese tea more accessible and woven into everyday life.",
    body2: "We carefully source tea leaves from select producers and craft each cup with care. From our two locations in Kyoto and Kumamoto, we connect the culture of tea to modern living.",
    body3: "The name 'Chasen' carries a wish: that you pause and rediscover the quiet value of a single, well-made cup of tea."
};
const defaultYoshidaSettings = {
    label: "Our Tea Partner",
    nameJa: "吉田\n銘茶\n園",
    nameEn: "Yoshida Meichaen",
    intro: "茶葉のほとんどを、信頼できる生産者・吉田銘茶園から仕入れています。" + "土地と向き合い続ける農家と、職人の手仕事が融合した茶葉だけを選び抜き、" + "茶筅の一杯に込めています。産地への敬意が、味わいに宿ります。"
};
const defaultYoshidaSettingsEn = {
    label: "Our Tea Partner",
    nameJa: "吉田\n銘茶\n園",
    nameEn: "Yoshida Meichaen",
    intro: "We source most of our tea leaves from a trusted partner — Yoshida Meichaen. " + "We select only the finest leaves, born from the union of farmers who live and breathe the land " + "and artisans who bring generations of craft to every harvest. " + "Respect for the origin lives in every sip."
};
const defaultYoshidaFeatures = [
    {
        icon: "01",
        name: "土地への敬意",
        description: "自然の恵みを最大限に引き出す農法で、茶畑の土から丁寧に向き合い続ける吉田銘茶園の姿勢が、豊かな風味を生み出します。"
    },
    {
        icon: "02",
        name: "職人の技",
        description: "代々受け継がれてきた茶づくりの知恵と、現代の技術を融合させた独自の製法が、吉田銘茶園の茶葉に深みと個性をもたらします。"
    },
    {
        icon: "03",
        name: "厳選の茶葉",
        description: "収穫の時期・天候・葉の状態を見極め、最上の状態でのみ摘まれた茶葉だけを仕入れ、茶筅の一杯に使用しています。"
    }
];
const defaultYoshidaFeaturesEn = [
    {
        icon: "01",
        name: "Respect for the Land",
        description: "Yoshida Meichaen's commitment to farming in harmony with nature — tending the soil of their tea fields with care — is what gives their leaves such a rich, expressive flavor."
    },
    {
        icon: "02",
        name: "Artisan Craft",
        description: "A unique process that blends wisdom passed down through generations with modern technique, giving Yoshida Meichaen's leaves their distinctive depth and character."
    },
    {
        icon: "03",
        name: "Curated Leaves",
        description: "Only leaves harvested at their peak — judged by season, weather, and condition — are selected for use in every cup at Chasen."
    }
];
// ────────────────────────────────────────────────────
// 京都 高台寺店
// ────────────────────────────────────────────────────
const kyoto = {
    info: {
        slug: "kyoto",
        name: "Chasen 高台寺店",
        nameJa: "茶筅 高台寺",
        nameEn: "Chasen Kodaiji",
        area: "Kyoto",
        address: "京都府京都市東山区（詳細住所準備中）",
        hours: "11:00 — 21:00",
        closed: "不定休",
        closedEn: "Irregular",
        access: "京阪「祇園四条」駅より徒歩約15分",
        accessEn: "Approx. 15 min walk from Keihan 'Gion-Shijo' Station",
        description: "京都・高台寺のほど近く、石畳の路地に佇む日本茶スタンド。歴史ある街並みに溶け込みながら、訪れた方に一杯の茶でほっとしてほしいという想いで営業しています。厳選した産地の茶葉を、一杯一杯丁寧に仕上げます。",
        descriptionEn: "A Japanese tea stand nestled in a cobblestone alley near Kodaiji Temple in Kyoto. Blending quietly into the historic streetscape, we welcome every visitor with a carefully crafted cup made from select tea leaves.",
        accentColor: "#2A4D25"
    },
    // ▼ ここを編集 → ホームページのメニューカードに即反映
    menuCards: [
        {
            category: "季節のおすすめ",
            categoryEn: "Seasonal Pick",
            title: "抹茶オーレ",
            titleEn: "Matcha Au Lait",
            description: "濃厚な宇治抹茶をベースに、なめらかなミルクを合わせた一杯。",
            descriptionEn: "Rich Uji matcha paired with smooth, creamy milk.",
            price: "¥ 650",
            accent: "#3D6B35",
            bg: "#E8F0E4"
        },
        {
            category: "人気メニュー",
            categoryEn: "Popular",
            title: "煎茶ソーダ",
            titleEn: "Sencha Soda",
            description: "清々しい煎茶の旨みを炭酸水で引き立てた、夏らしい一杯。",
            descriptionEn: "Bright sencha flavor lifted by sparkling water — a perfect summer drink.",
            price: "¥ 600",
            accent: "#2A4D25",
            bg: "#F0F5ED"
        },
        {
            category: "限定品",
            categoryEn: "Limited",
            title: "和三盆ラテ",
            titleEn: "Wasanbon Latte",
            description: "希少な和三盆糖を使った、上品な甘みのラテ。",
            descriptionEn: "A refined latte sweetened with rare wasanbon sugar.",
            price: "¥ 750",
            accent: "#B8A882",
            bg: "#F5F0E8"
        },
        {
            category: "お知らせ",
            categoryEn: "News",
            title: "テイクアウト開始",
            titleEn: "Takeout Now Available",
            description: "2024年より一部メニューのテイクアウトを開始しました。散策のお供にどうぞ。",
            descriptionEn: "Select menu items are now available for takeout. Perfect to enjoy on a stroll.",
            accent: "#6B6B5E",
            bg: "#F7F5F0"
        },
        {
            category: "仕入れ情報",
            categoryEn: "Sourcing",
            title: "吉田銘茶園より",
            titleEn: "From Yoshida Meichaen",
            description: "今期の新茶が入荷しました。爽やかな若草の香りをお楽しみください。",
            descriptionEn: "This season's first-flush tea has arrived. Enjoy the fresh, vibrant aroma of young leaves.",
            accent: "#3D6B35",
            bg: "#EDF2EB"
        }
    ],
    // ▼ ここを編集 → /stores/kyoto/menu の全メニューページに即反映
    fullMenu: [
        {
            id: "drink",
            label: "ドリンク",
            labelEn: "Drink",
            accent: "#3D6B35",
            items: [
                {
                    name: "宇治抹茶ラテ",
                    nameEn: "Uji Matcha Latte",
                    description: "京都宇治産の濃厚な石臼挽き抹茶と、なめらかなミルクを合わせた定番の一杯。",
                    descriptionEn: "A signature cup of stone-ground matcha from Uji, Kyoto, paired with smooth milk.",
                    price: "¥ 680",
                    note: "hot / ice",
                    noteEn: "hot / ice"
                },
                {
                    name: "煎茶ソーダ",
                    nameEn: "Sencha Soda",
                    description: "清々しい煎茶の旨みを炭酸水で引き立てた、爽快な夏の一杯。",
                    descriptionEn: "The bright, clean flavor of sencha lifted by sparkling water — a refreshing summer treat.",
                    price: "¥ 620",
                    note: "ice",
                    noteEn: "ice"
                },
                {
                    name: "和三盆ラテ",
                    nameEn: "Wasanbon Latte",
                    description: "希少な和三盆糖の上品な甘みと、なめらかなミルクが溶け合うラテ。",
                    descriptionEn: "A refined latte where rare wasanbon sugar and silky milk come together.",
                    price: "¥ 750",
                    note: "hot / ice",
                    noteEn: "hot / ice"
                },
                {
                    name: "ほうじ茶オーレ",
                    nameEn: "Hojicha Au Lait",
                    description: "香ばしく焙じた茶葉をたっぷり使った、温かみのある一杯。",
                    descriptionEn: "A warm, toasty cup made with generous hojicha leaves.",
                    price: "¥ 650",
                    note: "hot / ice",
                    noteEn: "hot / ice"
                },
                {
                    name: "玉露 水出し",
                    nameEn: "Cold-Brew Gyokuro",
                    description: "高貴な旨みを持つ玉露を、低温でゆっくり抽出したまろやかな一杯。",
                    descriptionEn: "Noble gyokuro slowly cold-brewed for a mellow, umami-rich cup.",
                    price: "¥ 700",
                    note: "ice",
                    noteEn: "ice"
                },
                {
                    name: "抹茶フラッペ",
                    nameEn: "Matcha Frappé",
                    description: "濃い抹茶ベースにソフトクリームをのせた、贅沢な夏季限定ドリンク。",
                    descriptionEn: "An indulgent summer-limited drink — rich matcha base topped with soft-serve ice cream.",
                    price: "¥ 780",
                    note: "夏季限定",
                    noteEn: "Summer only"
                }
            ]
        },
        {
            id: "sweets",
            label: "スイーツ",
            labelEn: "Sweets",
            accent: "#B8A882",
            items: [
                {
                    name: "抹茶わらびもち",
                    nameEn: "Matcha Warabimochi",
                    description: "もちもちのわらびもちに、抹茶きな粉と黒蜜をたっぷりかけて。",
                    descriptionEn: "Chewy warabimochi topped generously with matcha kinako and black sugar syrup.",
                    price: "¥ 480"
                },
                {
                    name: "和三盆プリン",
                    nameEn: "Wasanbon Pudding",
                    description: "希少な和三盆糖を使った、滑らかで上品な甘みのプリン。黒蜜添え。",
                    descriptionEn: "A silky, elegantly sweet pudding made with rare wasanbon sugar. Served with black sugar syrup.",
                    price: "¥ 520"
                },
                {
                    name: "抹茶どら焼き",
                    nameEn: "Matcha Dorayaki",
                    description: "自家製抹茶餡をたっぷり挟んだ、一枚焼きのどら焼き。",
                    descriptionEn: "A single-baked dorayaki filled with generous house-made matcha bean paste.",
                    price: "¥ 380"
                },
                {
                    name: "上生菓子（日替わり）",
                    nameEn: "Premium Wagashi (Daily)",
                    description: "職人が手がける季節の上生菓子。お茶との相性抜群です。",
                    descriptionEn: "Seasonal wagashi crafted by our artisan. A perfect match with any tea.",
                    price: "¥ 450",
                    note: "内容は日によって異なります",
                    noteEn: "Selection changes daily"
                }
            ]
        },
        {
            id: "food",
            label: "フードメニュー",
            labelEn: "À la carte",
            accent: "#6B6B5E",
            items: [
                {
                    name: "茶葉のおにぎり",
                    nameEn: "Tea Leaf Onigiri",
                    description: "煎茶塩を使ったシンプルなおにぎり。2個セット。",
                    descriptionEn: "Simple onigiri seasoned with sencha salt. Set of two.",
                    price: "¥ 380"
                },
                {
                    name: "抹茶バターサンド",
                    nameEn: "Matcha Butter Sand",
                    description: "宇治抹茶のバタークリームを、厚みのあるサクサクのクッキーで挟みました。",
                    descriptionEn: "Uji matcha buttercream sandwiched between thick, crisp cookies.",
                    price: "¥ 420"
                },
                {
                    name: "茶粥",
                    nameEn: "Sencha Porridge",
                    description: "煎茶で炊いた、ほっこり優しい一品。梅干し・香の物添え。",
                    descriptionEn: "A comforting rice porridge cooked in sencha. Served with pickled plum and seasonal pickles.",
                    price: "¥ 680"
                }
            ]
        },
        {
            id: "set",
            label: "セット",
            labelEn: "Set",
            accent: "#B8A882",
            items: [
                {
                    name: "一服セット",
                    nameEn: "Ippuku Set",
                    description: "お好みのドリンク1杯と、当日の和菓子1点のセット。ゆったりとした一服にどうぞ。",
                    descriptionEn: "One drink of your choice paired with the day's wagashi. A moment of quiet calm.",
                    price: "¥ 980",
                    note: "ドリンク + 和菓子",
                    noteEn: "Drink + Wagashi"
                },
                {
                    name: "ペアセット",
                    nameEn: "Pair Set",
                    description: "二人でゆっくり楽しむおすすめセット。ドリンク2杯とスイーツ2点。",
                    descriptionEn: "Our recommended set for two — two drinks and two sweets.",
                    price: "¥ 1,980",
                    note: "ドリンク×2 + スイーツ×2",
                    noteEn: "Drink ×2 + Sweets ×2"
                },
                {
                    name: "茶筅体験セット",
                    nameEn: "Chasen Experience Set",
                    description: "抹茶を点てる体験（体験料含む）とお干菓子のセット。初めての方も歓迎。",
                    descriptionEn: "A hands-on matcha whisking experience (fee included) with dry sweets. First-timers welcome.",
                    price: "¥ 1,500",
                    note: "体験料込み・要予約",
                    noteEn: "Includes experience fee · Reservation required"
                }
            ]
        }
    ],
    // ▼ ここを編集 → 高台寺店ページの「今月のお知らせ」に即反映
    news: [
        {
            badge: "今月のおすすめ",
            badgeEn: "This Month's Pick",
            badgeColor: "#3D6B35",
            title: "新茶フェア 開催中",
            titleEn: "First-Flush Tea Fair — Now On",
            body: "吉田銘茶園から届いた今年の新茶を使った限定メニューを提供中。爽やかな若葉の香りと、すっきりとした後味をお楽しみください。数量限定のため、お早めにどうぞ。",
            bodyEn: "We're serving a limited menu made with this season's first-flush tea from Yoshida Meichaen. Enjoy the fresh, vibrant aroma of young leaves. While supplies last.",
            date: "2026.06"
        },
        {
            badge: "キャンペーン",
            badgeEn: "Campaign",
            badgeColor: "#B8A882",
            title: "ペア来店でドリンク1杯サービス",
            titleEn: "Free Drink for Pairs",
            body: "6月中、お二人でご来店いただくと、おすすめドリンクを1杯プレゼント。大切な人と、ゆっくりとした時間をどうぞ。（1組1回限り）",
            bodyEn: "Throughout June, any pair of guests receives a complimentary recommended drink. Enjoy a leisurely moment together. (One per group.)",
            date: "2026.06"
        },
        {
            badge: "お知らせ",
            badgeEn: "Notice",
            badgeColor: "#6B6B5E",
            title: "夏季テイクアウトカップ変更",
            titleEn: "New Summer Takeout Cups",
            body: "7月よりテイクアウト用カップをリニューアルします。サステナブルな素材を使用した新カップで、お散歩のお供にぜひご利用ください。",
            bodyEn: "From July, we'll be switching to new takeout cups made from sustainable materials. A great companion for your walks.",
            date: "2026.06"
        },
        {
            badge: "イベント",
            badgeEn: "Event",
            badgeColor: "#8B5E3C",
            title: "茶筅体験ワークショップ（7月開催予定）",
            titleEn: "Chasen Workshop (Planned for July)",
            body: "お茶を点てる道具「茶筅」の使い方を体験できるワークショップを7月に開催予定です。初めての方も歓迎。詳細は近日公開。",
            bodyEn: "A workshop where you can experience using the chasen whisk to make matcha. Beginners welcome. Details coming soon.",
            date: "2026.06"
        }
    ]
};
// ────────────────────────────────────────────────────
// 熊本店
// ────────────────────────────────────────────────────
const kumamoto = {
    info: {
        slug: "kumamoto",
        name: "Chasen 熊本店",
        nameJa: "茶筅 熊本",
        nameEn: "Chasen Kumamoto",
        area: "Kumamoto",
        address: "熊本県熊本市中央区桜町（詳細住所準備中）",
        hours: "11:00 — 21:00",
        closed: "不定休",
        closedEn: "Irregular",
        access: "熊本市電「花畑町」停留場より徒歩約5分",
        accessEn: "Approx. 5 min walk from Kumamoto City Tram 'Hanabata-machi' Stop",
        description: "熊本桜町の賑わいの中に生まれた、日本茶の新しい楽しみ方を提案するスタンドです。熊本の豊かな自然が育てた茶葉を、現代的なスタイルでお届けします。地元の方にも、旅の途中の方にも、気軽に立ち寄っていただける場所を目指しています。",
        descriptionEn: "A tea stand in the heart of Sakuramachi, Kumamoto, offering a fresh take on Japanese tea. We bring the finest leaves grown in Kumamoto's rich natural environment, served in a modern style. Whether you're a local or just passing through, you're always welcome to stop in.",
        accentColor: "#1A1A18"
    },
    // ▼ ここを編集 → ホームページのメニューカードに即反映
    menuCards: [
        {
            category: "季節のおすすめ",
            categoryEn: "Seasonal Pick",
            title: "ほうじ茶ラテ",
            titleEn: "Hojicha Latte",
            description: "深く焙じた香ばしさと、甘いミルクが溶け合う定番の一杯。",
            descriptionEn: "The deep, roasted aroma of hojicha meets sweet, creamy milk.",
            price: "¥ 600",
            accent: "#8B5E3C",
            bg: "#F5EEE6"
        },
        {
            category: "人気メニュー",
            categoryEn: "Popular",
            title: "玉露フィズ",
            titleEn: "Gyokuro Fizz",
            description: "上質な玉露の旨みを、スパークリングウォーターで爽やかに。",
            descriptionEn: "The rich umami of premium gyokuro, brightened with sparkling water.",
            price: "¥ 700",
            accent: "#3D6B35",
            bg: "#E8F0E4"
        },
        {
            category: "新メニュー",
            categoryEn: "New",
            title: "抹茶あずきラテ",
            titleEn: "Matcha Azuki Latte",
            description: "北海道産あずきと宇治抹茶の組み合わせ。和のデザート感覚で。",
            descriptionEn: "Uji matcha meets Hokkaido red bean — a dessert in a glass.",
            price: "¥ 780",
            accent: "#2A4D25",
            bg: "#F0F5ED"
        },
        {
            category: "お知らせ",
            categoryEn: "News",
            title: "土日限定スイーツ",
            titleEn: "Weekend Sweets",
            description: "週末限定で和スイーツセットを提供中。数量限定のためお早めに。",
            descriptionEn: "A Japanese sweets set, available weekends only. Limited quantities — don't miss it.",
            accent: "#B8A882",
            bg: "#F5F0E8"
        },
        {
            category: "イベント",
            categoryEn: "Event",
            title: "茶道ワークショップ",
            titleEn: "Tea Ceremony Workshop",
            description: "初めての方でも楽しめる茶道体験を月1回開催中。予約はお早めに。",
            descriptionEn: "A monthly tea ceremony experience, welcoming first-timers. Book early.",
            accent: "#6B6B5E",
            bg: "#F7F5F0"
        }
    ],
    // ▼ ここを編集 → /stores/kumamoto/menu の全メニューページに即反映
    fullMenu: [
        {
            id: "drink",
            label: "ドリンク",
            labelEn: "Drink",
            accent: "#3D6B35",
            items: [
                {
                    name: "ほうじ茶ラテ",
                    nameEn: "Hojicha Latte",
                    description: "深く焙じた香ばしさと甘いミルクが溶け合う、熊本店の定番ドリンク。",
                    descriptionEn: "Kumamoto's signature drink — deep, toasty hojicha paired with sweet creamy milk.",
                    price: "¥ 650",
                    note: "hot / ice",
                    noteEn: "hot / ice"
                },
                {
                    name: "玉露フィズ",
                    nameEn: "Gyokuro Fizz",
                    description: "上質な玉露の豊かな旨みを、スパークリングウォーターで爽やかに仕上げました。",
                    descriptionEn: "Premium gyokuro's rich umami, served refreshingly over sparkling water.",
                    price: "¥ 700",
                    note: "ice",
                    noteEn: "ice"
                },
                {
                    name: "抹茶あずきラテ",
                    nameEn: "Matcha Azuki Latte",
                    description: "北海道産あずきと宇治抹茶の組み合わせ。和のデザート感覚でお楽しみください。",
                    descriptionEn: "Hokkaido red bean meets Uji matcha. Enjoy it like a Japanese dessert.",
                    price: "¥ 780",
                    note: "hot / ice",
                    noteEn: "hot / ice"
                },
                {
                    name: "水出し煎茶",
                    nameEn: "Cold-Brew Sencha",
                    description: "ゆっくり時間をかけて抽出した、まろやかで旨みたっぷりの一杯。",
                    descriptionEn: "Slowly cold-brewed for a mellow, deeply flavorful cup.",
                    price: "¥ 580",
                    note: "ice",
                    noteEn: "ice"
                },
                {
                    name: "ほうじ茶ソーダ",
                    nameEn: "Hojicha Soda",
                    description: "香ばしいほうじ茶のソーダ割り。すっきりとした飲み口が心地よい。",
                    descriptionEn: "Roasted hojicha over soda — a clean, refreshing sip.",
                    price: "¥ 620",
                    note: "ice",
                    noteEn: "ice"
                }
            ]
        },
        {
            id: "sweets",
            label: "スイーツ",
            labelEn: "Sweets",
            accent: "#B8A882",
            items: [
                {
                    name: "ほうじ茶アイスクリーム",
                    nameEn: "Hojicha Ice Cream",
                    description: "深煎りほうじ茶の香ばしさがギュッと詰まった濃厚なアイスクリーム。",
                    descriptionEn: "Dense, richly toasted hojicha packed into every scoop.",
                    price: "¥ 480"
                },
                {
                    name: "抹茶バスクチーズケーキ",
                    nameEn: "Matcha Basque Cheesecake",
                    description: "なめらかな口どけと抹茶の深みが重なる、大人のスイーツ。",
                    descriptionEn: "Silky smooth with the deep complexity of matcha — a grown-up sweet.",
                    price: "¥ 580"
                },
                {
                    name: "和三盆クレープ",
                    nameEn: "Wasanbon Crêpe",
                    description: "和三盆クリームと季節のフルーツを包んだ、上品な薄焼きクレープ。",
                    descriptionEn: "A delicate thin crêpe filled with wasanbon cream and seasonal fruit.",
                    price: "¥ 620"
                },
                {
                    name: "ほうじ茶かき氷",
                    nameEn: "Hojicha Kakigori",
                    description: "自家製ほうじ茶シロップとたっぷりのあずきで仕上げた夏の名物。",
                    descriptionEn: "A summer signature — shaved ice with house-made hojicha syrup and generous red bean.",
                    price: "¥ 880",
                    note: "夏季限定",
                    noteEn: "Summer only"
                }
            ]
        },
        {
            id: "food",
            label: "フードメニュー",
            labelEn: "À la carte",
            accent: "#6B6B5E",
            items: [
                {
                    name: "茶葉香るサンドイッチ",
                    nameEn: "Tea-Scented Sandwich",
                    description: "煎茶塩で仕上げたチキンと新鮮な野菜のサンドイッチ。軽食にどうぞ。",
                    descriptionEn: "Chicken seasoned with sencha salt and fresh vegetables — a light, satisfying meal.",
                    price: "¥ 680"
                },
                {
                    name: "抹茶チョコレート",
                    nameEn: "Matcha Chocolate",
                    description: "宇治抹茶を使った自家製チョコレート。お土産にもどうぞ（5粒入り）。",
                    descriptionEn: "House-made chocolates using Uji matcha. A great souvenir too. (5 pieces)",
                    price: "¥ 380"
                }
            ]
        },
        {
            id: "set",
            label: "セット",
            labelEn: "Set",
            accent: "#B8A882",
            items: [
                {
                    name: "くつろぎセット",
                    nameEn: "Relaxation Set",
                    description: "お好みのドリンク1杯と、当日のスイーツ1点のセット。",
                    descriptionEn: "One drink of your choice paired with the day's sweets.",
                    price: "¥ 1,020",
                    note: "ドリンク + スイーツ",
                    noteEn: "Drink + Sweets"
                },
                {
                    name: "モーニングセット",
                    nameEn: "Morning Set",
                    description: "煎茶または抹茶ラテ＋和菓子の朝のセット。ゆったりとした朝のひとときに。",
                    descriptionEn: "Sencha or matcha latte with a wagashi — a gentle way to start the morning.",
                    price: "¥ 780",
                    note: "平日 11:00〜13:00 限定",
                    noteEn: "Weekdays 11:00–13:00 only"
                },
                {
                    name: "ペアセット",
                    nameEn: "Pair Set",
                    description: "二人でゆっくり楽しむおすすめセット。ドリンク2杯とスイーツ2点。",
                    descriptionEn: "Our recommended set for two — two drinks and two sweets.",
                    price: "¥ 2,000",
                    note: "ドリンク×2 + スイーツ×2",
                    noteEn: "Drink ×2 + Sweets ×2"
                }
            ]
        }
    ],
    // ▼ ここを編集 → 熊本店ページの「今月のお知らせ」に即反映
    news: [
        {
            badge: "今月のおすすめ",
            badgeEn: "This Month's Pick",
            badgeColor: "#3D6B35",
            title: "ほうじ茶かき氷 登場",
            titleEn: "Hojicha Kakigori Is Here",
            body: "夏季限定メニューとして、深煎りほうじ茶のかき氷が登場しました。自家製の濃厚ほうじ茶シロップとたっぷりのあずきで、見た目も涼やかな一品です。",
            bodyEn: "Our seasonal summer menu is here — shaved ice drenched in our house-made deep-roast hojicha syrup and topped with generous red bean. A stunning, cooling treat.",
            date: "2026.06"
        },
        {
            badge: "キャンペーン",
            badgeEn: "Campaign",
            badgeColor: "#B8A882",
            title: "SNS投稿でドリンク割引",
            titleEn: "Post & Save on Your Next Visit",
            body: "店内でお飲みになったドリンクをInstagramに投稿いただくと、次回ご来店時に100円引きになります。ハッシュタグ #chasen熊本 をつけてご投稿ください。",
            bodyEn: "Post a photo of your drink on Instagram and receive ¥100 off your next order. Tag it with #chasen熊本.",
            date: "2026.06"
        },
        {
            badge: "お知らせ",
            badgeEn: "Notice",
            badgeColor: "#6B6B5E",
            title: "平日モーニングセット開始",
            titleEn: "Weekday Morning Set Launching in July",
            body: "7月より平日11時〜13時限定でモーニングセットを提供予定。煎茶または抹茶ラテと和菓子のセットです。ゆったりとした朝のひとときにご利用ください。",
            bodyEn: "From July, we'll be offering a morning set from 11:00–13:00 on weekdays — sencha or matcha latte paired with wagashi. A peaceful start to your morning.",
            date: "2026.06"
        },
        {
            badge: "イベント",
            badgeEn: "Event",
            badgeColor: "#8B5E3C",
            title: "熊本の茶農家さんとトークイベント",
            titleEn: "Talk Event with a Local Tea Farmer",
            body: "地元熊本で茶葉を育てる農家さんをお招きし、お茶の産地や製法についてのトークイベントを開催します。試飲つき。詳細は近日公開予定。",
            bodyEn: "We're hosting a talk by a local Kumamoto tea farmer on the origins and craft behind our tea. Tasting included. Details coming soon.",
            date: "2026.06"
        }
    ]
};
const storeContent = {
    kyoto,
    kumamoto
};
const allStores = [
    kyoto,
    kumamoto
];
const brandNewsFallback = [
    ...kyoto.news.map((n)=>({
            ...n,
            store: "高台寺店"
        })),
    ...kumamoto.news.map((n)=>({
            ...n,
            store: "熊本店"
        }))
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/HeroSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/storeContent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function HeroSection({ settings, settingsEn }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const enSettings = settingsEn ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultSiteSettingsEn"];
    const catchphrase = lang === "en" ? enSettings.heroCatchphrase : settings.heroCatchphrase;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative h-screen flex items-center justify-center overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                className: "absolute inset-0 w-full h-full object-cover",
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
                src: "/hero.mp4",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-b from-[#1A1A18]/60 via-[#1A1A18]/30 to-[#1A1A18]/70"
            }, void 0, false, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 text-center text-[#F7F5F0] px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-cormorant)] text-sm md:text-base tracking-[0.4em] text-[#B8A882] mb-6 uppercase",
                        children: settings.heroEnglishLabel
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-[var(--font-noto-serif-jp)] text-7xl md:text-9xl lg:text-[11rem] font-light tracking-[0.2em] leading-none mb-6",
                        children: "茶筅"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-cormorant)] text-2xl md:text-3xl tracking-[0.2em] text-[#F7F5F0]/80 font-light mb-12",
                        children: "Chasen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-noto-serif-jp)] text-sm md:text-base tracking-[0.15em] text-[#F7F5F0]/65 font-light",
                        children: catchphrase
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-[var(--font-cormorant)] text-[#F7F5F0]/40 text-xs tracking-[0.4em] uppercase",
                        children: "Scroll"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-14 bg-gradient-to-b from-[#F7F5F0]/40 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeroSection.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HeroSection.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HeroSection.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(HeroSection, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = HeroSection;
var _c;
__turbopack_context__.k.register(_c, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AnimateIn.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimateIn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AnimateIn({ children, className = "", delay = 0 }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimateIn.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            const observer = new IntersectionObserver({
                "AnimateIn.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        const timer = setTimeout({
                            "AnimateIn.useEffect.timer": ()=>{
                                el.classList.add("visible");
                            }
                        }["AnimateIn.useEffect.timer"], delay);
                        observer.unobserve(el);
                        return ({
                            "AnimateIn.useEffect": ()=>clearTimeout(timer)
                        })["AnimateIn.useEffect"];
                    }
                }
            }["AnimateIn.useEffect"], {
                threshold: 0.12
            });
            observer.observe(el);
            return ({
                "AnimateIn.useEffect": ()=>observer.disconnect()
            })["AnimateIn.useEffect"];
        }
    }["AnimateIn.useEffect"], [
        delay
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `fade-up ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/AnimateIn.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(AnimateIn, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = AnimateIn;
var _c;
__turbopack_context__.k.register(_c, "AnimateIn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BrandStorySection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandStorySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AnimateIn.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/storeContent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BrandStorySection({ content = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultBrandStory"], contentEn }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const c = lang === "en" ? contentEn ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultBrandStoryEn"] : content;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "brand",
        className: "bg-[#F7F5F0] py-28 md:py-40 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-16",
                        children: "Brand Story"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BrandStorySection.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/BrandStorySection.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-2 gap-16 md:gap-24 items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 100,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-[var(--font-noto-serif-jp)] text-5xl md:text-6xl lg:text-7xl font-light text-[#1A1A18] leading-tight tracking-wide",
                                        children: [
                                            c.catchphrase,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/components/BrandStorySection.tsx",
                                                lineNumber: 32,
                                                columnNumber: 32
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#3D6B35]",
                                                children: c.catchphraseHighlight
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/BrandStorySection.tsx",
                                                lineNumber: 33,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/BrandStorySection.tsx",
                                        lineNumber: 31,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-10 w-12 h-px bg-[#B8A882]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BrandStorySection.tsx",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/BrandStorySection.tsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/BrandStorySection.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 250,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light",
                                        children: c.body1
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BrandStorySection.tsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light",
                                        children: c.body2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BrandStorySection.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base md:text-lg leading-[2.2] tracking-wide font-light",
                                        children: c.body3
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BrandStorySection.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/BrandStorySection.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/BrandStorySection.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/BrandStorySection.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/BrandStorySection.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/BrandStorySection.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(BrandStorySection, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = BrandStorySection;
var _c;
__turbopack_context__.k.register(_c, "BrandStorySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/YoshidaSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>YoshidaSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AnimateIn.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/storeContent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function RoundedImage({ src, alt, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative rounded-[2rem] overflow-hidden bg-[#1A1E14] ${className}`,
        children: src && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: src,
            alt: alt,
            fill: true,
            className: "object-cover",
            sizes: "(max-width: 768px) 100vw, 50vw"
        }, void 0, false, {
            fileName: "[project]/src/components/YoshidaSection.tsx",
            lineNumber: 20,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/YoshidaSection.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = RoundedImage;
function YoshidaSection({ settings, features, settingsEn, featuresEn, images }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const s = lang === "en" ? settingsEn ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultYoshidaSettingsEn"] : settings;
    const f = lang === "en" ? featuresEn ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultYoshidaFeaturesEn"] : features;
    const { label, nameJa, nameEn, intro } = s;
    const featureImages = [
        images?.feature1,
        images?.feature2,
        images?.feature3
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "bg-[#0D1209] py-32 md:py-48 px-6 overflow-hidden relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-[-4rem] top-1/2 -translate-y-1/2 font-[var(--font-noto-serif-jp)] pointer-events-none select-none leading-none",
                style: {
                    fontSize: "clamp(20rem, 40vw, 36rem)",
                    color: "rgba(255,255,255,0.015)"
                },
                "aria-hidden": true,
                children: "茶"
            }, void 0, false, {
                fileName: "[project]/src/components/YoshidaSection.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6 mb-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.5em] uppercase",
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 h-px bg-[#1E2018]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/YoshidaSection.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/YoshidaSection.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-[5fr_7fr] gap-16 md:gap-32 items-start mb-14 md:mb-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                delay: 100,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-[var(--font-noto-serif-jp)] font-light text-white leading-[1.15] tracking-widest whitespace-pre-line",
                                            style: {
                                                fontSize: "clamp(3.5rem, 10vw, 7rem)"
                                            },
                                            children: nameJa
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 61,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-6 font-[var(--font-cormorant)] text-[#B8A882] tracking-[0.35em]",
                                            style: {
                                                fontSize: "clamp(1rem, 2vw, 1.4rem)"
                                            },
                                            children: nameEn
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/YoshidaSection.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                delay: 220,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoundedImage, {
                                            src: images?.main,
                                            alt: nameEn,
                                            className: "w-full aspect-[16/9] mb-10"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-px bg-[#3D6B35] mb-8"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-[var(--font-noto-serif-jp)] text-[#C8C2B8] text-base md:text-lg leading-[2.4] tracking-wide font-light",
                                            children: intro
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/YoshidaSection.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/YoshidaSection.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        delay: 350,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px bg-[#1A1E14] mb-14 md:mb-20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/YoshidaSection.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/YoshidaSection.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-3 gap-14 md:gap-10",
                        children: f.map((feature, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                delay: 450 + i * 130,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-4 mb-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-[var(--font-cormorant)] text-[#3D6B35] font-light leading-none flex-shrink-0",
                                                    style: {
                                                        fontSize: "clamp(3rem, 6vw, 4rem)"
                                                    },
                                                    children: feature.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoundedImage, {
                                                    src: featureImages[i],
                                                    alt: feature.name,
                                                    className: "flex-1 aspect-[16/9]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 101,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-[var(--font-noto-serif-jp)] text-white font-light tracking-wide mb-3 text-lg md:text-xl",
                                            children: feature.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-px bg-[#2E3028] mb-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-[var(--font-noto-serif-jp)] text-[#5E5E54] text-sm leading-[2.2] tracking-wide font-light",
                                            children: feature.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/YoshidaSection.tsx",
                                            lineNumber: 118,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/YoshidaSection.tsx",
                                    lineNumber: 99,
                                    columnNumber: 15
                                }, this)
                            }, i, false, {
                                fileName: "[project]/src/components/YoshidaSection.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/YoshidaSection.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/YoshidaSection.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/YoshidaSection.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(YoshidaSection, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c1 = YoshidaSection;
var _c, _c1;
__turbopack_context__.k.register(_c, "RoundedImage");
__turbopack_context__.k.register(_c1, "YoshidaSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/StoreSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AnimateIn.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const t = {
    ja: {
        taxNote: "税込",
        viewStore: "店舗詳細を見る"
    },
    en: {
        taxNote: "inc. tax",
        viewStore: "View Store Details"
    }
};
function StoreSection({ store, menuCardsEn, dark = false }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const tx = t[lang];
    const { info } = store;
    const menuCards = lang === "en" && menuCardsEn && menuCardsEn.length > 0 ? menuCardsEn : store.menuCards;
    const bgColor = dark ? "#1A1A18" : "#F7F5F0";
    const textColor = dark ? "#F7F5F0" : "#1A1A18";
    const storePath = `/stores/${info.slug}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: info.slug === "kyoto" ? "stores" : undefined,
        className: "py-24 md:py-36",
        style: {
            backgroundColor: bgColor
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 md:px-12 mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-4",
                                children: info.area
                            }, void 0, false, {
                                fileName: "[project]/src/components/StoreSection.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/StoreSection.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 100,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-end justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: storePath,
                                        className: "group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-[var(--font-cormorant)] text-4xl md:text-5xl font-light tracking-wider group-hover:opacity-70 transition-opacity",
                                            style: {
                                                color: textColor
                                            },
                                            children: lang === "en" ? info.nameEn ?? info.name : info.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/StoreSection.tsx",
                                            lineNumber: 46,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StoreSection.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-[var(--font-cormorant)] text-sm tracking-[0.2em] text-[#6B6B5E]",
                                        children: info.hours
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StoreSection.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/StoreSection.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/StoreSection.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            delay: 200,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-base leading-[2] tracking-wide font-light max-w-xl",
                                children: lang === "en" && info.descriptionEn ? info.descriptionEn : info.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/StoreSection.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/StoreSection.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/StoreSection.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 300,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 overflow-x-auto px-6 md:px-12 pb-6",
                        style: {
                            scrollbarWidth: "thin",
                            scrollbarColor: "#B8A882 transparent"
                        },
                        children: menuCards.map((card, i)=>{
                            const cardTitle = lang === "en" ? card.titleEn ?? card.title : card.title;
                            const cardCategory = lang === "en" ? card.categoryEn ?? card.category : card.category;
                            const cardDesc = lang === "en" ? card.descriptionEn ?? card.description : card.description;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "flex-shrink-0 flex flex-col border rounded-sm overflow-hidden",
                                style: {
                                    width: "calc(min(100vw - 6rem, 80rem - 6rem) / 3.6)",
                                    minWidth: "180px",
                                    backgroundColor: card.bg,
                                    borderColor: `${card.accent}20`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full aspect-[4/3] flex items-center justify-center overflow-hidden",
                                        style: {
                                            backgroundColor: `${card.accent}12`,
                                            borderBottom: `1px solid ${card.accent}20`
                                        },
                                        children: card.photoUrl ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: card.photoUrl,
                                            alt: cardTitle,
                                            className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/StoreSection.tsx",
                                            lineNumber: 96,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-[var(--font-cormorant)] text-xs tracking-[0.4em] uppercase",
                                            style: {
                                                color: `${card.accent}60`
                                            },
                                            children: "Photo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/StoreSection.tsx",
                                            lineNumber: 102,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/StoreSection.tsx",
                                        lineNumber: 87,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col flex-1 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-[var(--font-cormorant)] text-xs tracking-[0.3em] uppercase mb-1",
                                                style: {
                                                    color: card.accent,
                                                    minHeight: "1em"
                                                },
                                                children: cardCategory
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/StoreSection.tsx",
                                                lineNumber: 113,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-[var(--font-noto-serif-jp)] text-sm tracking-wider mb-2 leading-snug",
                                                style: {
                                                    color: dark ? "#F7F5F0" : "#1A1A18"
                                                },
                                                children: cardTitle
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/StoreSection.tsx",
                                                lineNumber: 120,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-[var(--font-noto-serif-jp)] text-xs leading-[1.9] tracking-wide font-light flex-1",
                                                style: {
                                                    color: "#6B6B5E"
                                                },
                                                children: cardDesc
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/StoreSection.tsx",
                                                lineNumber: 127,
                                                columnNumber: 19
                                            }, this),
                                            card.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 flex items-baseline gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-[var(--font-cormorant)] text-xl tracking-wider",
                                                        style: {
                                                            color: card.accent
                                                        },
                                                        children: card.price
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/StoreSection.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-[var(--font-noto-serif-jp)] text-[10px] tracking-wider text-[#B8A882]",
                                                        children: tx.taxNote
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/StoreSection.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/StoreSection.tsx",
                                                lineNumber: 135,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3 h-px",
                                                style: {
                                                    backgroundColor: `${card.accent}20`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/StoreSection.tsx",
                                                lineNumber: 148,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/StoreSection.tsx",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/StoreSection.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/StoreSection.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/StoreSection.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 400,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 md:px-12 mt-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: storePath,
                            className: "inline-flex items-center gap-3 font-[var(--font-cormorant)] text-sm tracking-[0.3em] uppercase text-[#B8A882] hover:opacity-60 transition-opacity",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tx.viewStore
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StoreSection.tsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-8 h-px inline-block bg-[#B8A882]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/StoreSection.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/StoreSection.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/StoreSection.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/StoreSection.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/StoreSection.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/StoreSection.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(StoreSection, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = StoreSection;
var _c;
__turbopack_context__.k.register(_c, "StoreSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ContactSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AnimateIn.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/storeContent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const t = {
    ja: {
        label: "Reservation & Contact",
        heading: [
            "ご予約・",
            "お問い合わせ"
        ],
        reserve: "ご予約はこちら",
        email: "メールで問い合わせ"
    },
    en: {
        label: "Reservation & Contact",
        heading: [
            "Reservations &",
            "Contact"
        ],
        reserve: "Make a Reservation",
        email: "Send an Email"
    }
};
function ContactSection({ settings, settingsEn, reservationUrl, reservationUrlEn }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const tx = t[lang];
    const enSettings = settingsEn ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storeContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultSiteSettingsEn"];
    const description = lang === "en" ? enSettings.contactDescription : settings.contactDescription;
    const resolvedReservationUrl = lang === "en" ? reservationUrlEn || reservationUrl || enSettings.contactReservationUrl : reservationUrl || settings.contactReservationUrl;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "contact",
        className: "bg-[#3D6B35] py-28 md:py-40 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.5em] uppercase mb-8",
                        children: tx.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ContactSection.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ContactSection.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 100,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-[var(--font-noto-serif-jp)] text-4xl md:text-5xl lg:text-6xl font-light text-[#F7F5F0] tracking-wider leading-tight mb-8",
                        children: [
                            tx.heading[0],
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                className: "md:hidden"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ContactSection.tsx",
                                lineNumber: 51,
                                columnNumber: 28
                            }, this),
                            tx.heading[1]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ContactSection.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ContactSection.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 200,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-[var(--font-noto-serif-jp)] text-[#F7F5F0]/70 text-base leading-[2.2] tracking-wide font-light max-w-lg mx-auto mb-14 whitespace-pre-line",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ContactSection.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ContactSection.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 300,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: resolvedReservationUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center gap-3 bg-[#F7F5F0] text-[#1A1A18] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.25em] px-12 py-5 hover:bg-[#E8E0D0] transition-colors w-full sm:w-auto justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#3D6B35] text-base",
                                        children: "◎"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ContactSection.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    tx.reserve
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ContactSection.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: `mailto:${settings.contactEmail}`,
                                className: "inline-flex items-center gap-3 border border-[#F7F5F0]/40 text-[#F7F5F0] font-[var(--font-noto-serif-jp)] text-sm tracking-[0.25em] px-12 py-5 hover:bg-[#F7F5F0]/10 transition-colors w-full sm:w-auto justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#B8A882] text-base",
                                        children: "✉"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ContactSection.tsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this),
                                    tx.email
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ContactSection.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ContactSection.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ContactSection.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AnimateIn$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    delay: 400,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-10 font-[var(--font-cormorant)] text-[#F7F5F0]/40 text-sm tracking-wider",
                        children: settings.contactEmail
                    }, void 0, false, {
                        fileName: "[project]/src/components/ContactSection.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ContactSection.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ContactSection.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ContactSection.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(ContactSection, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = ContactSection;
var _c;
__turbopack_context__.k.register(_c, "ContactSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/FooterContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FooterContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const INSTAGRAM_URL = "https://www.instagram.com/chasen_kyoto10f?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
function InstagramIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        }, void 0, false, {
            fileName: "[project]/src/components/FooterContent.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/FooterContent.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = InstagramIcon;
function FooterContent({ kyoto, kumamoto, kyotoEn, kumamotoEn, settings, settingsEn }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const currentYear = new Date().getFullYear();
    const currentKyoto = lang === "en" && kyotoEn ? kyotoEn : kyoto;
    const currentKumamoto = lang === "en" && kumamotoEn ? kumamotoEn : kumamoto;
    const tagline = lang === "en" ? settingsEn?.footerTagline ?? "Japanese Tea Stand" : settings.footerTagline;
    const copyright = lang === "en" ? `© ${currentYear} Chasen Co., Ltd. All rights reserved.` : `© ${currentYear} 株式会社チャセン. All rights reserved.`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-[#1A1A18] py-16 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-3 gap-12 md:gap-8 pb-12 border-b border-[#F7F5F0]/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-[var(--font-noto-serif-jp)] text-[#F7F5F0] text-3xl tracking-[0.25em] mb-1",
                                    children: "茶筅"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-[var(--font-cormorant)] text-[#B8A882] text-sm tracking-[0.3em]",
                                    children: "Chasen"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs leading-relaxed tracking-wide",
                                    children: tagline
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 flex gap-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: INSTAGRAM_URL,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        "aria-label": "Instagram",
                                        className: "flex items-center gap-2 text-[#6B6B5E] hover:text-[#B8A882] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InstagramIcon, {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/FooterContent.tsx",
                                                lineNumber: 69,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-[var(--font-cormorant)] text-sm tracking-wider",
                                                children: "Instagram"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/FooterContent.tsx",
                                                lineNumber: 70,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/FooterContent.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/FooterContent.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.4em] uppercase mb-5",
                                    children: "Stores"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/stores/kyoto",
                                                    className: "font-[var(--font-cormorant)] text-[#F7F5F0]/70 text-base tracking-wider hover:text-[#F7F5F0] transition-colors",
                                                    children: currentKyoto.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/FooterContent.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs mt-0.5",
                                                    children: [
                                                        currentKyoto.area,
                                                        " / ",
                                                        currentKyoto.hours
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/FooterContent.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/FooterContent.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/stores/kumamoto",
                                                    className: "font-[var(--font-cormorant)] text-[#F7F5F0]/70 text-base tracking-wider hover:text-[#F7F5F0] transition-colors",
                                                    children: currentKumamoto.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/FooterContent.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-[var(--font-noto-serif-jp)] text-[#6B6B5E] text-xs mt-0.5",
                                                    children: [
                                                        currentKumamoto.area,
                                                        " / ",
                                                        currentKumamoto.hours
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/FooterContent.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/FooterContent.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/FooterContent.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-[var(--font-cormorant)] text-[#B8A882] text-xs tracking-[0.4em] uppercase mb-5",
                                    children: "Contact"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `mailto:${settings.contactEmail}`,
                                    className: "font-[var(--font-cormorant)] text-[#F7F5F0]/60 text-sm tracking-wide hover:text-[#F7F5F0] transition-colors",
                                    children: settings.contactEmail
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/FooterContent.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/FooterContent.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 flex flex-col md:flex-row items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider",
                            children: copyright
                        }, void 0, false, {
                            fileName: "[project]/src/components/FooterContent.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider hover:text-[#B8A882] transition-colors",
                                    children: "Privacy Policy"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "font-[var(--font-cormorant)] text-[#6B6B5E] text-xs tracking-wider hover:text-[#B8A882] transition-colors",
                                    children: "Terms"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/FooterContent.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/FooterContent.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/FooterContent.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/FooterContent.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/FooterContent.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(FooterContent, "BpHATZRBXYqVpOgCf2HLIdSY7VA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c1 = FooterContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "InstagramIcon");
__turbopack_context__.k.register(_c1, "FooterContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/FloatingButtons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FloatingButtons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/langContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FloatingButtons({ reservationUrl, reservationUrlEn }) {
    _s();
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const url = lang === "en" ? reservationUrlEn || reservationUrl : reservationUrl;
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingButtons.useEffect": ()=>{
            const handleScroll = {
                "FloatingButtons.useEffect.handleScroll": ()=>setVisible(window.scrollY > window.innerHeight * 0.5)
            }["FloatingButtons.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll, {
                passive: true
            });
            return ({
                "FloatingButtons.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["FloatingButtons.useEffect"];
        }
    }["FloatingButtons.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed right-5 bottom-8 z-40 flex flex-col gap-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: url || "#contact",
                target: url ? "_blank" : undefined,
                rel: url ? "noopener noreferrer" : undefined,
                className: "flex flex-col items-center justify-center gap-1 bg-[#3D6B35] text-[#F7F5F0] w-14 h-14 rounded-full shadow-lg hover:bg-[#2A4D25] transition-colors",
                "aria-label": lang === "en" ? "Reservation" : "ご予約",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg leading-none",
                        children: "◎"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FloatingButtons.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-[var(--font-noto-serif-jp)] text-[0.5rem] tracking-wider leading-none",
                        children: lang === "en" ? "Book" : "予約"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FloatingButtons.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/FloatingButtons.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "mailto:chasen.ky01@gmail.com",
                className: "flex flex-col items-center justify-center gap-1 bg-[#1A1A18] text-[#F7F5F0] w-14 h-14 rounded-full shadow-lg hover:bg-[#333330] transition-colors border border-[#F7F5F0]/10",
                "aria-label": lang === "en" ? "Contact" : "お問い合わせ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg leading-none",
                        children: "✉"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FloatingButtons.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-[var(--font-noto-serif-jp)] text-[0.5rem] tracking-wider leading-none",
                        children: lang === "en" ? "Mail" : "問合せ"
                    }, void 0, false, {
                        fileName: "[project]/src/components/FloatingButtons.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/FloatingButtons.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/FloatingButtons.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(FloatingButtons, "/UpKY+ttxBlSJ/X01GmCx6ol/ag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$langContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = FloatingButtons;
var _c;
__turbopack_context__.k.register(_c, "FloatingButtons");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0gkqf5r._.js.map