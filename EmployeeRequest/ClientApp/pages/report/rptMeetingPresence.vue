<template>
    <div class="rtl page">
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
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
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="model.shrhKind" @select="shrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="presenceType">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="presenceType" :index="2" v-model="model.presenceType" @select="presenceTypeFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Real")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Virtual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="bbsCode">{{$CaptionsLibrary.get("BBSCode")}}</label>
                    <k-input id="bbsCode" v-model="model.bbsCode" class="width-100" />
                </div>
                <div class="form-group">
                    <label for="shrhCode">{{$CaptionsLibrary.get("IdNumber")}}</label>
                    <k-input id="shrhCode" v-model="model.shrhCode" class="width-100" />
                </div>
                <div class="form-group">
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

                <kendo-grid-column :field="'shrh_code'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'bbs_code'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('BBSCode')"></kendo-grid-column>

                <kendo-grid-column :field="'fullname'"
                                   :width="300"
                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                <kendo-grid-column :field="'kind_desc'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('ShrhKind')"></kendo-grid-column>

                <kendo-grid-column :field="'presence_type_desc'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('PresenceState')"></kendo-grid-column>

                <kendo-grid-column :field="'natCode'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('NationalId')"></kendo-grid-column>

                <kendo-grid-column :field="'time'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Time')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'share'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.share ? kendo.toString(data.share.sum, 'n0') : 0 #`"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptMeetingPresence.ts">
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
        height: calc(100% - 120px) !important;
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
