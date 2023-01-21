import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportRptMeetingVote extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    shrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.model.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.model.shrhKind = "";
        }
    }

    presenceTypeFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.presenceType = "1";
        }

        if (e.indices == 1) {
            this.model.presenceType = "2";
        }

        if (e.indices == 2) {
            this.model.presenceType = "";
        }
    }

    voteValidityFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.voteValidity = "1";
        }

        if (e.indices == 1) {
            this.model.voteValidity = "2";
        }

        if (e.indices == 2) {
            this.model.voteValidity = "";
        }
    }

    model = {
        shrMeetKind: "",
        shrMeetDate: "",
        svotNo: 0,
        presenceType: "",
        bbsCode: "",
        shrhCode: "",
        shrhKind: "",
        voteValidity: "",
        isShowFilter: false
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

    voteValidityTemplate() {
        return kendo.template(`
                                <i style="vertical-align:middle" class="#: vote_validity == true ? 'fas fa-check'
                                    : 'fas fa-times' #"
                                </i>`);
    }

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementReport/GetAllVote",
            dataType: "json",
            data: {
                shrMeetKind: this.model.shrMeetKind,
                shrMeetDate: this.model.shrMeetDate,
                svotNo: this.model.svotNo,
                presenceType: this.model.presenceType,
                shrhCode: this.model.shrhCode,
                kind: this.model.shrhKind,
                bbsCode: this.model.bbsCode,
                voteValidityType: this.model.voteValidity
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.result,
                            aggregate: [
                                { field: "vote", aggregate: "sum" },
                                { field: "vote_validity", aggregate: "count" }
                            ]
                        });
                        this.reportDataSource = dataSource;
                        (this.$refs.FilterWindow as any).kendoWidget().center().close()
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

    reportGridDataBinding() {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    ShowFilter() {
        this.model.isShowFilter = true;
        (this.$refs.FilterWindow as any).kendoWidget().center().open()
    }

    showReport() {
        this.loadReportDataSource();
    }

    exportExcel() {
        var reportGrid = (this.$refs.reportGrid as any).kendoWidget();
        reportGrid.saveAsExcel();
    }

    meetingDatasource = new kendo.data.DataSource({});

    getCurrentMeetingByCompanyIdAndDate() {
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
        this.getAllVotedMeetingShrhVoteSub();
    }

    meetingSvotDatasource = new kendo.data.DataSource({});

    getAllVotedMeetingShrhVoteSub() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetAllVotedMeetingShrhVoteSub",
            data: {
                meetKind: this.selectedMeeting.shr_meet_kind,
                meetDate: this.selectedMeeting.shr_meet_date
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        data: result,
                        serverPaging: false
                    });
                    this.meetingSvotDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    mounted() {
        this.getCurrentMeetingByCompanyIdAndDate();
    }
} 