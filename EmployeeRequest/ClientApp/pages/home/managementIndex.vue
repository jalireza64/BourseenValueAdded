<template>
    <div class="rtl">
        <div>
            <div class="container">
                <!--<div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-newspaper"></i>
                                {{$CaptionsLibrary.get('Specification')+' '+$CaptionsLibrary.get('Shareholder')}}
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">

                        </div>
                    </div>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./managementIndex.ts">
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
