import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportRptMeetingState extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        shrMeetKind: "",
        shrMeetDate: "",
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

    realData = {};
    virtualData = {};
    allData = {};

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementReport/GetMeetingState",
            dataType: "json",
            data: {
                shrMeetKind: this.model.shrMeetKind,
                shrMeetDate: this.model.shrMeetDate
            },
            success: result => {
                debugger;
                if (result != null) {
                    this.realData = result.realData;
                    this.virtualData = result.virtualData;
                    this.allData = result.allData;

                    this.realAttendeesModel.actual = [];
                    this.realAttendeesModel.actual.push(Math.abs(result.realData.realActualPercent), Math.abs(result.realData.realActualPercent - 100));

                    this.realAttendeesModel.legal = [];
                    this.realAttendeesModel.legal.push(Math.abs(result.realData.realLegalPercent), Math.abs(result.realData.realLegalPercent - 100));

                    this.realAttendeesModel.all = [];
                    this.realAttendeesModel.all.push(Math.abs(result.realData.realTotalPercent), Math.abs(result.realData.realTotalPercent - 100));


                    this.virtualAttendeesModel.actual = [];
                    this.virtualAttendeesModel.actual.push(Math.abs(result.virtualData.virtualActualPercent), Math.abs(result.virtualData.virtualActualPercent - 100));

                    this.virtualAttendeesModel.legal = [];
                    this.virtualAttendeesModel.legal.push(Math.abs(result.virtualData.virtualLegalPercent), Math.abs(result.virtualData.virtualLegalPercent - 100));

                    this.virtualAttendeesModel.all = [];
                    this.virtualAttendeesModel.all.push(Math.abs(result.virtualData.virtualTotalPercent), Math.abs(result.virtualData.virtualTotalPercent - 100));


                    this.allAttendeesModel.actual = [];
                    this.allAttendeesModel.actual.push(Math.abs(result.allData.allActualPercent), Math.abs(result.allData.allActualPercent - 100));

                    this.allAttendeesModel.legal = [];
                    this.allAttendeesModel.legal.push(Math.abs(result.allData.allLegalPercent), Math.abs(result.allData.allLegalPercent - 100));

                    this.allAttendeesModel.all = [];
                    this.allAttendeesModel.all.push(Math.abs(result.allData.allTotalPercent), Math.abs(result.allData.allTotalPercent - 100));

                    (this.$refs.FilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
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

    getMeetingByCompanyIdAndDate() {
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

    realAttendeesModel = {        
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"],
        actual: Array<number>(),
        legal: Array<number>(),
        all: Array<number>(),
    };

    virtualAttendeesModel = {
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"],
        actual: Array<number>(),
        legal: Array<number>(),
        all: Array<number>(),
    };

    allAttendeesModel = {
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"],
        actual: Array<number>(),
        legal: Array<number>(),
        all: Array<number>(),
    };

    mounted() {
        this.getMeetingByCompanyIdAndDate();
    }
} 