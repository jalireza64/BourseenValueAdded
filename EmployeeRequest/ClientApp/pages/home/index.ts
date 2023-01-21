import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class HomeIndex extends Vue {
   
    formModel = {
        meetingAgreement: false
    }
    shareholderModel = {};
    getShareholderInformation() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetShareholder",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.shareholderModel = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    getMeetingPaperData() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetMeetingPaperData",
            data: {
                shrMeetKind: this.selectedMeetingPaper.shr_meet_kind,
                shrMeetDate: this.selectedMeetingPaper.shr_meet_date
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.shareholderModel = result;
                    debugger;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    meetingDatasource = new kendo.data.DataSource({});
    getCurrentMeetingByCompanyIdAndDate() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetCurrentMeetingByCompanyIdAndDate",
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

    priorityPrint() {
        //this.setPrintFlag()
        this.$router.push({ name: "report", params: { model: JSON.stringify(this.shareholderModel) } });
    }

    meetingPaperPrint() {
        this.setPrintFlag()
    }

    virtualMeetingEntry() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/AddUserToMeeting",
            dataType: "json",
            data: {
                //@ts-ignore
                shrMeetKind: this.selectedMeeting.shr_meet_kind,
                //@ts-ignore
                shrMeetDate: this.selectedMeeting.shr_meet_date,
            },
            success: result => {
                debugger;
                if (result.ResponseType === ResponseType.Ok) {
                    this.$router.push({ name: "meetingindex", params: { model: JSON.stringify(this.selectedMeeting) } });
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    selectedMeeting: any = null;

    meetingListviewSelect(e: any) {
        const listview = e.sender;
        this.selectedMeeting = listview.dataItem(listview.select());
    }

    selectedMeetingPaper: any = null;

    meetingPaperListviewSelect(e: any) {
        const listview = e.sender;
        this.selectedMeetingPaper = listview.dataItem(listview.select());
        this.getMeetingPaperData();
    }

    mounted() {
        $('.app').removeClass('back');
        getCurrentDate((result: any) => {
            this.getShareholderInformation();
            this.getCurrentMeetingByCompanyIdAndDate();
        });
    }

    setPrintFlag() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/setPrintFlag",
            dataType: "json",
            data: {
                //@ts-ignore
                shrh_code: this.shareholderModel.shrh_code,
                ////@ts-ignore
                //comp_id: this.shareholderModel.comp_id,
                shrMeetKind: this.selectedMeetingPaper.shr_meet_kind,
                shrMeetDate: this.selectedMeetingPaper.shr_meet_date
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
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
} 