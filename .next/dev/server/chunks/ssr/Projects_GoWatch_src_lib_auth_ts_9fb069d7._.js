module.exports = [
"[project]/Projects/GoWatch/src/lib/auth.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "createOrGetUser",
    ()=>createOrGetUser,
    "deleteAccount",
    ()=>deleteAccount,
    "login",
    ()=>login,
    "removeAvatar",
    ()=>removeAvatar,
    "signup",
    ()=>signup,
    "updateProfile",
    ()=>updateProfile,
    "uploadAvatar",
    ()=>uploadAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Projects/GoWatch/src/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function signup(username, password) {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].post('/auth/signup', {
        username,
        password
    });
    const { user, token } = res.data;
    if (token) {
        try {
            localStorage.setItem('gowatch_token', token);
        } catch  {}
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(token);
    }
    return user;
}
async function login(username, password) {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].post('/auth/login', {
        username,
        password
    });
    const { user, token } = res.data;
    if (token) {
        try {
            localStorage.setItem('gowatch_token', token);
        } catch  {}
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(token);
    }
    return user;
}
async function createOrGetUser(username) {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].post('/users', {
        username
    });
    return res.data.user;
}
async function updateProfile(payload) {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].put('/user', payload);
    return res.data.user;
}
async function uploadAvatar(file) {
    const form = new FormData();
    form.append('avatar', file);
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].post('/user/avatar', form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data.user;
}
async function removeAvatar() {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].delete('/user/avatar');
    return res.data.user;
}
async function deleteAccount() {
    await __TURBOPACK__imported__module__$5b$project$5d2f$Projects$2f$GoWatch$2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["api"].delete('/user');
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=Projects_GoWatch_src_lib_auth_ts_9fb069d7._.js.map