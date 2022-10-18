<template>
    <VMenu
        ref="menu"
        v-model="menu"
        offset-y
        :left="right"
        tile
        :return-value.sync="range"
        transition="scale-transition"
        :close-on-content-click="false"
        min-width="auto"
        max-width="580px"
    >
        <template #activator="{ on, attrs }">
            <VTextField
                :value="dateRangeText"
                :label="label"
                :hide-details="hideDetails"
                :prepend-icon="prependIcon"
                :prepend-inner-icon="prependInnerIcon"
                v-bind="attrs"
                readonly
                clearable
                :outlined="outlined"
                v-on="on"
                @click:clear="onDateRangeClear"
            />
        </template>
        <VRow
            v-if="windowWidth > 580"
            style="flex-wrap: nowrap; margin: 0 !important;"
            dense
            class="date-range-pickers-row"
        >
            <VCol
                class="p-0"
                cols="auto"
            >
                <VDatePicker
                    ref="leftPicker"
                    v-model="range"
                    style="height: 100%"
                    flat
                    :picker-date.sync="leftPickerDate"
                    no-title
                    :show-current="false"
                    :show-adjacent-months="false"
                    :elevation="0"
                    :first-day-of-week="1"
                    range
                >
                    <VSpacer/>
                </VDatePicker>
            </VCol>
            <VCol
                class="p-0"
                cols="auto"
            >
                <VDatePicker
                    ref="rightPicker"
                    v-model="range"
                    flat
                    :picker-date.sync="rightPickerDate"
                    :show-current="false"
                    :show-adjacent-months="false"
                    :elevation="0"
                    :first-day-of-week="1"
                    no-title
                    range
                >
                    <VSpacer/>
                    <VBtn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                        Cancel
                    </VBtn>
                    <VBtn
                        text
                        color="primary"
                        @click="$refs.menu.save(range)"
                    >
                        OK
                    </VBtn>
                </VDatePicker>
            </VCol>
        </VRow>

        <template
            v-else
        >
            <VDatePicker
                v-model="range"
                flat
                :show-current="false"
                :show-adjacent-months="false"
                :elevation="0"
                :first-day-of-week="1"
                no-title
                range
            >

                <VSpacer></VSpacer>
                <VBtn
                    text
                    color="primary"
                    @click="menu = false"
                >
                    Cancel
                </VBtn>
                <VBtn
                    text
                    color="primary"
                    @click="$refs.menu.save(range)"
                >
                    OK
                </VBtn>
            </VDatePicker>
        </template>


    </VMenu>
</template>

<script>
import moment from "moment";
import {sprintf} from "sprintf-js"


let vm;

const onWindowResize = () => {
    vm.windowWidth = document.body.clientWidth
}

const leftBtnClick = () => {
    let leftPickerDate = vm.leftPickerDate;
    if (leftPickerDate.split('-').length < 3) {
        leftPickerDate += '-01'
    }

    vm.rightPickerDate = moment(leftPickerDate).add(1, 'months').format('YYYY-MM-DD')
}
const rightBtnClick = () => {
    let rightPickerDate = vm.rightPickerDate;
    if (rightPickerDate.split('-').length < 3) {
        rightPickerDate += '-01'
    }
    vm.leftPickerDate = moment(rightPickerDate).subtract(1, 'months').format('YYYY-MM-DD')
}

export default {
    name: "VTwoMonthRangePicker",
    props: {
        label: {
            type: String,
            default: 'Date range'
        },
        outlined: {
            type: Boolean,
            default: false
        },
        hideDetails: {
            type: Boolean,
            default: false
        },
        right: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true
        },
        prependIcon: {
            type: String,
            default: ''
        },
        prependInnerIcon: {
            type: String,
            default: ''
        },
        viewFormat: {
            type: String,
            default: '%s ~ %s'
        },
        viewDateFormat: {
            type: String,
            default: 'YYYY-MM-DD',
        }
    },
    data() {
        return {
            menu: false,
            leftPickerDate: null,
            rightPickerDate: null,
            windowWidth: null,
        }
    },

    computed: {
        dateRangeText() {
            if (this.range[0] == null) {
                return null;
            }
            if (this.range[1] == null) {
                return moment(this.range[0]).format(this.viewDateFormat);
            }
            return sprintf(this.viewFormat,
                moment(this.range[0]).format(this.viewDateFormat),
                moment(this.range[1]).format(this.viewDateFormat)
            );
        },
        range: {
            get() {
                return this.$attrs.value
            },
            set(val) {
                this.$emit('input', this.reSortDates(val));
            }
        }
    },
    mounted() {
        this.windowWidth = document.body.clientWidth;
        window.addEventListener('resize', onWindowResize, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', onWindowResize);
    },
    created() {
        vm = this;
        this.$watch('menu', this.openMenu)
    },
    methods: {
        openMenu(isOpen) {
            if (this.windowWidth < 581) {
                return;
            }
            this.$nextTick(() => isOpen ? this.onOpenMenu() : this.onCloseMenu());
        },

        leftPrevBtn() {
            return this.$refs.leftPicker.$el.querySelector('.v-btn[aria-label="Previous month"]');
        },
        rightNextBtn() {
            return this.$refs.rightPicker.$el.querySelector('.v-btn[aria-label="Next month"]');
        },

        onOpenMenu() {

            if (this.range[0] != null) {
                this.leftPickerDate = this.range[0];
                this.rightPickerDate = moment(this.leftPickerDate).add(1, 'months').format('YYYY-MM-DD');
            } else {
                this.rightPickerDate = moment().add(1, 'months').format('YYYY-MM-DD');
            }

            this.$refs.leftPicker.$el.querySelector('.v-btn[aria-label="Next month"]')?.remove();
            this.$refs.rightPicker.$el.querySelector('.v-btn[aria-label="Previous month"]')?.remove();

            this.leftPrevBtn().addEventListener('click', leftBtnClick, false);
            this.rightNextBtn().addEventListener('click', rightBtnClick, false);
        },

        onCloseMenu() {

            this.leftPrevBtn().removeEventListener('click', leftBtnClick, false);
            this.rightNextBtn().removeEventListener('click', rightBtnClick, false);
            if (this.range[0] != null) {
                if (this.range[1] == null) {
                    this.range.push(moment(this.range[0]).add(1, 'd').format('YYYY-MM-DD'))
                }

                this.range = this.reSortDates(this.range);
            }
            //
            this.$emit('change', {startDate: this.range[0], endDate: this.range[1]})
        },

        reSortDates(range) {
            if (range[1] == null) {
                return range;
            }
            if (moment(range[1]).diff(moment(range[0])) < 0) {
                return [range[1], range[0]];
            }

            return range;
        },

        onDateRangeClear() {
            this.range = [];
            this.$emit('change', {startDate: null, endDate: null})
        }
    }
}
</script>

<style scoped>
.p-0 {
    padding: 0 !important;
}

.datepicker-custom {
    overflow: hidden !important;
}
</style>
<style>

.date-range-pickers-row .v-date-picker-header__value {
    pointer-events: none;
}
</style>
