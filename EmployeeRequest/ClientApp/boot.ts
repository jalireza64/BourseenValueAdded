import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { generateCustomValidity, EventType, UserType } from "./assets/utilities";
const AppMain = () => import(/* webpackPreload: true */ "./pages/main.vue");
const HomeIndex = () => import(/* webpackPrefetch: true */ "./pages/home/index.vue");

const homeAbout = () => import(/* webpackPrefetch: true */ "./pages/home/about.vue");

const AccountLogin = () => import(/* webpackPrefetch: true */ "./pages/account/login.vue");

const MeetingIndex = () => import(/* webpackPrefetch: true */ "./pages/meeting/index.vue");

const sharedReport = () => import(/* webpackPrefetch: true */ "./pages/shared/report.vue");



const AccountManagementLogin = () => import(/* webpackPrefetch: true */ "./pages/account/managementLogin.vue");
const HomeManagementIndex = () => import(/* webpackPrefetch: true */ "./pages/home/managementIndex.vue");
const MeetingManagementMeetingHolding = () => import(/* webpackPrefetch: true */ "./pages/meeting/managementMeetingHolding.vue");
const MeetingManagementMeetingVoting = () => import(/* webpackPrefetch: true */ "./pages/meeting/managementMeetingVoting.vue");
const MeetingManagementMeetingQuestions = () => import(/* webpackPrefetch: true */ "./pages/meeting/managementMeetingQuestions.vue");
const ReportRptMeetingPresence = () => import(/* webpackPrefetch: true */ "./pages/report/rptMeetingPresence.vue");
const ReportRptMeetingVote = () => import(/* webpackPrefetch: true */ "./pages/report/rptMeetingVote.vue");
const ReportRptMeetingVoteTotal = () => import(/* webpackPrefetch: true */ "./pages/report/rptMeetingVoteTotal.vue");
const ReportRptMeetingState = () => import(/* webpackPrefetch: true */ "./pages/report/rptMeetingState.vue");
const BasicInfoShrMeeting = () => import(/* webpackPrefetch: true */ "./pages/basicInfo/shrMeeting.vue");
const BasicInfoSyncFromSeasonSys = () => import(/* webpackPrefetch: true */ "./pages/basicInfo/syncFromSeasonSys.vue");
const BasicInfoShrhVoteSub = () => import(/* webpackPrefetch: true */ "./pages/basicInfo/shrhVoteSub.vue");
const BasicInfoSvotItem = () => import(/* webpackPrefetch: true */ "./pages/basicInfo/svotItem.vue");
const AccountManagementUser = () => import(/* webpackPrefetch: true */ "./pages/account/managementUser.vue");

Vue.use(VueRouter);
Vue.prototype.$CaptionsLibrary = window.CaptionsLibrary;
Vue.prototype.$MessagesLibrary = window.MessagesLibrary;


const routes: RouteConfig[] = [
    { path: "/", component: HomeIndex },

    { path: "/home/about", component: homeAbout },
    
    { path: "/account/login", component: AccountLogin },

    { path: "/meeting/index", name: "meetingindex", component: MeetingIndex, props: true },

    { path: "*", component: HomeIndex },

    { path: "/shared/report", name: "report", component: sharedReport, props: true },



    { path: "/account/managementLogin", component: AccountManagementLogin },
    { path: "/home/managementIndex", component: HomeManagementIndex },
    { path: "/meeting/managementMeetingHolding", component: MeetingManagementMeetingHolding },
    { path: "/meeting/managementMeetingVoting", component: MeetingManagementMeetingVoting },
    { path: "/meeting/managementMeetingQuestions", component: MeetingManagementMeetingQuestions },
    { path: "/report/rptMeetingPresence", component: ReportRptMeetingPresence },
    { path: "/report/rptMeetingVote", component: ReportRptMeetingVote },
    { path: "/report/rptMeetingVoteTotal", component: ReportRptMeetingVoteTotal },
    { path: "/report/rptMeetingState", component: ReportRptMeetingState },
    { path: "/basicInfo/shrMeeting", component: BasicInfoShrMeeting },
    { path: "/basicInfo/syncFromSeasonSys", component: BasicInfoSyncFromSeasonSys },
    { path: "/basicInfo/shrhVoteSub", component: BasicInfoShrhVoteSub },
    { path: "/basicInfo/svotItem", component: BasicInfoSvotItem },
    { path: "/account/managementUser", component: AccountManagementUser },

];

let router = new VueRouter({ mode: "history", routes: routes });

router.beforeResolve(async (to, from, next) => {
    
    if (to.fullPath == "/account/login" || to.fullPath == "/account/managementLogin") {
        next();
        return;
    }

    //@ts-ignore
    sessionExpired(to, from, next, window.userType);
});

function sessionExpired(to: any, from: any, next: any, type: string) {
    window.app.$emit(EventType.StartWaiting);
    $.ajax({
        type: "POST",
        url: "/api/Account/SessionExpired",
        dataType: "json",
        success: result => {
            
            if (result.Data == null) {
                sessionStorage.clear();
                if (type == "2") {
                    router.push("/account/managementLogin");
                } else {
                    router.push("/account/login");
                }              
                return;
            } else {
                checkAccess(to, from, next, result.Data.UserType);
            }
        },
        complete: () => {
            window.app.$emit(EventType.EndWaiting);
        }
    });
}

function checkAccess(to: any, from: any, next: any, type: any) {

    if (Vue.prototype.$UserInfo != undefined) {

        switch (to.fullPath) {
            case "/home/managementIndex":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/meeting/managementMeetingHolding":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/meeting/managementMeetingVoting":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/meeting/managementMeetingQuestions":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/report/rptMeetingPresence":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/report/rptMeetingVote":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/report/rptMeetingVoteTotal":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/report/rptMeetingState":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/basicInfo/shrMeeting":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/basicInfo/syncFromSeasonSys":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/basicInfo/shrhVoteSub":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/basicInfo/svotItem":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/account/managementUser":
                {
                    hasManagementAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/index");
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/meeting/index":
                {
                    hasStockAccess(type,
                        (result: boolean) => {
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                            } else {
                                next();
                            }
                        });
                }
                break;
            case "/home/index":
                {
                    hasStockAccess(type,
                        (result: boolean) => {
                            
                            if (!result) {
                                ////@ts-ignore
                                //window.app.$children[0].popupNotificationWidget.show(
                                //    window.MessagesLibrary.get('AccessDeniedForThisAction'),
                                //    'error');
                                //next(false);
                                router.push("/home/managementIndex");
                            } else {
                                next();
                            }
                        });
                }
                break;
            default:
                {
                    next();
                }
        }

    } else {

        if (type == 1) {
            router.push("/");
        } else {
            router.push("/home/managementIndex");
        }
        
    }

}

function pad(num: number) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

Date.prototype.toJSON = function () {
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
};

Vue.prototype.$UserInfo = {

};

window.app = new Vue({
    el: "#app-root",
    router,
    components: {
        "app-main": AppMain
    },
});

//@ts-ignore
window.minToHourMin = (input: any, zeroPadding: any, hourLength: any) => {
    var isMinus = input < 0;
    input = Math.abs(input);
    hourLength = hourLength || 3;
    var hour = Math.floor(input / 60);
    var min = Math.abs(input) % 60;
    var result = "";

    if (zeroPadding === true) {
        result = String("000" + hour).slice(-hourLength) + ":" + String("00" + min).slice(-2);
    } else {
        result = hour + ":" + String("00" + min).slice(-2);
    }

    if (isMinus) { result = "-" + result; }

    return result;
}

declare global {
    interface Window {
        app: any;
        CaptionsLibrary: any;
        MessagesLibrary: any;
        UserInfo: any;
        webViewTypes: any;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $CaptionsLibrary: { get: Function },
        $MessagesLibrary: { get: Function },
        $UserInfo: any,
    }
}

window.addEventListener("load", () => {
    if ('serviceWorker' in navigator) {
        const registration = runtime.register();
    }
});

function removeCustomValidity(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target) {
        target.setCustomValidity("");
        if (!target.checkValidity()) {
            const customValidity = generateCustomValidity(target);
            target.setCustomValidity(customValidity);
            target.addEventListener("input", removeCustomValidity, { once: true });
        }
    }
}

document.addEventListener('invalid', (() => (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target) {
        const customValidity = generateCustomValidity(target);
        target.setCustomValidity(customValidity);
        target.addEventListener("input", removeCustomValidity, { once: true });
    }
})(), true);

export function hasManagementAccess(type: any, callback: any) {

    if (type == "2") {
        callback(true);
    } else {
        callback(false);
    }
}

export function hasStockAccess(type: any, callback: any) {

    if (type == "1") {
        callback(true);
    } else {
        callback(false);
    }
}