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
export default class BasicInfoShrhVoteSub extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        shrMeetKind: "",
        shrMeetDate: "",
        desc1: "",
        svotKind: "1",
        voteNeed: "1",
        maxItem: null,
        isShowShrhVoteSubWindow: false
    };

    selectedSvotKind: any = null;

    svotKindChange(e: any) {
        debugger;
        const dropdown = e.sender;
        this.selectedSvotKind = dropdown.dataItem(dropdown.select());
        this.model.svotKind = this.selectedSvotKind.Key;
    }

    voteNeedTypeSelect(e: any) {
        if (e.indices == 0) {
            this.model.voteNeed = "1";
        }

        if (e.indices == 1) {
            this.model.voteNeed = "2";
        }
    }

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
            url: "/api/ShrhVoteSub/GetAllMeetingShrhVoteSub",
            dataType: "json",
            success: result => {
                debugger;
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.ShrhVoteSubWindow as any).kendoWidget().center().close()
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

    ShowShrhVoteSubWindow() {
        this.model.isShowShrhVoteSubWindow = true;
        (this.$refs.ShrhVoteSubWindow as any).kendoWidget().center().open()
    }

    addShrhVoteSub() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrhVoteSub/AddShrhVoteSub",
            dataType: "json",
            data: {
                meetKind: this.model.shrMeetKind,
                meetDate: this.model.shrMeetDate,
                desc1: this.model.desc1,
                svotKind: this.model.svotKind,
                voteNeed: this.model.voteNeed,
                maxItem: this.model.maxItem

            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.ShrhVoteSubWindow as any).kendoWidget().close()
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    removeShrhVoteSub() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrhVoteSub/RemoveShrhVoteSub",
            dataType: "json",
            data: {
                svotNo: this.selectedShrhVoteSub.svot_no
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.loadReportDataSource();
                    (this.$refs.ShrhVoteSubWindow as any).kendoWidget().close()
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
        this.model.shrMeetKind = this.selectedMeeting.shr_meet_kind;
        this.model.shrMeetDate = this.selectedMeeting.shr_meet_date;
    }

    selectedShrhVoteSub: any = null;

    reportGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShrhVoteSub = grid.dataItem(grid.select());
    }

    svotKindDatasource = new kendo.data.DataSource({});

    getAllSvotKind() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrhVoteSub/GetAllSvotKind",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        data: result,
                        serverPaging: false
                    });
                    this.svotKindDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    mounted() {
        this.loadReportDataSource();
        this.getCurrentMeetingByCompanyId();
        this.getAllSvotKind();
    }
} 