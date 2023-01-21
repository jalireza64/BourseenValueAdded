<template>
    <div class="rtl">
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
                            {{$CaptionsLibrary.get('MeetingState')}}
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

            <div class="container">
                <div class="bs-docs-example k-content" v-if="kendoMessages">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                        <div style="float:right;margin:5px">
                            <i class="fa fa-chart-bar"></i>
                            {{$CaptionsLibrary.get('RealAttendees')}}
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Actual')}}: {{new Intl.NumberFormat().format(realData.realActualCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(realData.realActualShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{realData.realActualPercent}}%)
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="realAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="realAttendeesModel.actual"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Legal')}}: {{new Intl.NumberFormat().format(realData.realLegalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(realData.realLegalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{realData.realLegalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="realAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="realAttendeesModel.legal"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            <br />
                            <div class="form-group k-block k-info-colored" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Total')}}: {{new Intl.NumberFormat().format(realData.realTotalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(realData.realTotalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{realData.realTotalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="realAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="realAttendeesModel.all"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bs-docs-example k-content" v-if="kendoMessages">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                        <div style="float:right;margin:5px">
                            <i class="fa fa-chart-bar"></i>
                            {{$CaptionsLibrary.get('VirtualAttendees')}}
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Actual')}}: {{new Intl.NumberFormat().format(virtualData.virtualActualCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(virtualData.virtualActualShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{virtualData.virtualActualPercent}}%)
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="virtualAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="virtualAttendeesModel.actual"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Legal')}}: {{new Intl.NumberFormat().format(virtualData.virtualLegalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(virtualData.virtualLegalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{virtualData.virtualLegalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="virtualAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="virtualAttendeesModel.legal"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            <br />
                            <div class="form-group k-block k-info-colored" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Total')}}: {{new Intl.NumberFormat().format(virtualData.virtualTotalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(virtualData.virtualTotalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{virtualData.virtualTotalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="virtualAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="virtualAttendeesModel.all"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bs-docs-example k-content" v-if="kendoMessages">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                        <div style="float:right;margin:5px">
                            <i class="fa fa-chart-bar"></i>
                            {{$CaptionsLibrary.get('TotalAttendees')}}
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Actual')}}: {{new Intl.NumberFormat().format(allData.allActualCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(allData.allActualShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{allData.allActualPercent}}%)
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="allAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="allAttendeesModel.actual"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            
                            <div class="form-group k-block k-info-colored break-line" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Legal')}}: {{new Intl.NumberFormat().format(allData.allLegalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(allData.allLegalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{allData.allLegalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="allAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="allAttendeesModel.legal"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                            <br />
                            <div class="form-group k-block k-info-colored" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Total')}}: {{new Intl.NumberFormat().format(allData.allTotalCount)}} {{$CaptionsLibrary.get('Shareholder')}}
                                    </div>
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Equivalent')}} {{new Intl.NumberFormat().format(allData.allTotalShares)}} {{$CaptionsLibrary.get('Share')}}
                                    </div>
                                    <div class="form-group">
                                        ({{allData.allTotalPercent}}%)
                                    </div>

                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="allAttendeesModel.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="allAttendeesModel.all"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./rptMeetingState.ts">
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
