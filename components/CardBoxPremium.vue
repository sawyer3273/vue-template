<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  isHover: {
    type: Boolean,
    default: true
  },
  nohover: {
    type: Boolean,
    default: false
  },
})
const slots = useSlots()
const componentClass = computed(() => {
  const base = [
   props.class,
   props.isHover ? (props.nohover ? "nft-nohover2": "nft-nohover2"): "nft-nohover"
  ]
  return base
})


</script>

<template>
    <div class=' text-white textWithShadow' :class='componentClass'>
      <div class='main'>
         <slot />
      </div>
    </div>
</template>


<style scopped>

.nft-nohover{
  user-select:none;
  border: 1px solid #ffffff22;
  background-color: #282c34;
  background: linear-gradient(0deg, rgb(0 0 0 / 18%) 0%, rgb(20 34 60 / 50%) 100%);
  box-shadow: 0 7px 20px 5px #00000088;
  border-radius: .7rem;
  overflow: hidden;
  transition: .5s all;
  hr{
    width: 100%;
    border: none;
    border-bottom: 1px solid #88888855;
    margin-top: 0;
  }
  .main{
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  ::before{
    position: fixed;
    content: "";
    box-shadow: 0 0 100px 40px #ffffff08;
    top: -10%;
    left: -100%;
    transform: rotate(-45deg);
    height: 60rem;
    transition: .7s all;
  }
}

.nft-nohover2 {
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  user-select:none;
  border: 1px solid #ffffff22;
  background-color: #282c34;
  background: linear-gradient(0deg, rgb(0 0 0 / 18%) 0%, rgb(20 34 60 / 50%) 100%);
  box-shadow: 0 7px 20px 5px #00000088;
  border-radius: .7rem;
  overflow: hidden;
  transition: .5s all;
  hr{
    width: 100%;
    border: none;
    border-bottom: 1px solid #88888855;
    margin-top: 0;
  }
  .main{
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  ::before{
    position: fixed;
    content: "";
    box-shadow: 0 0 100px 40px #ffffff08;
    top: -10%;
    left: -100%;
    transform: rotate(-45deg);
    height: 60rem;
    transition: .7s all;
  }
}


.nft{
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  user-select:none;
  border: 1px solid #ffffff22;
  background-color: #282c34;
  background: linear-gradient(0deg, rgb(0 0 0 / 18%) 0%, rgb(20 34 60 / 50%) 100%);
  box-shadow: 0 7px 20px 5px #00000088;
  border-radius: .7rem;
  overflow: hidden;
  transition: .5s all;
  hr{
    width: 100%;
    border: none;
    border-bottom: 1px solid #88888855;
    margin-top: 0;
  }
  .main{
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  ::before{
    position: fixed;
    content: "";
    box-shadow: 0 0 100px 40px #ffffff08;
    top: -10%;
    left: -100%;
    transform: rotate(-45deg);
    height: 60rem;
    transition: .7s all;
  }
  &:hover{
    border: 1px solid #ffffff44;
    box-shadow: 0 7px 50px 10px #000000aa;
    transform: scale(1.005);
    filter: brightness(1.3);
    ::before{
      filter: brightness(.5);
      top: -100%;
      left: 200%;
    }
  }
}
</style>