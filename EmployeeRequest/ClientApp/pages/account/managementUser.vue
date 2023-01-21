<template>
    <div class="rtl page">
        <kendo-window ref="UserWindow" :title="usersModel.operationTypeDesc" :visible="usersModel.isShowWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="name">{{$CaptionsLibrary.get("Firstname")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="name" v-model="usersModel.name" />
                </div>
                <div class="form-group">
                    <label for="family">{{$CaptionsLibrary.get("Family")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="family" v-model="usersModel.family" />
                </div>
                <div class="form-group">
                    <label for="username">{{$CaptionsLibrary.get("Username")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="username" v-model="usersModel.username" />
                </div>
                <div class="form-group" v-show="usersModel.operationType == 0">
                    <label for="password">{{$CaptionsLibrary.get("Password")}}</label>
                    <div class="password-wrapper">
                        <k-input id="password" v-model="usersModel.password" v-bind:type="usersModel.passwordType" style="width:92%" />
                        <kendo-button v-show="usersModel.passwordType === 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye"></i></kendo-button>
                        <kendo-button v-show="usersModel.passwordType !== 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye-slash"></i></kendo-button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="mobileNo">{{$CaptionsLibrary.get("MobileNumber")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="mobileNo" v-model="usersModel.mobileNo" />
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="operation" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                <div style="position:relative">
                    <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                        <div style="float:right;margin:5px">
                            <i class="fa fa-users"></i>
                            {{$CaptionsLibrary.get('Operation')}}
                        </div>
                    </div>
                    <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                        <div>
                            <i class="fa fa-bars"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showAdd">
                        <div>
                            <i class="fa fa-plus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" :disabled="selectedUser == null" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="remove">
                        <div>
                            <i class="fa fa-minus"></i>
                        </div>
                    </kendo-button>
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        :column-menu="true"
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">
                <kendo-grid-column :field="'name'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Firstname')"></kendo-grid-column>

                <kendo-grid-column :field="'surname'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Family')"></kendo-grid-column>

                <kendo-grid-column :field="'user_id'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Username')"></kendo-grid-column>

                <kendo-grid-column :field="'mobile'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('MobileNumber')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./managementUser.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .chart-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .password-wrapper {
        display: flex;
        align-items: center;
    }

    .password-wrapper button{
        height:2.3rem !important;
        width:2.3rem !important;
    }

    @media(max-width: 800px) {
        .chart-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 20px;
            padding: 10px;
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
</style>
