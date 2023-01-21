<template>
    <div class="rtl page">
        <kendo-window ref="MeetingWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowMeetingWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="svotItem">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <kendo-dropdownlist v-model="model.shrMeetKind"
                                        id="meetKindItem"
                                        ref="meetKindItem"
                                        name="meetKindItem"
                                        :data-source="meetKindDatasource"
                                        :data-text-field="'Value'"
                                        :data-value-field="'Key'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group">
                    <label for="date">{{$CaptionsLibrary.get("Date")}}</label>
                    <sv-datepicker v-model="model.shrMeetDate" name="date" id="date"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="time">{{$CaptionsLibrary.get("Time")}}</label>
                    <sv-timepicker v-model="model.time" class="width-100" name="time" id="time"></sv-timepicker>
                </div>
                <div class="form-group">
                    <label for="addreess">{{$CaptionsLibrary.get("Address")}}</label>
                    <k-input id="addreess" v-model="model.addreess" class="width-100" />
                </div>
                <!--<div class="form-group">
                <label for="formName">{{$CaptionsLibrary.get("Title")}}</label>
                <k-input id="formName" v-model="model.formName" class="width-100" />
            </div>-->
                <div class="form-group">
                    <kendo-button @click.prevent="addShrMeeting" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                <div style="position:relative">
                    <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                        <div style="float:right;margin:5px">
                            <i class="far fa-file-alt"></i>
                            {{$CaptionsLibrary.get('Meeting')}}
                        </div>
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowMeetingWindow">
                        <div>
                            <i class="fa fa-plus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" :disabled="selectedMeeting == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="removeShrMeeting">
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

                <kendo-grid-column :field="'meet_add'"
                                   :width="300"
                                   :title="$CaptionsLibrary.get('Address')" 
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'meet_time'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Time')"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./shrMeeting.ts">
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
