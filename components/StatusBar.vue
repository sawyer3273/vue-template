<script setup>

defineProps({
  value: {
    type: Number,
    defult: 0
  },
})

</script>

<template>
<div class="stat-levels">
    <div class="stat-1 stat-bar">
      <span class="stat-bar-rating" role="stat-bar" :style="`width: ${value}%;`">{{value}}%</span>
    </div>
    </div>
</template>

<style lang='scss' scoped> 




$default-delay: .25s;
$bars: 3;

.stat-levels {
  box-shadow: inset 0 0 25px rgba(0,0,0,.5);
  padding: 2px;
  border: 1px solid #494a4e;
  border-radius: 10px;
  background: -webkit-linear-gradient(bottom, #444549 0%, #343539 100%);
  background: linear-gradient(#444549 0%, #343539 100%); 
}
@mixin stat-bar($color-dark, $color-light, $direction, $dir-webkit) {
  background-image: -webkit-linear-gradient($dir-webkit, $color-light 0%, $color-light 47%, $color-dark 50%, $color-dark 100%);
  background-image: linear-gradient($direction, $color-light 0%, $color-light 47%, $color-dark 50%, $color-dark 100%);
}

@mixin bar-animation($time, $dimension) {
  visibility: hidden;
  @if $dimension == width {
    width: 0;
    -webkit-animation: animate-width; 
    -moz-animation: animate-width;
    animation: animate-width;
  }
  @if $dimension == height {
    height: 0;
    -webkit-animation: animate-height; 
    -moz-animation: animate-height;
    animation: animate-height;
  }
  animation-timing-function: cubic-bezier(.35,.95,.67,.99);
  -webkit-animation-timing-function: cubic-bezier(.35,.95,.67,.99);
  -moz-animation-timing-function: cubic-bezier(.35,.95,.67,.99);
  animation-duration: $time*2;
  -webkit-animation-duration: $time*2;
  -moz-animation-duration: $time*2;
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
}
@-webkit-keyframes animate-width {
  0% {
    width: 0;
  }
  100% {
    visibility: visible;
  }
}
@-moz-keyframes animate-width {
  0% {
    width: 0;
  }
  100% {
    visibility: visible;
  }
}
@keyframes animate-width {
  0% {
    width: 0;
  }
  100% {
    visibility: visible;
  }
}
@-webkit-keyframes animate-height {
  0% {
    height: 0;
  }
  100% {
    visibility: visible;
  }
}
@-moz-keyframes animate-height {
  0% {
    height: 0;
  }
  100% {
    visibility: visible;
  }
}
@keyframes animate-height {
  0% {
    height: 0;
  }
  100% {
    visibility: visible;
  }
}

.stat-bar {
  background-color: #9295a0;
  box-shadow: inset 0 5px 15px rgba(0,0,0,.6);
  height: 7px;
  overflow: hidden;
  padding: 1px;
  border-radius: 5px;
  margin-left: 0;
  &:last-child {
    margin-bottom: 0;
  }
}
.stat-bar-rating {
  border-radius: 4px;
  float: left;
  width: 0;
  height: 100%;
  font-size: 12px;
  color: white;
  text-align: center;
  text-indent: -9999px;
  background-color: #428bca;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
.stat-1 {
  > .stat-bar-rating {
    @include stat-bar(#cf3a02, #ff4500, 'to right', bottom);
  }
}
// Animation Style
.stat-bar-rating {
  @include bar-animation($default-delay, width);
} 
.stat-bar {
  @for $i from 1 through $bars {
    &:nth-of-type(#{$i}) {
      .stat-bar-rating {
        animation-delay: $default-delay*$i;
        -webkit-animation-delay: $default-delay*$i;
      }
    }
  }
}


</style>
