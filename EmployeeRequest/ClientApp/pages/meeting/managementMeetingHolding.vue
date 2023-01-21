<template>
    <div class="rtl page">
        <kendo-window ref="shareholderStatusWindow" :title="$CaptionsLibrary.get('Show')+' '+$CaptionsLibrary.get('Status')" :visible="statusWindowModel.isStatusWindowShown" :modal="true">
            <kendo-grid :data-source="statusGridDataSource"
                        ref="statusGrid"
                        @databinding="statusGridDataBinding"
                        class="status-grid"
                        :column-menu="true"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        style="height:300px"
                        :groupable="true"
                        :scrolable="true">

                <kendo-grid-column :template="`#: ++record #`"
                                   :width="80"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_code'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'statusDesc'"
                                   :width="200"
                                   :template="statusDescTemplate()"
                                   :title="$CaptionsLibrary.get('Status')+' '+$CaptionsLibrary.get('Shareholder')"></kendo-grid-column>

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
                                   :title="$CaptionsLibrary.get('BBSCode')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'share'"
                                   :width="250"
                                   :title="$CaptionsLibrary.get('ShareCount')"
                                   :format="'{0:##,#}'"
                                   :footer-template="`#: data.share ? kendo.toString(data.share.sum, 'n0') : 0 #`"></kendo-grid-column>
            </kendo-grid>

        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                <div style="position:relative">
                    <div style="float:right;margin:5px">
                        <i class="fas fa-newspaper"></i>
                        {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Shareholder')}}
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleShareholderSearchMenu">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.isShowPrintAndPresenceState == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowFilterWindow">
                        <div>
                            <i class="fa fa-filter"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.isShowPrintAndPresenceState == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowPrintAndPresenceStateWindow">
                        <div>
                            <i class="fa fa-print"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.isShowPrintAndPresenceState == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowPresenceStateWindow">
                        <div>
                            <i class="fas fa-user-check"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.isShowPrintAndPresenceState == true" :disabled="selectedShareholder == null || selectedShareholder.status == '3'" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowStatusWindow">
                        <div>
                            <i class="fas fa-certificate"></i>
                        </div>
                    </kendo-button>
                </div>
            </div>
            <kendo-grid :data-source="shareholderSearchDatasource"
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
                        :pageable="true">

                <kendo-grid-column :template="`#: ++record #`"
                                   :width="80"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_code'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'statusDesc'"
                                   :width="200"
                                   :template="statusDescTemplate()"
                                   :title="$CaptionsLibrary.get('Status')+' '+$CaptionsLibrary.get('Shareholder')"></kendo-grid-column>

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
                                   :title="$CaptionsLibrary.get('BBSCode')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'share'"
                                   :width="250"
                                   :title="$CaptionsLibrary.get('ShareCount')"
                                   :format="'{0:##,#}'"
                                   :footer-template="`#: data.share ? kendo.toString(data.share.sum, 'n0') : 0 #`"></kendo-grid-column>

            </kendo-grid>
        </div>

        <kendo-window ref="shareholderFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="filterWindowModel.isShowFilterWindow" :modal="true" :width="'90%'">
            <div class="container">
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
                <div class="form-group">
                    <label for="shrhStatus">{{$CaptionsLibrary.get("Status") +' '+ $CaptionsLibrary.get("Shareholder")}}</label>
                    <kendo-buttongroup id="shrhStatus" :index="2" v-model="shareholderSearchModel.shrhStatus" @select="shrhStatusFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Lawyer")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Person")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="getShareholdersForSearch" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>

        <kendo-window ref="presenceStateWindow" :title="$CaptionsLibrary.get('Checkin')" :visible="presenceStateModel.isShowPrintAndPresenceState" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="svotItem">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <kendo-dropdownlist v-model="presenceStateModel.shrMeetKind"
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
                    <label for="printType">{{$CaptionsLibrary.get("RelativeShare")}}</label>
                    <kendo-buttongroup id="relativeShareType" :index="0" v-model="presenceStateModel.relativeShareType" @select="relativeShareTypeSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("WithoutReletiveShare")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("WithRelativeShare")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="changingPresenceState" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>

        <kendo-window ref="printPaperWindow" :title="$CaptionsLibrary.get('Print')" :visible="presenceStateModel.isShowPrintAndPresenceState" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="printType">{{$CaptionsLibrary.get("Type")}}</label>
                    <kendo-buttongroup id="printType" :index="0" v-model="presenceStateModel.printType" @select="printTypeSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Print")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Print") +' '+ $CaptionsLibrary.get("And") +' '+ $CaptionsLibrary.get("Checkin")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="printType">{{$CaptionsLibrary.get("RelativeShare")}}</label>
                    <kendo-buttongroup id="relativeShareType" :index="0" v-model="presenceStateModel.relativeShareType" @select="relativeShareTypeSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("WithoutReletiveShare")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("WithRelativeShare")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="svotItem">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <kendo-dropdownlist v-model="presenceStateModel.shrMeetKind"
                                        id="meetingItemForPrint"
                                        ref="meetingItemForPrint"
                                        name="meetingItemForPrint"
                                        @change="meetingItemForPrintChange"
                                        :data-source="meetingDatasource"
                                        :data-text-field="'shr_meet_kind_desc'"
                                        :data-value-field="'shr_meet_kind'"
                                        :filter="'contains'"
                                        class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="printPaper" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>

    </div>
</template>

<script lang="ts" src="./managementMeetingHolding.ts">
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
