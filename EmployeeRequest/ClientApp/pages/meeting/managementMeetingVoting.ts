import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, getNotificationType, ResponseType } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class MeetingManagementQuestions extends Vue {

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    votingModel = {
        svotItem: 0,
        voteNumber: 0
    }

    meetingModel = {
        isShowSendVoteWindow: false,
        isShowVotingWindow: false
    }

    manuModel = {
        isShowSubMenu: false
    }

    votingStartManuModel = {
        isShowSubMenu: false
    }

    filterWindoModel = {
        isShowFilterWindow: false
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

    shareholderSearchModel = {
        shrMeetKind:"",
        shrMeetDate: "",
        natCode: "",
        name: "",
        surname: "",
        father: "",
        certNo: "",
        bbsCode: "",
        shrhKind: ""
    }

    allRealUserDatasource: any = [];

    getAllRealUser() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementVoting/GetFilteredRealUser",
            data: {
                shrMeetKind: this.shareholderSearchModel.shrMeetKind,
                shrMeetDate: this.shareholderSearchModel.shrMeetDate,
                natCode: this.shareholderSearchModel.natCode,
                shrhKind: this.shareholderSearchModel.shrhKind,
                name: this.shareholderSearchModel.name,
                surname: this.shareholderSearchModel.surname,
                father: this.shareholderSearchModel.father,
                bbsCode: this.shareholderSearchModel.bbsCode,
                certNo: this.shareholderSearchModel.certNo,
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 100,
                            data: result.result
                        });
                        this.allRealUserDatasource = dataSource;
                        this.getMeetingShrhVoteSub();
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
                                    : '' #"
                                </i>`);
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

    votingCandidateTemplate() {
        return kendo.template(`<img class=circle-icon src=#: picture #  width=20/> &nbsp; #: desc1 #`);
    }

    toggleVotingStartFlagMenu() {
        if (this.votingStartManuModel.isShowSubMenu == false) {
            this.votingStartManuModel.isShowSubMenu = true;
        } else {
            this.votingStartManuModel.isShowSubMenu = false;
        }
    }

    toggleShareholderSearchMenu() {
        if (this.manuModel.isShowSubMenu == false) {
            this.manuModel.isShowSubMenu = true;
        } else {
            this.manuModel.isShowSubMenu = false;
        }
    }

    ShowFilterWindow() {
        this.getCurrentMeetingByCompanyIdAndDate();
        this.filterWindoModel.isShowFilterWindow = true;
        (this.$refs.shareholderFilterWindow as any).kendoWidget().center().open()
    }

    selectedShareholder: any = null;

    shareholderGridSelect(e: any) {
        debugger;
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

    selectedMeeting: any = null;

    meetingItemChange(e: any) {
        debugger;
        const dropdown = e.sender;
        this.selectedMeeting = dropdown.dataItem(dropdown.select());
        this.shareholderSearchModel.shrMeetKind = this.selectedMeeting.shr_meet_kind;
        this.shareholderSearchModel.shrMeetDate = this.selectedMeeting.shr_meet_date;
    }

    shareholderModel = {};

    meetingShrhVoteSubDatasource: any = [];
    getMeetingShrhVoteSub() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementVoting/GetMeetingShrhVoteSub",
            data: {
                meetKind: this.shareholderSearchModel.shrMeetKind,
                meetDate: this.shareholderSearchModel.shrMeetDate
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

    selectedShrhVoteSub: any = null;

    voteSubDesc = "";

    isShowVoteNumber = true;

    meetingShrhVoteSubGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedShrhVoteSub = grid.dataItem(grid.select());
        this.voteSubDesc = this.selectedShrhVoteSub.desc1;
        this.isShowVoteNumber = this.selectedShrhVoteSub.svot_kind == 3 || this.selectedShrhVoteSub.svot_kind == 5 ? false : true;
        if (this.selectedShrhVoteSub.svot_kind == 3 || this.selectedShrhVoteSub.svot_kind == 5) {
            this.votingModel.voteNumber = 1;
        }
    }




    votingDetalDatasource = new kendo.data.DataSource({});
    totalUsedVoteNumber = 0;
    getVoteListByShrhCode() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementVoting/GetVoteListByShrhCode",
            data: {
                meetKind: this.shareholderSearchModel.shrMeetKind,
                meetDate: this.shareholderSearchModel.shrMeetDate,
                shrhCode: this.selectedShareholder.shrh_code,
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
            url: "/api/ManagementVoting/GetTotalVotingNumber",
            data: {
                meetKind: this.shareholderSearchModel.shrMeetKind,
                meetDate: this.shareholderSearchModel.shrMeetDate,
                svotNo: this.selectedShrhVoteSub.svot_no,
                shrhCode: this.selectedShareholder.shrh_code
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
            url: "/api/ManagementVoting/GetSvotItemBySvotNo",
            data: {
                svotNo: this.selectedShrhVoteSub.svot_no
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
            url: "/api/ManagementVoting/AddShrhVote",
            dataType: "json",
            data: {
                meetKind: this.shareholderSearchModel.shrMeetKind,
                meetDate: this.shareholderSearchModel.shrMeetDate,
                svotNo: this.selectedShrhVoteSub.svot_no,
                svotItemNo: this.votingModel.svotItem,
                vote: this.votingModel.voteNumber,
                shrhCode: this.selectedShareholder.shrh_code

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

    startVoting() {
        this.getVoteListByShrhCode();
        this.getTotalVotingNumber();
        this.meetingModel.isShowVotingWindow = true;
        (this.$refs.votingWindow as any).kendoWidget().center().open()
    }

    RunningVoting() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementVoting/SetVotingStartFlag",
            dataType: "json",
            data: {
                svotNo: this.selectedShrhVoteSub.svot_no,
                votingStartFlag: "1"
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.getMeetingShrhVoteSub();
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    StopVoting() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ManagementVoting/SetVotingStartFlag",
            dataType: "json",
            data: {
                svotNo: this.selectedShrhVoteSub.svot_no,
                votingStartFlag: "2"
            },
            success: result => {
                if (result.ResponseType == ResponseType.Ok) {
                    this.getMeetingShrhVoteSub();
                }
                //@ts-ignore
                this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
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