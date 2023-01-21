import { Vue, Component, Watch } from "vue-property-decorator";

import '@progress/kendo-ui/js/kendo.treeview.js';
import '@progress/kendo-ui/js/kendo.button.js';
import '@progress/kendo-ui/js/kendo.toolbar.js';
import '@progress/kendo-ui/js/kendo.maskedtextbox.js';
import '@progress/kendo-ui/js/kendo.autocomplete.js';
import '@progress/kendo-ui/js/kendo.grid.js';
import '@progress/kendo-ui/js/kendo.switch.js';
import '@progress/kendo-ui/js/kendo.dropdownlist.js';
import '@progress/kendo-ui/js/kendo.treelist.js';
import '@progress/kendo-ui/js/kendo.dropdowntree.js';
import '@progress/kendo-ui/js/kendo.multiselect.js';
import '@progress/kendo-ui/js/kendo.combobox.js';
import '@progress/kendo-ui/js/kendo.notification.js';
import '@progress/kendo-ui/js/kendo.dialog.js';
import '@progress/kendo-ui/js/kendo.panelbar.js';
import '@progress/kendo-ui/js/kendo.upload.js';
import '@progress/kendo-ui/js/dataviz/chart/chart.js';
import '@progress/kendo-ui/js/kendo.window.js';
import '@progress/kendo-ui/js/dataviz/gauge/main.js';
import '@progress/kendo-ui/js/dataviz/sparkline/sparkline.js';
import '@progress/kendo-ui/js/kendo.tabstrip.js';
import '@progress/kendo-ui/js/kendo.listview.js';
import '@progress/kendo-ui/js/dataviz/stock/stock-chart.js';
import '@progress/kendo-ui/js/kendo.dataviz.barcode.js';
import '@progress/kendo-ui/js/kendo.dataviz.qrcode.js';
import '@progress/kendo-ui/js/kendo.datetimepicker';

import { GridInstaller } from '@progress/kendo-grid-vue-wrapper';
import { DataSourceInstaller } from '@progress/kendo-datasource-vue-wrapper';
import { ChartInstaller } from '@progress/kendo-charts-vue-wrapper';
import { LayoutInstaller } from '@progress/kendo-layout-vue-wrapper';
import { DialogInstaller } from '@progress/kendo-dialog-vue-wrapper';
import { InputsInstaller } from '@progress/kendo-inputs-vue-wrapper';
import { DropdownsInstaller } from '@progress/kendo-dropdowns-vue-wrapper';
import { TreeList, TreeListInstaller } from '@progress/kendo-treelist-vue-wrapper'
import { DropDownTree, DropDownTreeInstaller } from '@progress/kendo-dropdowntree-vue-wrapper'
import { ButtonsInstaller } from '@progress/kendo-buttons-vue-wrapper';
import { TreeViewInstaller } from '@progress/kendo-treeview-vue-wrapper';
import { PopupsInstaller } from '@progress/kendo-popups-vue-wrapper';
import { Upload, UploadInstaller } from '@progress/kendo-upload-vue-wrapper';
import { WindowInstaller } from '@progress/kendo-window-vue-wrapper';
import { GaugesInstaller } from '@progress/kendo-gauges-vue-wrapper';
import { ListViewInstaller } from '@progress/kendo-listview-vue-wrapper';
import { BarcodesInstaller } from '@progress/kendo-barcodes-vue-wrapper';
import { DateinputsInstaller } from '@progress/kendo-dateinputs-vue-wrapper';

import { NumericTextBox, Input } from '@progress/kendo-vue-inputs';

import { EventType, ResponseType, UserType, getContractValidity } from "../assets/utilities";

import VueDraggable from 'vue-draggable'

Vue.use(DropDownTreeInstaller);
Vue.use(TreeListInstaller);
Vue.use(ChartInstaller);
Vue.use(UploadInstaller);
Vue.use(LayoutInstaller);
Vue.use(DialogInstaller);
Vue.use(GridInstaller);
Vue.use(InputsInstaller);
Vue.use(DropdownsInstaller);
Vue.use(ButtonsInstaller);
Vue.use(TreeViewInstaller);
Vue.use(PopupsInstaller);
Vue.use(WindowInstaller);
Vue.use(DataSourceInstaller);
Vue.use(VueDraggable)
Vue.use(GaugesInstaller);
Vue.use(ListViewInstaller);
Vue.use(BarcodesInstaller);
Vue.use(DateinputsInstaller);

Vue.component('k-input', Input);
Vue.component('numerictextbox', NumericTextBox);

const publicServerKey = "BF-9DAjR4QAFiR8wU9Yb0TMxuhX5FTs9-uEeGZNq4OsY5I-munE2VDABXUEbcrF6nry4xUiMaa-jorWMvQchy1U";

@Component({

})
export default class Main extends Vue {

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../assets/kendo.messages.fa-IR.js');
    }
    
    waitingsCount = 0;

    popupNotificationWidget: any;

    isColorListShown = false;

    isMenuShown = false;

    isEventsShown = false;

    searchInputShown = false;

    isShareholderWatchWindowShown = false;

    isShareholderWatchModifyWindowShown = false;

    selectedBar = document.createElement("div");

    menuItems: Array<{href: string, title: string}> = [];

    headerModel = {
        fullName: "",
        shrhCode: "",
        ManagementUserId: "",
        UserType: 0
    }

    toggleSearchInput() {
        this.searchInputShown = !this.searchInputShown;
        if (this.searchInputShown) {
            this.$nextTick(() => {
                (this.$el.querySelector(".search .k-widget input") as HTMLInputElement).focus();
            });
        }
    }

    toggleColorList() {
        this.isColorListShown = !this.isColorListShown;
        this.isMenuShown = false;
        this.isEventsShown = false;
    }

    toggleMenu() {
        this.isMenuShown = !this.isMenuShown;
        this.isColorListShown = false;
        this.isEventsShown = false;
    }

    eventsMenu() {
        this.isEventsShown = !this.isEventsShown;
        this.isMenuShown = false;
        this.isColorListShown = false;
    }

    alertsMenu() {
        this.isEventsShown = false;
        this.isMenuShown = false;
        this.isColorListShown = false;
        this.$router.push("/home/alert");
    }

    isLoginPage() {
        return this.$router.currentRoute.fullPath.startsWith('/account/login') || this.$router.currentRoute.fullPath.startsWith('/account/managementLogin');
    }

    themes = [
        //{ color1: '#3276b1', color2: '#67afe9', color3: '#fff', value: "bootstrap-v4" },
        //{ color1: '#ef6f1c', color2: '#e24b17', color3: '#5a4b43', value: "default-v2" },
        { color1: '#007cc0', color2: '#e6f2f9', color3: '#f0f0f0', value: "fiori" },
        { color1: '#363940', color2: '#2eb3a6', color3: '#fff', value: "flat" },
        //{ color1: '#3f51b5', color2: '#283593', color3: '#fff', value: "material-v2" },
        { color1: '#3f51b5', color2: '#1c1c1c', color3: '#4d4d4d', value: "materialblack" },
        { color1: '#8ebc00', color2: '#787878', color3: '#fff', value: "metro" },
        { color1: '#00aba9', color2: '#0e0e0e', color3: '#565656', value: "metroblack" },
        { color1: '#ee9f05', color2: '#40444f', color3: '#212a33', value: "moonlight" },
        { color1: '#ff4350', color2: '#00acc1', color3: '#303553', value: "nova" },
        { color1: '#0072c6', color2: '#cde6f7', color3: '#fff', value: "office365" },
        { color1: '#298bc8', color2: '#515967', color3: '#eaeaec', value: "silver" },
        { color1: '#656565', color2: '#EB8810', color3: '#FF9411', value: "orange" },
        { color1: '#000000', color2: '#333333', color3: '#656565', value: "blackwhite" },
        { color1: '#FF804D', color2: '#1B4B66', color3: '#447A99', value: "urban" }

    ];

     setTheme(themeValue: string) {
         this.changeTheme(themeValue, true);
         localStorage.setItem("theme", themeValue);
         this.toggleColorList();
     };

    changeTheme(skinName: string, animate: Boolean) {
    var kendoLinks = $("link[href*='kendo.']", document.getElementsByTagName("head")[0]);
        var commonLink = kendoLinks.filter("[href*='kendo.common']");
        if (commonLink.length === 0) return;
        var skinLink = kendoLinks.filter(":not([href*='kendo.common'],[href*='kendo.rtl'])");
        var href = location.href;
        var skinRegex = /kendo\.\w+(\.min)?\.css/i;
        var extension = skinLink.attr("rel") === "stylesheet" ? ".css" : ".less";
        var url = commonLink.attr("href")!.replace(skinRegex, "kendo." + skinName + "$1" + extension);

        function preloadStylesheet(file: any, callback: Function) {
            var element = $("<link rel='stylesheet' media='print' href='" + file + "'/>").appendTo("head");
            setTimeout(function () {
                callback();
                element.remove();
            }, 100);
        }

        function replaceTheme() {
            var oldSkinName = $(document).data("theme");

            //if ($.browser.msie) {
            //    newLink = $(doc.createStyleSheet(url));
            //} else {
            const newLink = skinLink.eq(0).clone().attr("href", url);
            skinLink.eq(0).before(newLink);
            //}

            skinLink.remove();

            $(document.documentElement).removeClass("k-" + oldSkinName).addClass("k-" + skinName);
        }

        if (animate) {
            preloadStylesheet(url, replaceTheme);
        } else {
            replaceTheme();
        }
    };

    currentTheme() {
        return localStorage.getItem("theme") || "blackwhite";
    }

    selectedTheme() {
        const selectedTheme = localStorage.getItem("theme") || "blackwhite";
        for (var i = 0; i < this.themes.length; i++) {
            if (this.themes[i].value === selectedTheme) {
                return this.themes[i];
            } 
        }
    }

    created() {
        this.changeTheme(this.currentTheme(), true);
    }

    profile() {
        this.isMenuShown = false;
        if (this.headerModel.UserType == UserType.StockUser) {
            this.$router.push("/");
        } else {
            this.$router.push("/home/managementIndex");
        }
        
    }

    about() {
        this.isMenuShown = false;
        this.$router.push("/home/about");
    }

    exit() {
        this.$root.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/Logout",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.isMenuShown = false;
                    this.isColorListShown = false;
                    sessionStorage.clear();
                    if (this.headerModel.UserType == UserType.StockUser) {
                        this.$router.push("/account/login");
                    } else {
                        this.$router.push("/account/managementLogin");
                    }    
                }
            },
            complete: () => {
                this.$root.$emit(EventType.EndWaiting);
            }
        });
    }

    exitConfirm() {
        this.isMenuShown = false;
        (this.$refs.exitConfirm as any).kendoWidget().open();
    }

    customerName = "";
    isMobile = window.orientation !== undefined;
    getCustomerName() {
        getContractValidity((result: any) => {
            this.customerName = result.customerName;
            const DEFAULT_TITLE = this.customerName;
            Vue.nextTick(() => {
                document.title = "سیستم برگزاری مجمع شرکت رادین انفورماتیک (بورسین)";
            });
            //this.isValidContract = result.isValidContract;
            //this.deviceId = result.deviceId;
        });
    }

    @Watch("isColorListShown")
    isColorListShownChange() {
        if (this.isColorListShown) {
            this.$nextTick(() => {
                (this.$refs.colorList as HTMLElement).focus();
            });
        }
    }

    colorListFocusOut(e: Event) {
        const el = e.currentTarget as HTMLElement;
        setTimeout(() => {
            if (!el.contains(document.activeElement)) {
                this.isColorListShown = false;
            }
        }, 0);
    }

    @Watch("isEventsShown")
    isEventsShownChange() {
        if (this.isEventsShown) {
            this.$nextTick(() => {
                (this.$refs.events as HTMLElement).focus();
            });
        }
    }

    eventsFocusOut(e: Event) {
        const el = e.currentTarget as HTMLElement;
        setTimeout(() => {
            if (!el.contains(document.activeElement)) {
                this.isEventsShown = false;
            }
        }, 0);
    }

    @Watch("isMenuShown")
    isMenuShownChange() {
        if (this.isMenuShown) {
            this.$nextTick(() => {
                (this.$refs.menu as HTMLElement).focus();
            });
        }
    }

    menuFocusOut(e: Event) {
        const el = e.currentTarget as HTMLElement;
        setTimeout(() => {
            if (!el.contains(document.activeElement)) {
                this.isMenuShown = false;
            }
        }, 0);
    }

    @Watch("waitingsCount")
    waitingsCountChange() {
        if (this.waitingsCount) {
            document.querySelectorAll("button").forEach(o => o.setAttribute("disabled", ""));
        } else {
            document.querySelectorAll("button").forEach(o => o.removeAttribute("disabled"));
        }
    }

    getLoginResult() {
    window.app.$emit(EventType.StartWaiting);
    $.ajax({
        type: "POST",
        url: "/api/Home/GetLoginResult",
        dataType: "json",
        success: result => {
            this.headerModel.fullName = result.Name + " " + result.Family;
            this.headerModel.shrhCode = result.ShrhCode;
            this.headerModel.ManagementUserId = result.ManagementUserId;
            this.headerModel.UserType = result.UserType;
            Vue.prototype.$UserInfo = this.headerModel
        },
        complete: () => {
            window.app.$emit(EventType.EndWaiting);
        }
    });
}

    logo = "";

    getCompanyLogo() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/GetCompanyLogo",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.logo = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    dateObject = {
        currentDate: "",
        beginOfMonthDate: "",
        beginOfYearDate: ""
    };

    getCurrentDate() {

    $.ajax({
        type: "POST",
        url: "/api/Home/GetCurrentDate",
        dataType: "json",
        success: result => {
            if (result != null) {
                this.dateObject.currentDate = result.currentDate;
                this.dateObject.beginOfMonthDate = result.beginOfMonthDate;
                this.dateObject.beginOfYearDate = result.beginOfYearDate;
                Vue.prototype.$dateObject = this.dateObject;
                
                
            }
        },
        complete: () => {

        }
    });
}

    navFocusOut(e: Event) {
        const el = e.currentTarget as HTMLElement;
        setTimeout(() => {
            if (!el.contains(document.activeElement)) {
                this.hideNav();
            }
        }, 0);
    }

    navigate(e: Event) {
        const target = e.target as HTMLElement;
        if (target.tagName == "A") {
            this.hideNav();
            return;
        }

        const button = target.closest("button") as HTMLButtonElement;
        if (!button || button.classList.contains("scroll")) {
            return;
        }

        const toShow = button.nextElementSibling! as HTMLUListElement;
        const alreadyShown = toShow.style.display != "none";
        if (button.parentElement!.parentElement!.parentElement!.tagName == "NAV") {
            const innerVisible = $("nav>ul>li>ul>li>ul:visible, nav>ul>li>ul>li>.scroll:visible");
            if (innerVisible.length) {
                const outerVisible = $("nav>ul>li>ul:visible, nav>ul>li>.scroll:visible");
                innerVisible.slideUp(200, () => {
                    outerVisible.slideUp(200);
                });
            } else {
                $("nav>ul>li>ul:visible, nav>ul>li>.scroll:visible").slideUp(200);
            }
        } else {
            $("nav>ul>li>ul>li>ul:visible, nav>ul>li>ul>li>.scroll:visible").slideUp(200);
        }
        (button.closest("ul") as HTMLUListElement).querySelectorAll("button").forEach(o => {
            o.classList.remove("k-text-primary");
        });
        button.classList.add("k-text-primary");
        toShow.style.position = "";
        toShow.style.width = "";
        toShow.style.flexWrap = "";
        if (window.innerWidth > 1000) {
            toShow.style.left = "auto";
            toShow.style.right = "50%";
            toShow.style.transform = "translateX(50%)";
            this.$nextTick(() => {
                const boundingClientRect = toShow.getBoundingClientRect();
                if (boundingClientRect.right > window.innerWidth) {
                    toShow.style.left = "auto";
                    toShow.style.right = "0";
                    toShow.style.transform = "none";
                    this.$nextTick(() => {
                        doubleCheck(toShow);
                    });
                } else if (boundingClientRect.left < 0) {
                    toShow.style.right = "auto";
                    toShow.style.left = "0";
                    toShow.style.transform = "none";
                    this.$nextTick(() => {
                        doubleCheck(toShow);
                    });
                }
            });
        } else {
            toShow.style.left = "";
            toShow.style.right = "";
            toShow.style.transform = "";
        }

        if (!alreadyShown) {
            const $toShow = $(toShow);
            $toShow.slideDown(200);
            $toShow.siblings(".scroll").slideDown(200);
            this.$nextTick(() => {
                button.classList.add("k-text-primary");
                button.appendChild(this.selectedBar);
            });
        } else {
            button.classList.remove("k-text-primary");
            this.selectedBar.remove();
        }

        function doubleCheck(toShow: HTMLElement) {
            const boundingClientRect = toShow.getBoundingClientRect();
            if (boundingClientRect.right > window.innerWidth || boundingClientRect.left < 0) {
                toShow.style.position = "fixed";
                toShow.style.right = "0";
                toShow.style.left = "0";
                toShow.style.width = "100vw";
                toShow.style.flexWrap = "wrap";
                setTimeout(() => { toShow.style.right = -(window.innerWidth - toShow.getBoundingClientRect().right) + "px" }, 0);
            }
        }
    }

    hideNav() {
        const innerVisible = $("nav>ul>li>ul>li>ul:visible, nav>ul>li>ul>li>.scroll:visible");
        if (innerVisible.length) {
            innerVisible.slideUp(200, () => {
                $("nav>ul>li>ul:visible, nav>ul>li>.scroll:visible").slideUp(200);
            });
        } else {
            $("nav>ul>li>ul:visible, nav>ul>li>.scroll:visible").slideUp(200);
        }
    }

    mounted() {

        this.getCompanyLogo();
        
        Vue.prototype.$dateObject = this.dateObject;
        Vue.prototype.$UserInfo = this.headerModel;
        this.getCurrentDate();
        this.getLoginResult();
        this.getCustomerName();

        this.$root.$on(EventType.StartWaiting, () => {
            this.waitingsCount++;
        });
        this.$root.$on(EventType.EndWaiting, () => {
            this.waitingsCount && this.waitingsCount--;
        });
        this.$root.$on(EventType.Login, () => {  
            this.getCurrentDate();
            this.getLoginResult();
        });
        this.$root.$on(EventType.RequestCount, () => {
            
        });

        this.popupNotificationWidget = (<any>this.$refs.popupNotification).kendoWidget();

        this.selectedBar.classList.add("k-bg-primary");
        this.selectedBar.classList.add("selected-bar");
        $("nav li").addClass("k-content");

        $("nav>ul>li>ul>li").prepend("<button class='scroll inner-scroll scroll-left k-content'><i class='fa fa-caret-right'></i></button>");
        $("nav>ul>li>ul>li").append("<button class='scroll inner-scroll scroll-right k-content'><i class='fa fa-caret-left'></i></button>");

        $("nav>ul>li").prepend("<button class='scroll outer-scroll scroll-left k-content'><i class='fa fa-caret-right'></i></button>");
        $("nav>ul>li").append("<button class='scroll outer-scroll scroll-right k-content'><i class='fa fa-caret-left'></i></button>");

        $("nav>ul>li>ul, nav>ul>li>.scroll").hide();
        $("nav>ul>li>ul>li>ul, nav>ul>li>ul>li>.scroll").hide();

        let mouseDown = false;

        function scrollLeft(targetUl: HTMLElement) {
            targetUl.scrollLeft += 5;
            if (mouseDown) {
                setTimeout(scrollLeft, 10, targetUl);
            }
        }

        function startScrollLeft(e: JQuery.MouseDownEvent | JQuery.TouchStartEvent) {
            e.preventDefault();
            const $targetUl = $(e.target).siblings("ul")!;
            const targetUl = $targetUl[0];
            mouseDown = true;
            scrollLeft(targetUl);
        }

        $("nav>ul>li>.scroll-left, nav>ul>li>ul>li>.scroll-left").mousedown(startScrollLeft);
        $("nav>ul>li>.scroll-left, nav>ul>li>ul>li>.scroll-left").on("touchstart", startScrollLeft);

        function endScrollLeft() {
            mouseDown = false;
        }

        $("nav>ul>li>.scroll-left, nav>ul>li>ul>li>.scroll-left").mouseup(endScrollLeft);
        $("nav>ul>li>.scroll-left, nav>ul>li>ul>li>.scroll-left").mouseleave(endScrollLeft);
        $("nav>ul>li>.scroll-left, nav>ul>li>ul>li>.scroll-left").on("touchend", endScrollLeft);

        function scrollRight(targetUl: HTMLElement) {
            targetUl.scrollLeft -= 5;
            if (mouseDown) {
                setTimeout(scrollRight, 10, targetUl);
            }
        }

        function startScrollRight(e: JQuery.MouseDownEvent | JQuery.TouchStartEvent) {
            e.preventDefault();
            const $targetUl = $(e.target).siblings("ul")!;
            const targetUl = $targetUl[0];
            mouseDown = true;
            scrollRight(targetUl);
        }

        $("nav>ul>li>.scroll-right, nav>ul>li>ul>li>.scroll-right").mousedown(startScrollRight);
        $("nav>ul>li>.scroll-right, nav>ul>li>ul>li>.scroll-right").on("touchstart", startScrollRight);

        function endScrollRight() {
            mouseDown = false;
        }

        $("nav>ul>li>.scroll-right, nav>ul>li>ul>li>.scroll-right").mouseup(endScrollRight);
        $("nav>ul>li>.scroll-right, nav>ul>li>ul>li>.scroll-right").mouseleave(endScrollRight);
        $("nav>ul>li>.scroll-right, nav>ul>li>ul>li>.scroll-right").on("touchend", endScrollRight);

        let previousSize = window.innerWidth;
        $(window).resize(() => {
            if (previousSize >= 1000 && window.innerWidth < 1000) {
                $("nav>ul>li>ul>li>ul, nav>ul>li>ul>li>.scroll").hide();
                $("nav>ul>li>ul, nav>ul>li>.scroll").slideUp(200);
            }
            previousSize = window.innerWidth;
        });
    }
}
