<template>
    <div class="rtl">
        <div>
            <div class="container">
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-newspaper"></i>
                                {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Shareholder')}}
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <kendo-tabstrip>
                            <ul>
                                <li class="k-state-active">
                                    <i class="fas fa-user-tag"></i>&nbsp;
                                    {{$CaptionsLibrary.get('Information')+' '+$CaptionsLibrary.get('Shareholder')}}
                                </li>
                                <li>
                                    <i class="fas fa-phone-square"></i>&nbsp;
                                    {{$CaptionsLibrary.get('ContactInfo')}}
                                </li>
                            </ul>
                            <div>
                                <div class="container">
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Name')}}: {{shareholderModel.name}} {{shareholderModel.surname}}
                                    </div>

                                    <div class="form-group break-line">
                                        {{$CaptionsLibrary.get('FatherName')}}: {{shareholderModel.father}}
                                    </div>

                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('CertificateId')}}: {{shareholderModel.cert_no}}
                                    </div>

                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('NationalCode')}}: {{shareholderModel.nat_code}}
                                    </div>

                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('BBSCode')}}: {{shareholderModel.bbs_code}}
                                    </div>

                                    <div class="form-group k-block k-notification-info">
                                        {{$CaptionsLibrary.get('ShareCount')}}: {{new Intl.NumberFormat().format(shareholderModel.share)}}
                                    </div>

                                    <div v-show="shareholderModel.comp_id == '1'" class="form-group" style="color:red">
                                        {{$CaptionsLibrary.get('PayId')}}: {{shareholderModel.pay_id}}
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div class="container">
                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('MobileNumber')}}: {{shareholderModel.mobile}}
                                    </div>

                                    <div class="form-group">
                                        {{$CaptionsLibrary.get('Address')}}: {{shareholderModel.s_address}}
                                    </div>
                                </div>
                            </div>
                        </kendo-tabstrip>
                    </div>
                </div>
                <div v-show="shareholderModel.comp_id == '1'" class="bs-docs-example k-content box600-2">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-scroll"></i>
                                {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('PriorityCertificate')}}
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            {{$CaptionsLibrary.get('CompanyName')}}: {{shareholderModel.company_name}} به شماره ثبت {{shareholderModel.reg_no}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('PreCapAmount')}}: {{new Intl.NumberFormat().format(shareholderModel.pre_cap_amnt)}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('CapAmount')}}: {{new Intl.NumberFormat().format(shareholderModel.pre_cap_amnt+shareholderModel.cap_amnt)}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('CapitalPercent')}}: {{shareholderModel.cap_percent}}%
                        </div>

                        <hr style="width:90%" />

                        <div class="form-group">
                            {{$CaptionsLibrary.get('SpriQunt')}}: {{new Intl.NumberFormat().format(shareholderModel.spri_qunt)}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('SpriAmnt')}}: {{new Intl.NumberFormat().format(shareholderModel.spri_amnt)}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('CreditAmount')}}: {{new Intl.NumberFormat().format(shareholderModel.credit_amnt)}}
                        </div>

                        <div class="form-group">
                            {{$CaptionsLibrary.get('PayAmount')}}: {{new Intl.NumberFormat().format(shareholderModel.pay_amnt)}}
                        </div>

                        <div class="form-group break-line">
                            <kendo-button @click.prevent="priorityPrint" class="k-button k-primary">{{$CaptionsLibrary.get("GetPriorityCertificate")}}</kendo-button>
                        </div>
                    </div>
                </div>

                <div v-show="shareholderModel.comp_id == '2'" class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-scroll"></i>
                                {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('MeetingEntryPaper')}}
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            <label style="text-align:justify;line-height:1.9rem"><input id="getMeetingPaperAgreement" type="checkbox" v-model="formModel.meetingAgreement" />{{$MessagesLibrary.get('ByAcceptingThisCertificateImGoToMeetingOnTime') +' '+ $CaptionsLibrary.get('And') +' '+ $MessagesLibrary.get('RecievingPaperToSubmitStockDepartment') +' '+ shareholderModel.company_name + ' ' + $MessagesLibrary.get('GiveIt') }}.</label>
                        </div>
                        <!--<div class="form-group">
                            <label style="text-align:justify">{{$MessagesLibrary.get('ForMoreInfoPleaseVisitThisPage')}}.</label>
                        </div>-->
                        <div v-show="shareholderModel.link_add_1 != ''" class="k-block k-info-colored" style="direction:ltr;text-align:left">
                            <i class="fa fa-link"></i>&nbsp;&nbsp;<a :href="shareholderModel.link_add_1" target="_blank">{{shareholderModel.link_add_1}}</a>
                        </div>
                        <div v-show="shareholderModel.link_add_2 != ''" class="k-block k-info-colored" style="direction:ltr;text-align:left">
                            <i class="fa fa-link"></i>&nbsp;&nbsp;<a :href="shareholderModel.link_add_2" target="_blank">{{shareholderModel.link_add_2}}</a>
                        </div>
                        <kendo-listview @change="meetingPaperListviewSelect" :selectable="'single'" style="height:103px;padding:10px" :data-source="meetingDatasource" :template="'<div><div class=form-group>نوع مجمع: #:shr_meet_kind_desc#</div><br></div>'">
                        </kendo-listview>
                        <div class="form-group break-line">
                            <kendo-button @click.prevent="meetingPaperPrint" :disabled="!formModel.meetingAgreement || selectedMeetingPaper == null" class="k-button k-primary">{{$CaptionsLibrary.get("GetMeetingEntryPaper")}}</kendo-button>
                        </div>
                    </div>
                </div>
                <div v-show="shareholderModel.comp_id == '2'" class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-scroll"></i>
                                {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Meeting')}}
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <kendo-listview @change="meetingListviewSelect" :selectable="'single'" style="height:300px;padding:10px" :data-source="meetingDatasource" :template="'<div><div class=form-group>نوع مجمع: #:shr_meet_kind_desc#</div><br><div class=form-group>تاریخ مجمع: #:shr_meet_date_formated# &nbsp;&nbsp;&nbsp;&nbsp; زمان برگزاری: #:meet_time#</div><br><div class=form-group>آدرس: #:meet_add#</div><br><br></div>'">
                        </kendo-listview>
                        <div class="form-group">
                            <kendo-button @click.prevent="virtualMeetingEntry" :disabled="selectedMeeting == null" class="k-button k-primary">{{$CaptionsLibrary.get("VirtualMeetingEntry")}}</kendo-button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
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
