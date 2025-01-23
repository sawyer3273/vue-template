<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const props = defineProps({
  additionalData: {
    type: String,//question
  },
  text: {
    type: String,//answer
  },
})

const comparisonResult = computed(() => {
  if (props.additionalData.comparison) {
    let correct = []
    props.additionalData.comparison.split(',').map((one, i) => {
      if (i % 2 != 0){
        correct.push(one)
      }
    })
    let answers = []
    if (props.text && props.text.textAnswer) {
      props.text.textAnswer.split(',').map((one, i) => {
        if (i % 2 != 0){
          answers.push(one)
        }
      })
    }
    let result = ''
    correct.map((one, i) => {
      if (one == answers[i]) {
        result = result + (result ? ", ": "") + '<span class="text-green-600">'+one+'<span>'
      } else {
        result = result + (result ? ", ": "") + '<span class="text-red-600">'+one+'<span>'
      }
    })
    return result
  }
}) 
const orderResult = computed(() => {
  if (props.additionalData.order) {
    let correct = []
    props.additionalData.order.split(',').map((one, i) => {
      if (i % 2 == 0){
        correct.push(one)
      }
    })
    let answers = []
    if (props.text && props.text.textAnswer) {
      props.text.textAnswer.split(',').map((one, i) => {
          answers.push(one)
      })
    }
    let result = ''
    correct.map((one, i) => {
      if (one == answers[i]) {
        result = result + (result ? ", ": "") + '<span class="text-green-600">'+one+'<span>'
      } else {
        result = result + (result ? ", ": "") + '<span class="text-red-600">'+one+'<span>'
      }
    })
    return result
  }
}) 


const manyAnswersResult = computed(() => {
  if (props.additionalData.manyAnswers) {
    let correct = []
    props.additionalData.manyAnswers.split(',').map((one, i) => {
      if (i % 2 != 0){
        correct.push(one)
      }
    })
    let answers = []
    if (props.text && props.text.textAnswer) {
      props.text.textAnswer.split(',').map((one, i) => {
        if (i % 2 != 0){
          answers.push(one)
        }
      })
    }
   
    let total = 0
    let correctCount = 0
    let falseCount = 0
    correct.map((one, i) => {
      if (one == 'true') {
        total++
      }
      if (one == 'true' && answers[i] == 'true') {
        correctCount++
      } else if (one == 'false' && answers[i] == 'true'){
        falseCount++
      }
    })
    return props.additionalData.text +'. <span class="text-green-600">' + correctCount + '/' + total +'</span> ' + (falseCount ? '<span class="text-red-600">('+ falseCount + ')</span> ': '') 
  }
}) 
</script>

<template>
  <div class='text-start'> 
    <div v-if='additionalData.abcd' class=''> 
      <span :class='text && text.isCorrect ? "text-green-600": "text-red-600"'> {{text ? text.textAnswer : 'Нет ответа'}} </span> 
      <span v-if='!text || !text.isCorrect' class='ml-1'>({{additionalData.abcd.split(',')[0]}})</span>
    </div>
    <div v-else-if='additionalData.comparison' class=''> 
      <div v-html='comparisonResult'> </div>
    </div>
    <div v-else-if='additionalData.order' class=''> 
      <div v-html='orderResult'> </div>
    </div>
    <div v-else-if='additionalData.manyAnswers' class=''> 
      <div v-html='manyAnswersResult'> </div>
    </div>
    <div v-else class=''> 
      <template v-if='additionalData.answer2_id'>
        <span v-if='userStore.user.role !== "ADMIN"' :class='text && text.isCorrect1 ? "text-green-600": "text-red-600"'> {{text?.answer ? text?.answer?.word : 'Нет ответа'}}, </span>
        <span v-if='userStore.user.role !== "ADMIN"' :class='text && text.isCorrect2 ? "text-green-600": "text-red-600"'> {{text?.answer2 ? text?.answer2?.word : 'Нет ответа'}} </span>

        <span v-if='!text || !text.isCorrect1 || !text.isCorrect2' class='ml-1'>({{additionalData.answer.word}}, {{additionalData.answer2.word}})</span>
      </template> 
      <template v-else>
        <span v-if='userStore.user.role !== "ADMIN"' :class='text && text.isCorrect ? "text-green-600": "text-red-600"'> {{text ? text?.answer.word : 'Нет ответа'}} </span> 
        <span v-if='!text || !text.isCorrect' class='ml-1'>({{additionalData.answer.word}})</span>
      </template>
    </div>
  </div>
</template>