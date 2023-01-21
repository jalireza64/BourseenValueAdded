import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, getNotificationType, ResponseType } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class MeetingManagementVoting extends Vue {

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    shareholderSearchModel = {
        bbsCode: "",
        shrMeetKind: "",
        shrMeetDate: ""
    }

    allQuestionsDatasource: any = [];

    getAllQuestionsPerCompany() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementQuestions/GetAllQuestionsPerCompany",
            data: {
                shrMeetKind: this.shareholderSearchModel.shrMeetKind,
                shrMeetDate: this.shareholderSearchModel.shrMeetDate
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 1,
                        data: result
                    });
                    this.allQuestionsDatasource = dataSource;
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

    selectedMeeting: any = null;

    meetingItemChange(e: any) {
        const dropdown = e.sender;
        this.selectedMeeting = dropdown.dataItem(dropdown.select());
        this.shareholderSearchModel.shrMeetKind = this.selectedMeeting.shr_meet_kind;
        this.shareholderSearchModel.shrMeetDate = this.selectedMeeting.shr_meet_date;
    }

    intervalId = 0;

    setInterval() {
        var that = this;
        this.intervalId = setInterval(function () {
            debugger;
            that.getAllQuestionsPerCompany();

        }, 5000)
    }

    clearInterval() {
        clearInterval(this.intervalId);
    }

    mounted() {
        $('.app').removeClass('back');
        getCurrentDate((result: any) => {
            this.getCurrentMeetingByCompanyIdAndDate();
            //this.setInterval();
        });
    }
} 