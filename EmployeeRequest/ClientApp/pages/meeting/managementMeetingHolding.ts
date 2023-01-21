import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, getNotificationType, ResponseType } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class MeetingManagementHolding extends Vue {

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    manuModel = {
        isShowPrintAndPresenceState: false
    }

    presenceStateModel = {
        isShowPrintAndPresenceState: false,
        shrMeetKind: "",
        printType: "1",
        relativeShareType: "false"
    }

    shareholderSearchModel = {
        natCode:"",
        name:"",
        surname: "",
        father: "",
        certNo:"",
        bbsCode: "",
        shrhKind: "",
        shrhStatus: ""
    }

    filterWindowModel = {
        isShowFilterWindow: false
    }

    statusWindowModel = {
        isStatusWindowShown: false
    }

    statusDescTemplate() {
        return kendo.template(`
                                
                                <span>
                                    #: statusDesc || ' ' #
                                </span>
                                <i style="float: left;vertical-align:middle" class="#: status == 1 ? 'fas fa-user-friends'
                                    : status == 3 ? 'far fa-user'
                                    : 'fas fa-user' #"
                                </i>`);
    }

    shrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.shareholderSearchModel.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.shareholderSearchModel.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.shareholderSearchModel.shrhKind = "";
        }
    }

    shrhStatusFlagSelect(e: any) {
        if (e.indices == 0) {
            this.shareholderSearchModel.shrhStatus = "1";
        }

        if (e.indices == 1) {
            this.shareholderSearchModel.shrhStatus = "2";
        }

        if (e.indices == 2) {
            this.shareholderSearchModel.shrhStatus = "";
        }
    }

    printTypeSelect(e: any) {
        if (e.indices == 0) {
            this.presenceStateModel.printType = "1";
        }

        if (e.indices == 1) {
            this.presenceStateModel.printType = "2";
        }
    }

    relativeShareTypeSelect(e: any) {
        if (e.indices == 0) {
            this.presenceStateModel.relativeShareType = "false";
        }

        if (e.indices == 1) {
            this.presenceStateModel.relativeShareType = "true";
        }
    }

    shareholderSearchDatasource: any = [];
    getShareholdersForSearch() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementMeeting/GetShareholdersForSearch",
            data: {
                natCode: this.shareholderSearchModel.natCode,
                shrhKind: this.shareholderSearchModel.shrhKind,
                name: this.shareholderSearchModel.name,
                surname: this.shareholderSearchModel.surname,
                father: this.shareholderSearchModel.father,
                bbsCode: this.shareholderSearchModel.bbsCode,
                certNo: this.shareholderSearchModel.certNo,
                shrhStatus: this.shareholderSearchModel.shrhStatus
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 100,
                            data: result.result,
                            aggregate: [
                                { field: "share", aggregate: "sum" }
                            ]
                        });
                        this.shareholderSearchDatasource = dataSource;
                        (this.$refs.shareholderFilterWindow as any).kendoWidget().close()
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
    }

    shareholderKindTemplate() {
        return kendo.template(`
                                
                                <span>
                                    #: fullName || ' ' #
                                </span>
                                <i style="float: left;vertical-align:middle" class="#: kind != null ? 'fas' : '' # #: kind == 1 ? 'fa-user-tie'
                                    : kind == 2 ? 'fa-building'
                                    : '' #"
                                   title="#: kind == 1 ? '${this.$CaptionsLibrary.get("Actual")}' 
                                    : kind == 2 ? '${this.$CaptionsLibrary.get("Legal")}' 
                                    : '' #">
                                </i>`);
    }

    toggleShareholderSearchMenu() {
        if (this.manuModel.isShowPrintAndPresenceState == false) {
            this.manuModel.isShowPrintAndPresenceState = true;
        } else {
            this.manuModel.isShowPrintAndPresenceState = false;
        }
    }

    ShowPrintAndPresenceStateWindow() {
        this.getCurrentMeetingByCompanyIdAndDate();
        this.presenceStateModel.isShowPrintAndPresenceState = true;
        (this.$refs.printPaperWindow as any).kendoWidget().center().open()
    }

    ShowPresenceStateWindow() {
        this.getCurrentMeetingByCompanyIdAndDate();
        this.presenceStateModel.isShowPrintAndPresenceState = true;
        (this.$refs.presenceStateWindow as any).kendoWidget().center().open()
    }

    selectedShareholder: any = null;

    shareholderGridSelect(e:any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select());
    }

    shareholderGridDataBinding() {
        var grid = (this.$refs.shareholderGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    meetingDatasource = new kendo.data.DataSource({});
    getCurrentMeetingByCompanyIdAndDate() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementMeeting/GetCurrentMeetingByCompanyIdAndDate",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 2,
                        data: result,
                        serverPaging: false
                    });
                    this.meetingDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    selectedMeetingForPresenceState: any = null;

    meetingItemChange(e: any) {
        const dropdown = e.sender;
        this.selectedMeetingForPresenceState = dropdown.dataItem(dropdown.select());
        this.presenceStateModel.shrMeetKind = this.selectedMeetingForPresenceState.shr_meet_kind;
    }

    meetingItemForPrintChange(e: any) {
        const dropdown = e.sender;
        this.selectedMeetingForPresenceState = dropdown.dataItem(dropdown.select());
        this.presenceStateModel.shrMeetKind = this.selectedMeetingForPresenceState.shr_meet_kind;
    }

    ShowFilterWindow() {
        this.getCurrentMeetingByCompanyIdAndDate();
        this.filterWindowModel.isShowFilterWindow = true;
        (this.$refs.shareholderFilterWindow as any).kendoWidget().center().open()
    }

    statusGridDataBinding() {
        //@ts-ignore
        window.record = 0;
    }

    statusGridDataSource: any = [];

    ShowStatusWindow() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementMeeting/GetShareholderStatusInformation",
            dataType: "json",
            data: {
                shrhCode: this.selectedShareholder.shrh_code,
                shrhStatus: this.selectedShareholder.status
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            data: result.result,
                            aggregate: [
                                { field: "share", aggregate: "sum" }
                            ]
                        });
                        this.statusGridDataSource = dataSource;
                    } {
                        ////@ts-ignore
                        //this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                    }  
                }
            },
            complete: () => {
                this.statusWindowModel.isStatusWindowShown = true;
                (this.$refs.shareholderStatusWindow as any).kendoWidget().center().open()
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    changingPresenceState() {
        if (this.presenceStateModel.shrMeetKind != "") {
            window.app.$emit(EventType.StartWaiting);
            $.ajax({
                type: "POST",
                url: "/api/ManagementMeeting/AddUserToMeeting",
                dataType: "json",
                data: {
                    //@ts-ignore
                    shrMeetKind: this.selectedMeetingForPresenceState.shr_meet_kind,
                    //@ts-ignore
                    shrMeetDate: this.selectedMeetingForPresenceState.shr_meet_date,
                    //@ts-ignore
                    shrhCode: this.selectedShareholder.shrh_code,
                    //@ts-ignore
                    withRelation: this.presenceStateModel.relativeShareType,
                },
                success: result => {
                    if (result) {
                        //@ts-ignore
                        this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                        //(this.$refs.presenceStateWindow as any).kendoWidget().close()
                    }
                },
                complete: () => {
                    window.app.$emit(EventType.EndWaiting);
                }
            });
        } else {
            //@ts-ignore
            return this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('PleaseSelectMeeting'), getNotificationType(ResponseType.Warning))
        }

    }

    shareholderModel = {};

    printPaper() {
        debugger;
        if (this.presenceStateModel.shrMeetKind != "") {
            window.app.$emit(EventType.StartWaiting);
            $.ajax({
                type: "POST",
                url: "/api/ManagementMeeting/GetMeetingPaperData",
                data: {
                    //@ts-ignore
                    shrMeetKind: this.selectedMeetingForPresenceState.shr_meet_kind,
                    //@ts-ignore
                    shrMeetDate: this.selectedMeetingForPresenceState.shr_meet_date,
                    //@ts-ignore
                    shrhCode: this.selectedShareholder.shrh_code,
                },
                dataType: "json",
                success: result => {
                    if (result != null) {
                        this.shareholderModel = result;
                        this.setPrintFlag()
                        if (this.presenceStateModel.printType == "1") {
                            //this.$router.push({ name: "report", params: { model: JSON.stringify(this.shareholderModel) } });
                        } else {
                            this.changingPresenceState();
                            //this.$router.push({ name: "report", params: { model: JSON.stringify(this.shareholderModel) } });
                        }


                    }
                },
                complete: () => {
                    window.app.$emit(EventType.EndWaiting);
                }
            });
        } else {
            //@ts-ignore
            return this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('PleaseSelectMeeting'), getNotificationType(ResponseType.Warning))
        }
    }

    setPrintFlag() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/setPrintFlagForManagement",
            dataType: "json",
            data: {
                //@ts-ignore
                shrh_code: this.shareholderModel.shrh_code,
                shrMeetKind: this.selectedMeetingForPresenceState.shr_meet_kind,
                shrMeetDate: this.selectedMeetingForPresenceState.shr_meet_date,
                withRelation: this.presenceStateModel.relativeShareType
            },
            success: result => {
                debugger;
                if (result.ResponseType == ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                    this.$router.push({ name: "report", params: { model: JSON.stringify(this.shareholderModel) } });
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                    //this.$router.push({ name: "report", params: { model: JSON.stringify(this.shareholderModel) } });
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    mounted() {
        $('.app').removeClass('back');
        getCurrentDate((result: any) => {
            
        });
    }
} 