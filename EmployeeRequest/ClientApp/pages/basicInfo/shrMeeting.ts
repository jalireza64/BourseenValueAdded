import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import SvTimepicker from "../../components/timepicker/timepicker.vue";

@Component({
    components: {
        SvDatepicker, SvTimepicker
    }
})
export default class BasicInfoShrMeeting extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        shrMeetKind: "",
        shrMeetDate: "",
        time: "",
        addreess: "",
        //formName: "",
        isShowMeetingWindow: false
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
            url: "/api/ShrMeeting/GetAllMeetingByCompId",
            dataType: "json",
            success: result => {
                debugger;
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.MeetingWindow as any).kendoWidget().center().close()
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

    ShowMeetingWindow() {
        this.model.isShowMeetingWindow = true;
        (this.$refs.MeetingWindow as any).kendoWidget().center().open()
    }

    addShrMeeting() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrMeeting/AddShrMeeting",
            dataType: "json",
            data: {
                meetKind: this.model.shrMeetKind,
                meetDate: this.model.shrMeetDate,
                meetAdd: this.model.addreess,
                meetTime: this.model.time

            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.MeetingWindow as any).kendoWidget().close()
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    removeShrMeeting() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrMeeting/RemoveShrMeeting",
            dataType: "json",
            data: {
                meetKind: this.selectedMeeting.shr_meet_kind,
                meetDate: this.selectedMeeting.shr_meet_date
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.MeetingWindow as any).kendoWidget().close()
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

    meetKindDatasource = new kendo.data.DataSource({});

    getAllMeetKind() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrMeeting/GetAllMeetKind",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        data: result,
                        serverPaging: false
                    });
                    this.meetKindDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    selectedMeeting: any = null;

    reportGridSelect(e: any) {
        const grid = e.sender;
        this.selectedMeeting = grid.dataItem(grid.select());
    }

    mounted() {
        this.loadReportDataSource();
        this.getAllMeetKind();
    }
} 