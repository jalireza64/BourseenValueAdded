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
export default class BasicInfoSyncFromSeasonSys extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        isShowSyncWindow: false
    };

    syncModel = {
        isWithRepresentationInfo: false,
        generatedPasswordType: 0,
    };

    representationSelect(e: any) {
        if (e.indices == 0) {
            this.syncModel.isWithRepresentationInfo = true;
        }

        if (e.indices == 1) {
            this.syncModel.isWithRepresentationInfo = false;
        }
    }

    generatedPasswordSelect(e: any) {
        if (e.indices == 0) {
            this.syncModel.generatedPasswordType = 1;
        }

        if (e.indices == 1) {
            this.syncModel.generatedPasswordType = 2;
        }

        if (e.indices == 2) {
            this.syncModel.generatedPasswordType = 3;
        }

        if (e.indices == 3) {
            this.syncModel.generatedPasswordType = 0;
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

    spFbShrTransDatasource = [];

    showSyncWindow() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrMeeting/GetSpFbShrTrans",
            data: {
                meetDate: this.selectedMeeting.shr_meet_date_formated
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.spFbShrTransDatasource = result;
                    this.model.isShowSyncWindow = true;
                    (this.$refs.SyncWindow as any).kendoWidget().center().open()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    sync() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShrMeeting/SyncFromSystem",
            dataType: "json",
            data: {
                meetDate: this.selectedMeeting.shr_meet_date_formated,
                isWithRepresentationInfo: this.syncModel.isWithRepresentationInfo,
                generatedPasswordType: this.syncModel.generatedPasswordType,
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    (this.$refs.SyncWindow as any).kendoWidget().close()
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

    selectedMeeting: any = null;

    reportGridSelect(e: any) {
        const grid = e.sender;
        this.selectedMeeting = grid.dataItem(grid.select());
    }

    mounted() {
        this.loadReportDataSource();
    }
} 