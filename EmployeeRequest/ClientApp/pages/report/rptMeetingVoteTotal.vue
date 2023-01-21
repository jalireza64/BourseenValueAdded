<template>
    <div class="rtl page">
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true" :width="'90%'">
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
                    <label for="svotItem">{{$CaptionsLibrary.get("Subject")+' '+$CaptionsLibrary.get("Voting")}}</label>
                    <kendo-dropdownlist v-model="model.svotNo"
                                        id="meetingSvotItem"
                                        ref="meetingSvotItem"
                                        name="meetingSvotItem"
                                        :data-source="meetingSvotDatasource"
                                        :data-text-field="'desc1'"
                                        :data-value-field="'svot_no'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group break-line">
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="model.shrhKind" @select="shrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="presenceType">{{$CaptionsLibrary.get("PersonPresentStatus")}}</label>
                    <kendo-buttongroup id="presenceType" :index="2" v-model="model.presenceType" @select="presenceTypeFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Real")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Virtual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="voteValidity">{{$CaptionsLibrary.get("Status") +' '+ $CaptionsLibrary.get("Vote")}}</label>
                    <kendo-buttongroup id="voteValidity" :index="2" v-model="model.voteValidity" @select="voteValidityFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Valid")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("NotValid")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <label for="bbsCode">{{$CaptionsLibrary.get("BBSCode")}}</label>
                    <k-input id="bbsCode" v-model="model.bbsCode" class="width-100" />
                </div>
                <div class="form-group">
                    <label for="shrhCode">{{$CaptionsLibrary.get("IdNumber")}}</label>
                    <k-input id="shrhCode" v-model="model.shrhCode" class="width-100" />
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="showReport" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                <div style="position:relative">
                    <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                        <div style="float:right;margin:5px">
                            <i class="fa fa-chart-bar"></i>
                            {{$CaptionsLibrary.get('MeetingPresence')}}
                        </div>
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowFilter">
                        <div>
                            <i class="fa fa-filter"></i>
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

                <kendo-grid-column :field="'desc1'"
                                   :width="600"
                                   :title="$CaptionsLibrary.get('Title')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'sumTotalVote'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Vote')"
                                   :footer-template="`#: data.sumTotalVote ? kendo.toString(data.sumTotalVote.sum, 'n0') : 0 #`"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptMeetingVoteTotal.ts">
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
        /*height: calc(100% - 45px);*/
        height: calc(100% - 88px);
    }

    .k-grid-content {
        height: calc(100% - 120px) !important;
    }

    @media(max-width: 800px) {
        .k-grid {
            /*height: calc(100% - 50px);*/
            height: calc(100% - 90px);
        }

        .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
</style>
