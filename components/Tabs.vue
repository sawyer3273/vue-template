<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  items: {
    type: [String],
    default: []
  },
  class: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['update:modelValue'])
function onClick(val) {
    emit('update:modelValue', val)
}
</script>

<template>
    <div class='row bg-black rounded pt-1 [box-shadow:_0_2px_7px_rgb(30_117_216)]' :class='class'> 
        <div :class='items.length == 2 ? "col-6" : "col-4"' class='px-1' v-for='item in items'>
            <div @click='onClick(item.id)' class='tab'  :class='item.id == modelValue ? "checked": ""'> <div class='text-oveflow'>{{item.name}} </div> </div>
        </div>
    </div>

</template>

<style >

.tab {
    width: 100%;
    transition: all 0.3s;
    text-align: center;
    color: #e7e9f5;
    display: inline-flex;
    -webkit-box-pack: center;
    padding: 3pt 6pt;
    vertical-align: top;
    justify-content: flex-start;
    background: #333;
    text-transform: uppercase;
    font-weight: 300;
    font-size: 8pt;
    background: #26292c;
    margin-bottom: 0.5px;
    border-radius: 7px 7px 0 0 !important;
    letter-spacing: 0.1666666667em !important;
    background: hsl(232deg 6% 17%);
    cursor: pointer;
    border-bottom: 2.5pt solid #333;
}
.checked {
    color: #00bfff;
    border-color: #00bfff;
}



</style>