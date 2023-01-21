import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, OperationType, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import CryptoJS from "crypto-js";

@Component({
    components: {
        SvDatepicker
    }
})
export default class AccountManagementUser extends Vue {
    kendoMessages: any = null;

    selectedUser: any = null;

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

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    initialModel = {
        id: 0,
        name: "",
        family: "",
        username: "",
        password: "",
        mobileNo: "",
        accessLevelId: 0,
        operationType: OperationType.Add,
        operationTypeDesc: "",
        isShowWindow: false,
        passwordType: "password",
    };

    usersModel = { ...this.initialModel };

    manuModel = {
        ShowMenu: false
    }

    toggleReport() {
        if (this.manuModel.ShowMenu == false) {
            this.manuModel.ShowMenu = true;
        } else {
            this.manuModel.ShowMenu = false;
        }
    }

    reportDataSource: any = [];

    showPassword() {

        if (this.usersModel.passwordType === "password") {
            this.usersModel.passwordType = "text";
        } else {
            this.usersModel.passwordType = "password";
        }

    }

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/GetAllManagementUser",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.UserWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showAdd() {
        this.clearForm();
        this.usersModel.isShowWindow = true;
        this.usersModel.operationType = OperationType.Add;
        this.usersModel.operationTypeDesc = this.$CaptionsLibrary.get('Add');
        (this.$refs.UserWindow as any).kendoWidget().center().open()
    }

    showEdit() {
        this.usersModel.isShowWindow = true;
        this.usersModel.operationType = OperationType.Modify;
        this.usersModel.operationTypeDesc = this.$CaptionsLibrary.get('Edit');
        this.usersModel.id = this.selectedUser.Id;
        this.usersModel.name = this.selectedUser.Name;
        this.usersModel.family = this.selectedUser.Family;
        this.usersModel.mobileNo = this.selectedUser.MobileNo;
        this.usersModel.username = this.selectedUser.Username;
        this.usersModel.password = this.selectedUser.Password;
        this.usersModel.accessLevelId = this.selectedUser.AccessLevelId;
        (this.$refs.UserWindow as any).kendoWidget().center().open()
    }

    add() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/addManagementUser",
            data: {
                name: this.usersModel.name,
                surname: this.usersModel.family,
                mobile: this.usersModel.mobileNo,
                userId: this.usersModel.username,
                password: this.encrypt(this.usersModel.password)
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,getNotificationType(result.ResponseType));
                    (this.$refs.UserWindow as any).kendoWidget().close();
                    this.selectedUser = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }
                
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    modify() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/modifyUser",
            data: {
                id: this.usersModel.id,
                name: this.usersModel.name,
                family: this.usersModel.family,
                mobileNo: this.usersModel.mobileNo,
                username: this.usersModel.username,
                password: this.usersModel.password,
                accessLevelId: this.usersModel.accessLevelId,
            },
            dataType: "json",
            success: result => {
                debugger;
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    (this.$refs.UserWindow as any).kendoWidget().close();
                    this.selectedUser = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }

            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    operation() {
        if (this.usersModel.operationType == OperationType.Add) {
            this.add()
        } else {
            this.modify();
        }
    }

    remove() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/RemoveManagementUser",
            data: {
                userId: this.selectedUser.user_id
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    this.selectedUser = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }

            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedUser = grid.dataItem(grid.select());
    }

    clearForm() {
        this.usersModel = { ...this.initialModel };
    }

    mounted() {
        this.loadReportDataSource();
    }
} 