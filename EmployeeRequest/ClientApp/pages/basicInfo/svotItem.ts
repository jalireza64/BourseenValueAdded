import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import SvTimepicker from "../../components/timepicker/timepicker.vue";
import SvImagepicker from "../../components/imagepicker/imagepicker.vue";

@Component({
    components: {
        SvDatepicker, SvTimepicker,
        SvImagepicker
    }
})
export default class BasicInfoSvotItem extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        shrMeetKind: "",
        shrMeetDate: "",
        desc1: "",
        svotNo: 0,
        isShowSvotItemWindow: false,
        picture: ""
    };

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

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/SvotItem/GetAllSvotItem",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.svotItemWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    reportGridDataBinding() {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    ShowSvotItemWindow() {
        this.model.isShowSvotItemWindow = true;
        (this.$refs.svotItemWindow as any).kendoWidget().center().open()
    }

    addSvotItem() {
        debugger;
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/SvotItem/AddSvotItem",
            dataType: "json",
            data: {
                svotNo: this.model.svotNo,
                desc1: this.model.desc1,
                picture: this.model.picture

            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.svotItemWindow as any).kendoWidget().close()
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    removeSvotItem() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/SvotItem/RemoveSvotItem",
            dataType: "json",
            data: {
                svotNo: this.selectedSvotItems.svot_no,
                svotItemNo: this.selectedSvotItems.svot_item_no
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.svotItemWindow as any).kendoWidget().close()
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    exportExcel() {
        var reportGrid = (this.$refs.reportGrid as any).kendoWidget();
        reportGrid.saveAsExcel();
    }

    meetingDatasource = new kendo.data.DataSource({});

    getCurrentMeetingByCompanyId() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetMeetingByCompanyIdAndDate",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
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

    selectedMeeting: any = null;

    meetingItemChange(e: any) {
        const dropdown = e.sender;
        this.selectedMeeting = dropdown.dataItem(dropdown.select());
        //this.model.shrMeetKind = this.selectedMeeting.shr_meet_kind;
        this.model.shrMeetDate = this.selectedMeeting.shr_meet_date;
        this.getMeetingShrhVoteSub();
    }



    shrhVoteSubDatasource = new kendo.data.DataSource({});

    getMeetingShrhVoteSub() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/SvotItem/GetMeetingShrhVoteSub",
            dataType: "json",
            data: {
                meetKind: this.selectedMeeting.shr_meet_kind,
                meetDate: this.selectedMeeting.shr_meet_date
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        data: result,
                        serverPaging: false
                    });
                    this.shrhVoteSubDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    selectedShrhVoteSub: any = null;

    shrhVoteSubItemChange(e: any) {
        debugger;
        const dropdown = e.sender;
        this.selectedShrhVoteSub = dropdown.dataItem(dropdown.select());
        this.model.svotNo = this.selectedShrhVoteSub.svot_no;
    }

    selectedSvotItems: any = null;

    reportGridSelect(e: any) {
        const grid = e.sender;
        this.selectedSvotItems = grid.dataItem(grid.select());
    }

    mounted() {
        this.loadReportDataSource();
        this.getCurrentMeetingByCompanyId();
    }
} 