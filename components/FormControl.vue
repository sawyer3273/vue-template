<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main'

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  step: {
    type: String,
    default: '.1'
  },
  autocomplete: {
    type: String,
    default: null
  },
  maxlength: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  inputmode: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  classIcon: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  inputCass: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  required: Boolean,
  borderless: Boolean,
  niceMode: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean
})

const emit = defineEmits(['update:modelValue', 'onChange', 'setRef', 'focus', 'blur'])

function blur() {
   emit('blur')
}

function focus() {
   emit('focus')
}
const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('onChange', value)
  }
})

const inputElClass = computed(() => {
  const base = [
    'px-3 py-2 max-w-full  border-gray-700 w-full',
    'dark:placeholder-gray-400',
    props.niceMode ? '' : 'focus:outline-none rounded',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless || props.niceMode ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
    props.inputCass ? props.inputCass : ''
  ]

  if (props.icon) {
    base.push('pl-10-imp')
  }

  return base
})

const computedType = computed(() => (props.options ? 'select' : props.type))

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-12'))

const mainStore = useMainStore()

const selectEl = ref(null)

const textareaEl = ref(null)

const inputEl = ref(null)

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value)
  } else {
    emit('setRef', inputEl.value)
  }
})

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      inputEl.value.focus()
    } else if (e.key === 'Escape') {
      inputEl.value.blur()
    }
  }

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook)
      mainStore.isFieldFocusRegistered = true
    } else {
      // console.error('Duplicate field focus event')
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook)
    mainStore.isFieldFocusRegistered = false
  })
}
</script>

<template>
  <div :class="computedType === 'select' ? 'min-w-48': ''" class="relative text-black">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="[inputElClass, computedValue ? '': 'text-gray-500']"
    >
      <option v-if='placeholder' value="" disabled selected>{{placeholder}}</option>
      <option v-for="option in options" :key="option.id ?? option" :value="option">
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :required="required"
    />
    <span v-else :class="niceMode ? 'input': ''">
		 <input
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      @input='evt=>computedValue=evt.target.value'
      @focus='focus'
      @blur='blur'
      :name="name"
      :step="step"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
    />
		<span></span>	
	  </span>
   
    <FormControlIcon v-if="icon" :icon="icon" :class='classIcon' :h="controlIconH" />
    <div v-if='error' class='text-xs text-red-500'>{{error}}</div>
  </div>
</template>

<style  lang='scss'>

.input {
  width: 100%;
	position:relative;
	font-size: 1.5em;
	background: linear-gradient(21deg, #008cdaad, #132d94);
	padding: 3px;
	display: inline-block;
	border-radius: 9999em;
	
	*:not(span) {
		position: relative;
		display: inherit;
		border-radius: inherit;
		margin: 0;
		border: none;
		outline: none;
		padding: 0 .325em;
		z-index: 1; 
		
		&:focus {
			box-shadow: inherit !important;
		}
		&:focus + span {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	span {
		transform: scale(.993, .94); // scale it down just a little bit
		transition: transform .5s, opacity .25s;
		opacity: 0; // is hidden by default
		
		position:absolute;
		z-index: 0; // needs to be below the field (would block input otherwise)
		margin:4px; // a bit bigger than .input padding, this prevents background color pixels shining through
		left:0;
		top:0;
		right:0;
		bottom:0;
		border-radius: inherit;
		pointer-events: none; // this allows the user to click through this element, as the shadow is rather wide it might overlap with other fields and we don't want to block those.
		
		// fancy shadow styles
		box-shadow: inset 0 0 0 3px #fff, 0 0 0 4px #fff, 3px -3px 30px #132d94, -3px 3px 30px #008cdaad;
	}
	
}



input {
	font-family: inherit;
	line-height:inherit;
	color:#2e3750;
	min-width:12em;
}

::placeholder {
	color:#cbd0d5;
}

</style>
