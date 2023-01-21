import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class HomeManagementIndex extends Vue {
   


    mounted() {
        $('.app').removeClass('back');
        getCurrentDate((result: any) => {
            
        });
    }
} 