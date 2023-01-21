import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class MeetingIndex extends Vue {

    @Prop()
    model?: any;

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    meetingModel = {
        isShowCamsWindow: false,
        isShowVotingWindow: false,
        isShowSendVoteWindow: false,
        aparatLink: ""
    }

    votingModel = {
        svotItem: 0,
        voteNumber: 0
    }

    selectedShrhVoteSub: any = null;

    meetingShrhVoteSubDatasource : any = [];
    getCurrentMeetingByCompanyIdAndDate() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetMeetingShrhVoteSub",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 7,
                        data: result
                    });
                    this.meetingShrhVoteSubDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    meetingShrhVoteSubDataBinding() {
        var grid = (this.$refs.meetingShrhVoteSub as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    //virtualMeetingEntry() {
    //    this.$router.push({ name: "report", params: { model: JSON.stringify(this.meetingModel) } });
    //}

    vote_need = "2";
    voteSubDesc = "";
    svotNo = 0;

    isShowVoteNumber = true;

    meetingShrhVoteSubGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShrhVoteSub = grid.dataItem(grid.select());
        this.vote_need = this.selectedShrhVoteSub.vote_need;
        this.voteSubDesc = this.selectedShrhVoteSub.desc1;
        this.svotNo = this.selectedShrhVoteSub.svot_no;
        this.isShowVoteNumber = this.selectedShrhVoteSub.svot_kind == 4 || this.selectedShrhVoteSub.svot_kind == 5 ? false : true;
        if (this.selectedShrhVoteSub.svot_kind == 4 || this.selectedShrhVoteSub.svot_kind == 5) {
            this.votingModel.voteNumber = 1;
        }
    }

    startVoting() {
        this.getVoteListByShrhCode();
        this.getTotalVotingNumber();
        this.meetingModel.isShowVotingWindow = true;
        (this.$refs.votingWindow as any).kendoWidget().center().open()
    }

    questionString: string = "";
    sendingQuestion() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/AddQuestion",
            dataType: "json",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date,
                desc1: this.questionString
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.getQuestionsPerPerson();
                    this.questionString = "";
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    questionDatasource = new kendo.data.DataSource({});
    getQuestionsPerPerson() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetQuestionsPerPerson",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 1,
                        data: result,
                        serverPaging: false
                    });
                    this.questionDatasource = dataSource;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showMeetingCams() {
        this.meetingModel.isShowCamsWindow = true;
        (this.$refs.meetingCamsWindow as any).kendoWidget().center().open()
    }

    getAparatLinkForCompany() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetAparatLinkForCompany",
            dataType: "json",
            success: result => {
                if (result != null) {
                    debugger;
                    this.meetingModel.aparatLink = result.link_add_2
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    votingDetalDatasource = new kendo.data.DataSource({});
    totalUsedVoteNumber = 0;
    getVoteListByShrhCode() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetVoteListByShrhCode",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date,
                svotNo: this.selectedShrhVoteSub.svot_no
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 5,
                        data: result,
                        serverPaging: false
                    });
                    this.votingDetalDatasource = dataSource;

                    var sumUsed = 0
                    result.map(function (t: any) {
                        return sumUsed += t.vote
                    });
                    this.totalUsedVoteNumber = sumUsed;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    totalVoteNumber = 0;
    getTotalVotingNumber() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetTotalVotingNumber",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date,
                svotNo: this.selectedShrhVoteSub.svot_no,
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    debugger;
                    this.totalVoteNumber = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showSendVoteWindow() {
        this.getSvotItemBySvotNo();
        this.meetingModel.isShowSendVoteWindow = true;
        (this.$refs.sendingVoteWindow as any).kendoWidget().center().open()
    }

    svotItems = [];
    getSvotItemBySvotNo() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/GetSvotItemBySvotNo",
            data: {
                svotNo: this.svotNo
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.svotItems = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    sendingVote() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Meeting/AddShrhVote",
            dataType: "json",
            data: {
                meetKind: JSON.parse(this.model).shr_meet_kind,
                meetDate: JSON.parse(this.model).shr_meet_date,
                svotNo: this.svotNo,
                svotItemNo: this.votingModel.svotItem,
                vote: this.votingModel.voteNumber

            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.getVoteListByShrhCode();
                    (this.$refs.sendingVoteWindow as any).kendoWidget().close()
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    votingCandidateTemplate() {
        return kendo.template(`<img class=circle-icon src=#: picture #  width=20/> &nbsp; #: desc1 #`);
    }

    mounted() {
        this.getCurrentMeetingByCompanyIdAndDate();
        this.getQuestionsPerPerson();
        this.getAparatLinkForCompany();
    }
} 