<template>
    <div class="rtl">
        <div>
            <div class="container-new">
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-comment-dots"></i>
                                {{$CaptionsLibrary.get('Question')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="showMeetingCams">
                                <div>
                                    <i class="fas fa-video"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <k-input id="question" v-model="questionString" class="width-100" :placeholder="$CaptionsLibrary.get('Question')" />
                    </div>
                    <br />
                    <div class="form-group break-line">
                        <kendo-button :disabled="questionString.length == 0" @click.prevent="sendingQuestion" class="k-button k-primary">{{$CaptionsLibrary.get("Send")}}</kendo-button>
                    </div>
                    <hr />
                    <div class="form-group break-line">
                        <kendo-listview style="height:228px;" class="k-block k-info-colored" :data-source="questionDatasource" :template="'<div class=form-group style=text-align:justify><label>#:desc1#</label></div><div class=form-group style=position:absolute;bottom:0;left:7px;color:red><label>#:time#</label></div>'">

                        </kendo-listview>
                        <kendo-pager :data-source="questionDatasource"
                                     :input="false"
                                     :page-sizes="false"
                                     :numeric="false"
                                     :responsive="true"
                                     :info="false">
                        </kendo-pager>
                    </div>
                </div>

                <div class="bs-docs-example k-content flex">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-building"></i>
                                {{JSON.parse(model).shr_meet_kind_desc}}
                            </div>
                            <kendo-button :disabled="vote_need == '2'" style="float:left;margin:2px" class="k-button" @click.prevent="startVoting">
                                <div>
                                    <i class="fas fa-vote-yea"></i>
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
                                :pageable="true">

                        <kendo-grid-column :template="`#: ++record #`"
                                           :width="40"></kendo-grid-column>

                        <kendo-grid-column :field="'vote_need_desc'"
                                           :width="140"
                                           :title="$CaptionsLibrary.get('Voting')"></kendo-grid-column>

                        <kendo-grid-column :field="'desc1'"
                                           :title="$CaptionsLibrary.get('Title')"></kendo-grid-column>

                    </kendo-grid>
                    <!--<div class="form-group break-line">
                    <kendo-button @click.prevent="virtualMeetingEntry" class="k-button k-primary">{{$CaptionsLibrary.get("VirtualMeetingEntry")}}</kendo-button>
                </div>-->
                </div>

            </div>
        </div>

        <kendo-window ref="meetingCamsWindow" :title="$CaptionsLibrary.get('Show')" :visible="meetingModel.isShowCamsWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <div class="h_iframe-aparat_embed_frame"> <span style="display: block;padding-top: 57%"></span><iframe scrolling="no" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" :src="meetingModel.aparatLink"></iframe></div>
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

<script lang="ts" src="./index.ts">
</script>

<style scoped>
    .panel-bar {
        margin-bottom: 20px;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px,1fr) minmax(600px,2fr));
        grid-gap: 20px;
        padding: 10px;
    }

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
    .k-grid {
        height: calc(100% - 53px);
    }

    .k-grid-content {
        height: calc(100% - 125px) !important;
    }

    @media(max-width: 800px) {
        .k-grid {
            height: calc(100% - 50px);
        }

        .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
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
<style>
    .h_iframe-aparat_embed_frame {
        position: relative;
    }

        .h_iframe-aparat_embed_frame .ratio {
            display: block;
            width: 100%;
            height: auto;
        }

        .h_iframe-aparat_embed_frame iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
</style>