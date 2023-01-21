<template>
    <div class="rtl page">
        <div class="container-new">
            <div class="bs-docs-example k-content flex" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-building"></i>
                            {{$CaptionsLibrary.get('MeetingSubject')}}
                        </div>
                        <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleVotingStartFlagMenu">
                            <div>
                                <i class="fa fa-bars"></i>
                            </div>
                        </kendo-button>
                        <kendo-button v-show="votingStartManuModel.isShowSubMenu == true" :disabled="selectedShrhVoteSub == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="RunningVoting">
                            <div>
                                <i class="fa fa-play"></i>
                            </div>
                        </kendo-button>
                        <kendo-button v-show="votingStartManuModel.isShowSubMenu == true" :disabled="selectedShrhVoteSub == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="StopVoting">
                            <div>
                                <i class="fa fa-stop"></i>
                            </div>
                        </kendo-button>
                    </div>
                </div>
                <kendo-grid :data-source="meetingShrhVoteSubDatasource"
                            ref="meetingShrhVoteSub"
                            @change="meetingShrhVoteSubGridSelect"
                            @databinding="meetingShrhVoteSubDataBinding"
                            :resizable="true"
                            :sortable-mode="'multiple'"
                            :sortable-allow-unsort="true"
                            :sortable-show-indexes="true"
                            :column-menu="true"
                            :selectable="true"
                            :filterable="true"
                            :groupable="true"
                            :pageable="true"
                            style="height:383px">

                    <kendo-grid-column :template="`#: ++record #`"
                                       :width="40"></kendo-grid-column>

                    <kendo-grid-column :field="'desc1'"
                                       :width="200"
                                       :title="$CaptionsLibrary.get('Title')"></kendo-grid-column>

                    <kendo-grid-column :field="'voting_start_flag_desc'"
                                       :title="$CaptionsLibrary.get('Status')"></kendo-grid-column>

                </kendo-grid>
            </div>
            <div class="bs-docs-example k-content flex" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-search"></i>
                            {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Shareholder')}}
                        </div>
                        <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleShareholderSearchMenu">
                            <div>
                                <i class="fa fa-bars"></i>
                            </div>
                        </kendo-button>
                        <kendo-button v-show="manuModel.isShowSubMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowFilterWindow">
                            <div>
                                <i class="fa fa-filter"></i>
                            </div>
                        </kendo-button>
                        <kendo-button v-show="manuModel.isShowSubMenu == true" :disabled="selectedShrhVoteSub == null || selectedShareholder == null" style="float:left;margin:2px" class="k-button" @click.prevent="startVoting">
                            <div>
                                <i class="fas fa-vote-yea"></i>
                            </div>
                        </kendo-button>
                        <!--<kendo-button v-show="manuModel.isShowSubMenu == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowPresenceStateWindow">
        <div>
            <i class="fas fa-user-check"></i>
        </div>
    </kendo-button>-->
                    </div>
                </div>

                <kendo-grid :data-source="allRealUserDatasource"
                            ref="shareholderGrid"
                            @change="shareholderGridSelect"
                            @databinding="shareholderGridDataBinding"
                            :resizable="true"
                            :sortable-mode="'multiple'"
                            :sortable-allow-unsort="true"
                            :sortable-show-indexes="true"
                            :column-menu="true"
                            :selectable="true"
                            :filterable="true"
                            :groupable="true"
                            :pageable="true"
                            style="height:383px">

                    <kendo-grid-column :template="`#: ++record #`"
                                       :width="40"></kendo-grid-column>

                    <kendo-grid-column :field="'statusDesc'"
                                       :width="200"
                                       :template="statusDescTemplate()"
                                       :title="$CaptionsLibrary.get('PersonPresentStatus')"></kendo-grid-column>

                    <kendo-grid-column :field="'fullName'"
                                       :width="300"
                                       :template="shareholderKindTemplate()"
                                       :title="$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Shareholder')"></kendo-grid-column>

                    <kendo-grid-column :field="'father'"
                                       :width="120"
                                       :title="$CaptionsLibrary.get('FatherName')"></kendo-grid-column>

                    <kendo-grid-column :field="'cert_no'"
                                       :width="170"
                                       :title="$CaptionsLibrary.get('CertificateId')"></kendo-grid-column>

                    <kendo-grid-column :field="'nat_code'"
                                       :width="120"
                                       :title="$CaptionsLibrary.get('NationalCode')"></kendo-grid-column>

                    <kendo-grid-column :field="'bbs_code'"
                                       :width="130"
                                       :title="$CaptionsLibrary.get('BBSCode')"></kendo-grid-column>

                </kendo-grid>
            </div>
        </div>

        <kendo-window ref="shareholderFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="filterWindoModel.isShowFilterWindow" :modal="true" :width="'90%'">
            <div class="container">
                <div class="form-group break-line">
                    <label for="svotItem">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <kendo-dropdownlist v-model="shareholderSearchModel.shrMeetKind"
                                        id="meetingItem"
                                        ref="meetingItem"
                                        name="meetingItem"
                                        @change="meetingItemChange"
                                        :data-source="meetingDatasource"
                                        :data-text-field="'shr_meet_kind_desc'"
                                        :data-value-field="'shr_meet_kind'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group break-line">
                    <label for="name">{{$CaptionsLibrary.get("Name")}}</label>
                    <k-input id="name" v-model="shareholderSearchModel.name" type="text" class="width-100">
                    </k-input>
                </div>
                <div class="form-group">
                    <label for="surname">{{$CaptionsLibrary.get("Family")}}</label>
                    <k-input id="surname" v-model="shareholderSearchModel.surname" type="text" class="width-100">
                    </k-input>
                </div>
                <div class="form-group">
                    <label for="father">{{$CaptionsLibrary.get("FatherName")}}</label>
                    <k-input id="father" v-model="shareholderSearchModel.father" type="text" class="width-100">
                    </k-input>
                </div>
                <div class="form-group break-line">
                    <label for="certNo">{{$CaptionsLibrary.get("CertificateId")}}</label>
                    <k-input id="certNo" v-model="shareholderSearchModel.certNo" type="text" class="width-100">
                    </k-input>
                </div>
                <div class="form-group">
                    <label for="natCode">{{$CaptionsLibrary.get("NationalCode")}}</label>
                    <kendo-maskedtextbox id="natCode" mask="0000000000" v-model="shareholderSearchModel.natCode" type="text" class="width-100">
                    </kendo-maskedtextbox>
                </div>
                <div class="form-group break-line">
                    <label for="bbsCode">{{$CaptionsLibrary.get("BBSCode")}}</label>
                    <k-input id="bbsCode" v-model="shareholderSearchModel.bbsCode" type="text" class="width-100">
                    </k-input>
                </div>
                <div class="form-group break-line">
                    <label for="shrhKind">{{$CaptionsLibrary.get("Type") +' '+ $CaptionsLibrary.get("Shareholder")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="shareholderSearchModel.shrhKind" @select="shrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="getAllRealUser" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="votingWindow" :title="$CaptionsLibrary.get('Voting')" :visible="meetingModel.isShowVotingWindow" :modal="true">
            <div class="bs-docs-example k-content flex" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-list-ol"></i>
                            {{$CaptionsLibrary.get('VotingList')}}
                        </div>
                        <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="showSendVoteWindow">
                            <div>
                                <i class="fas fa-vote-yea"></i>
                            </div>
                        </kendo-button>
                    </div>
                </div>
                <div class="form-group k-block k-info-colored">
                    {{$CaptionsLibrary.get('TotalVotingRight')}} : {{new Intl.NumberFormat().format(totalVoteNumber)}}&nbsp;&nbsp;&nbsp;&nbsp;{{$CaptionsLibrary.get('Used')}} : {{new Intl.NumberFormat().format(totalUsedVoteNumber)}}&nbsp;&nbsp;&nbsp;&nbsp;{{$CaptionsLibrary.get('Remaining')}} : {{new Intl.NumberFormat().format(totalVoteNumber - totalUsedVoteNumber)}}
                </div>
                <br />
                <div class="form-group">
                    {{$CaptionsLibrary.get('Title')}} : {{voteSubDesc}}
                </div>
                <br />
                <kendo-grid :data-source="votingDetalDatasource"
                            ref="votingDetalGrid"
                            class="voting-grid"
                            :resizable="true"
                            :sortable-mode="'multiple'"
                            :sortable-allow-unsort="true"
                            :sortable-show-indexes="true"
                            :column-menu="true"
                            :selectable="true"
                            :filterable="true"
                            :groupable="true"
                            :pageable="true">


                    <kendo-grid-column :field="'desc1'"
                                       :width="200"
                                       :title="$CaptionsLibrary.get('Title')"></kendo-grid-column>

                    <kendo-grid-column :field="'vote'"
                                       :title="$CaptionsLibrary.get('Vote')"></kendo-grid-column>

                </kendo-grid>
            </div>
        </kendo-window>

        <kendo-window ref="sendingVoteWindow" :title="$CaptionsLibrary.get('Send') +' '+ $CaptionsLibrary.get('Vote')" :visible="meetingModel.isShowSendVoteWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="svotItem">{{$CaptionsLibrary.get("Title")}}</label>
                    <kendo-dropdownlist v-model="votingModel.svotItem"
                                        :template="votingCandidateTemplate()"
                                        id="svotItem"
                                        ref="svotItem"
                                        name="svotItem"
                                        :data-source="svotItems"
                                        :data-text-field="'desc1'"
                                        :data-value-field="'svot_item_no'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group" v-show="isShowVoteNumber">
                    <label for="voteNumber">{{$CaptionsLibrary.get("Vote")}}</label>
                    <kendo-numerictextbox v-model.number="votingModel.voteNumber" class="width-100"
                                          id="voteNumber"
                                          :min="1"
                                          :round="false"
                                          :spinners="true">
                    </kendo-numerictextbox>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="sendingVote" class="k-button k-primary">{{$CaptionsLibrary.get("Send")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
    </div>
</template>

<script lang="ts" src="./managementMeetingVoting.ts">
</script>

<style scoped>
    .captcha-wrapper {
        display: flex;
        align-items: center;
    }

    .panel-bar {
        margin-bottom: 20px;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    /*.container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px,1fr) minmax(600px,2fr));
        grid-gap: 20px;
        padding: 10px;
    }*/

    .container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    @media(min-width: 800px) {

        .container-new {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px,1fr) minmax(600px,2fr));
            grid-gap: 20px;
            padding: 10px;
        }
    }

    .chart-container-one-row {
        display: grid;
        grid-template-columns: repeat(1);
        grid-gap: 20px;
        padding: 10px;
    }

    .form-group span {
        font-weight: bold;
    }

    .profile-photo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 10%;
        border-radius: 50%;
    }

    @media(max-width: 800px) {
        .profile-photo {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 40%;
            border-radius: 50%;
        }
    }
</style>
<style>
    @media(max-width: 1000px) {
        .voting-grid {
            width: 300px;
            height: 300px;
        }
    }
    @media(min-width: 1000px) {
        .voting-grid {
            width: 800px;
            height: 300px;
        }
    }
</style>