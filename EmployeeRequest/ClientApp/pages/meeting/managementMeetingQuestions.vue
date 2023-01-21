<template>
    <div class="rtl page">
        <div class="container-new">
            <div class="bs-docs-example k-content" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-search"></i>
                            {{$CaptionsLibrary.get('Filter')}}
                        </div>
                        <!--<kendo-button style="float:left;margin:2px" class="k-button">
                            <div>
                                <i class="fa fa-bars"></i>
                            </div>
                        </kendo-button>-->
                    </div>
                </div>
                <div class="container">
                    <div class="form-group">
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
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <!--<div class="form-group">
                        <label for="bbsCode">{{$CaptionsLibrary.get("BBSCode")}}</label>
                        <k-input id="bbsCode" v-model="shareholderSearchModel.bbsCode" type="text" class="width-100">
                        </k-input>
                    </div>-->
                    <div class="form-group break-line">
                        <kendo-button @click.prevent="getAllQuestionsPerCompany" class="k-button k-primary">{{$CaptionsLibrary.get("Search")}}</kendo-button>
                    </div>
                </div>
            </div>
            <div class="bs-docs-example k-content box600-2 flex" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="far fa-question-circle"></i>
                            {{$CaptionsLibrary.get('Question')}}
                        </div>
                        <!--<kendo-button style="float:left;margin:2px" class="k-button">
                            <div>
                                <i class="fa fa-bars"></i>
                            </div>
                        </kendo-button>-->
                    </div>
                </div>
                <kendo-listview style="height:310px;" class="k-block k-info-colored width-100" :data-source="allQuestionsDatasource" :template="'<div class=form-group style=text-align:justify;font-weight:bold><label>#: fullname#</label></div><br/><div class=form-group style=text-align:justify><label>#:desc1#</label></div><div class=form-group style=position:absolute;bottom:0;left:7px;color:red><label>#:time#</label></div>'">

                </kendo-listview>
                <kendo-pager :data-source="allQuestionsDatasource"
                             :input="false"
                             :page-sizes="false"
                             :numeric="false"
                             :responsive="true"
                             :info="true">
                </kendo-pager>
            </div>
            </div>
    </div>
</template>

<script lang="ts" src="./managementMeetingQuestions.ts">
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