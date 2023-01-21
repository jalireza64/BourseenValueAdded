<template>
    <div class="rtl page">
        <kendo-window ref="SyncWindow" :title="$CaptionsLibrary.get('Update')" :visible="model.isShowSyncWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label>{{$CaptionsLibrary.get("ShareholderCount")}}: {{new Intl.NumberFormat().format(spFbShrTransDatasource.shareholderCount)}}</label>
                </div>
                <div class="form-group">
                    <label>{{$CaptionsLibrary.get("ShareCount")}}: {{new Intl.NumberFormat().format(spFbShrTransDatasource.shareholderShareSummary)}}</label>
                </div>
                <div class="form-group break-line">
                    <label for="representation">{{$MessagesLibrary.get("WithRepresentationInfo")}}</label>
                    <kendo-buttongroup id="representation" :index="1" v-model="syncModel.isWithRepresentationInfo" @select="representationSelect">
                        <kendo-buttongroup-button selected-value="true" style="width:100%">{{$CaptionsLibrary.get("Yes")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="false" style="width:100%">{{$CaptionsLibrary.get("No")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <label for="generatedPassword">{{$MessagesLibrary.get("WithGeneratedPassword")}}</label>
                    <kendo-buttongroup id="generatedPassword" :index="3" v-model="syncModel.generatedPasswordType" @select="generatedPasswordSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Unique")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Certificate")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("NationalCode")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="" style="width:100%">{{$CaptionsLibrary.get("No")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="sync" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                <div style="position:relative">
                    <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-database"></i>
                            {{$CaptionsLibrary.get('SeasonSystemGroupSys')}}
                        </div>
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" :disabled="selectedMeeting == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showSyncWindow">
                        <div>
                            <i class="fas fa-database"></i>
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

<script lang="ts" src="./syncFromSeasonSys.ts">
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
