import { Vue, Component, Watch } from "vue-property-decorator";
import * as CryptoJS from "crypto-js";
import { ResponseType, getNotificationType, EventType, UserType, getContractValidity } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
@Component({

})
export default class AccountManagementLogin extends Vue {
    canLoginByActiveDirectory = false;
    loginByActiveDirectory = false;
    CaptchaImage = "";
    user = {
        compId: "",
        username: "",
        password: "",
        captchaText: "",
        passwordType: "password"
    };
    
    encrypt(value: string) {
        var key = CryptoJS.enc.Utf8.parse('8080808080808080');
        var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    login() {
        if (!this.isOneCompanyOnly) {
            if (this.user.compId == "")
                //@ts-ignore
                return this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('PleaseSelectCompany'), getNotificationType(ResponseType.Warning))
        }
            if (1==1) {
                window.app.$emit(EventType.StartWaiting);
                $.ajax({
                    type: "POST",
                    url: "/api/Account/ManagementLogin",
                    data: {
                        captchaText: this.encrypt(this.user.captchaText),
                        username: this.encrypt(this.user.username),
                        password: this.encrypt(this.user.password),
                        CompId: this.encrypt(this.user.compId),
                    },
                    dataType: "json",
                    success: result => {
                        if (result != null) {
                            debugger;
                            if (result.ResponseType === ResponseType.Ok) {
                                window.app.$emit(EventType.Login);
                                //@ts-ignore
                                window.userType = "2";
                                this.$router.push("/home/managementIndex");
                            } else {
                                //@ts-ignore
                                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                            }
                        }
                    },
                    complete: () => {
                        window.app.$emit(EventType.EndWaiting);
                    }
                });
            } else {
                //@ts-ignore
                return this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('BBSCodeISNotValid'), getNotificationType(ResponseType.Warning))
            }



    }

    deviceId = "";
    isValidContract = false;
    customerName = "";
    isOneCompanyOnly = true;

    validateContract() {
        getContractValidity((result: any) => {
            this.customerName = result.customerName;
            this.isValidContract = result.isValidContract;
            this.deviceId = result.deviceId;
            this.isOneCompanyOnly = result.isOneCompanyOnly;
            if (!this.isOneCompanyOnly) {
                this.getAllCompany();
            }
        });
    }

    version = "";

    getVersion() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetVersion",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.version = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showPasswordInLoginState = true;
    showRememberMeInLoginState = true;
    passwordWidth = "100%";

    showPassword() {

        if (this.user.passwordType === "password") {
            this.user.passwordType = "text";
        } else {
            this.user.passwordType = "password";
        }

    }

    companyDataSource = [];

    getAllCompany() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/GetAllCompany",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.companyDataSource = result;
                    this.$nextTick(() => {
                        this.user.compId = "2";
                    });

                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    mounted() {
        $('.app').addClass('back');
        this.validateContract();



        this.getCaptchaImage();
        this.getVersion();

        document.addEventListener("keyup", event => {
            if (event.getModifierState && event.getModifierState("CapsLock")) {
                this.showCapsLockNotification = true;
            } else {
                this.showCapsLockNotification = false;
            }
        });
    }

    showCapsLockNotification = false;

    getCaptchaImage() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/ShowCaptchaImageInByte",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.CaptchaImage = result.Data;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
}
