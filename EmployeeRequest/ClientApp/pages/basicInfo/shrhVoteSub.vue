<template>
    <div class="rtl page">
        <kendo-window ref="ShrhVoteSubWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowShrhVoteSubWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="svotItem">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <kendo-dropdownlist v-model="model.shrMeetKind"
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
                <div class="form-group">
                    <label for="printType">{{$CaptionsLibrary.get("VoteNeeded")}}</label>
                    <kendo-buttongroup id="voteNeed" :index="0" v-model="model.voteNeed" @select="voteNeedTypeSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Have")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("HaveNot")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group" v-show="model.voteNeed == 1">
                    <label for="svotKindItem">{{$CaptionsLibrary.get("VotingType")}}</label>
                    <kendo-dropdownlist v-model="model.svotKind"
                                        :index="0"
                                        id="svotKindItem"
                                        ref="svotKindItem"
                                        @change="svotKindChange"
                                        name="svotKindItem"
                                        :data-source="svotKindDatasource"
                                        :data-text-field="'Value'"
                                        :data-value-field="'Key'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group" v-show="model.svotKind==5">
                    <label for="maxItem">{{$CaptionsLibrary.get("Count")}}</label>
                    <kendo-numerictextbox v-model.number="model.maxItem" class="width-100"
                                          id="maxItem"
                                          :min="1"
                                          :round="false"
                                          :spinners="true">
                    </kendo-numerictextbox>
                </div>
                <div class="form-group">
                    <label for="addreess">{{$CaptionsLibrary.get("Title")}}</label>
                    <k-input id="addreess" v-model="model.desc1" class="width-100" />
                </div>
                <!--<div class="form-group">
        <label for="formName">{{$CaptionsLibrary.get("Title")}}</label>
        <k-input id="formName" v-model="model.formName" class="width-100" />
    </div>-->
                <div class="form-group">
                    <kendo-button @click.prevent="addShrhVoteSub" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                <div style="position:relative">
                    <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-file-invoice"></i>
                            {{$CaptionsLibrary.get('MeetingSubject')}}
                        </div>
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowShrhVoteSubWindow">
                        <div>
                            <i class="fa fa-plus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" :disabled="selectedShrhVoteSub == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="removeShrhVoteSub">
                        <div>
                            <i class="fa fa-minus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcel">
                        <div>
                            <i class="fa fa-file"></i>
                        </div>
                    </kendo-button>
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
                        @databinding="reportGridDataBinding"
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
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'shr_meet_kind_desc'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Meeting')"></kendo-grid-column>

                <kendo-grid-column :field="'shr_meet_date_formated'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Date')"></kendo-grid-column>

                <kendo-grid-column :field="'desc1'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Title')"></kendo-grid-column>

                <kendo-grid-column :field="'vote_need_desc'"
                                   :width="120"
                                   :title="$CaptionsLibrary.get('VoteNeeded')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'svot_kind_desc'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('VotingType')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./shrhVoteSub.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }
</style>

<style>
    .k-grid {
        height: calc(100% - 88px);
    }

    .k-grid-content {
        height: calc(100% - 125px) !important;
    }

    @media(max-width: 800px) {
        .k-grid {
            height: calc(100% - 90px);
        }

        .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
</style>
