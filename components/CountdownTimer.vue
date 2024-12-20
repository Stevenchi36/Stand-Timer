<template>
  <div
    class="timer-container"
    :style="{backgroundColor: bgColor}">
    <h1>{{ currentTimer.charAt(0).toUpperCase() + currentTimer.slice(1) }}</h1>
    <p>{{ formattedTime(timeLeft) }}</p>
    <div class="action-buttons">
      <button
        class="text"
        :disabled="!timerRunning && timeLeft === 0"
        @click="toggleTimer">{{ timerRunning ? 'Pause' : 'Start' }}</button>
      <button
        id="next-timer-btn"
        class="text"
        @click="skipTimer">{{ !timerRunning && timeLeft === 0 ? 'Next' : 'Skip' }}</button>
    </div>
  </div>
</template>

<script setup>
import { sitIcon, standIcon, redCircleIcon, blueCircleIcon } from '@/constants/icons';

const props = defineProps( {
  sitTimer: {
    type: Number,
    required: true,
  },
  standTimer: {
    type: Number,
    required: true,
  },
  sitBgColor: {
    type: String,
    required: true,
  },
  standBgColor: {
    type: String,
    required: true,
  },
  notificationsEnabled: {
    type: Boolean,
    default: false,
  },
} );

const timeLeft = ref( props.standTimer * 60 );
const currentTimer = ref( 'stand' );
const timerInterval = ref( null );
const timerRunning = ref( false );
let emojiToggle = false;
let emojiInterval = null;

const bgColor = computed( () => currentTimer.value === 'stand' ? props.standBgColor : props.sitBgColor );

const formattedTime = ( time ) => {
  const minutes = Math.floor( time / 60 );
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const startTimer = () => {
  timerRunning.value = true;
  const currentTimeInMilliseconds = Date.now();
  const timeLeftInMilliseconds = timeLeft.value * 1000;
  const endingTimeInMilliseconds = currentTimeInMilliseconds + timeLeftInMilliseconds;
  timerInterval.value = setInterval( () => {
    if ( Date.now() < endingTimeInMilliseconds ) {
      timeLeft.value = Math.ceil( ( endingTimeInMilliseconds - Date.now() ) / 1000 );
    } else {
      clearInterval( timerInterval.value );
      timeLeft.value = 0;
      timerRunning.value = false;
      startEmojiToggle();
      showNotification();
    }
  }, 500 );
};

const showNotification = () => {
  if ( Notification.permission === 'granted' && props.notificationsEnabled ) {
    new Notification( `${currentTimer.value.charAt( 0 ).toUpperCase() + currentTimer.value.slice( 1 )} Timer Complete`, {
      body: `Your ${currentTimer.value} timer has completed. Visit the page to start the next one.`,
      icon: currentTimer.value === 'stand' ? standIcon : sitIcon,
    } );
  }
};

const toggleTimer = () => {
  if ( timerRunning.value ) {
    timerRunning.value = false;
    clearInterval( timerInterval.value );
  } else {
    startTimer();
  }
};

const skipTimer = () => {
  if ( timerInterval.value ) clearInterval( timerInterval.value );
  if ( currentTimer.value === 'stand' ) {
    currentTimer.value = 'sit';
    timeLeft.value = props.sitTimer * 60;
  } else {
    currentTimer.value = 'stand';
    timeLeft.value = props.standTimer * 60;
  }
  timerRunning.value = false;
};

const startEmojiToggle = () => {
  emojiInterval = setInterval( () => {
    emojiToggle = !emojiToggle;
    useHead( {
      title: `Timer Ended!`,
      link: [
        {
          rel: 'icon',
          hid: 'emoji-icon',
          href: emojiToggle
            ? redCircleIcon
            : blueCircleIcon,
        },
      ],
    } );
  }, 500 );

  const clearEmojiInterval = ( updateHead ) => {
    clearInterval( emojiInterval );
    if ( updateHead ) {
      useHead( {
        title: `${currentTimer.value.charAt( 0 ).toUpperCase() + currentTimer.value.slice( 1 )} - ${formattedTime( timeLeft.value )}`,
        link: [
          {
            rel: 'icon',
            hid: 'emoji-icon',
            href: currentTimer.value === 'stand'
              ? standIcon
              : sitIcon,
          },
        ],
      } );
    }
  };

  document.addEventListener( 'visibilitychange', () => {
    if ( !document.hidden ) {
      clearEmojiInterval( true );
    }
  }, { once: true } );

  document.addEventListener( 'click', ( event ) => {
    // Only update the heading if the button next button wasn't pressed
    clearEmojiInterval( event.target.id === 'next-timer-btn' ? false : true );
  }, { once: true } );
};

watch( [currentTimer, timeLeft], () => {
  useHead( {
    title: `${formattedTime( timeLeft.value )}`,
    link: [
      {
        rel: 'icon',
        hid: 'emoji-icon',
        href: currentTimer.value === 'stand'
          ? standIcon
          : sitIcon,
      },
    ],
  } );
} );

watch( () => props.standTimer, ( newValue, oldValue ) => {
  if ( currentTimer.value === 'stand' && timeLeft.value === oldValue * 60 ) {
    timeLeft.value = props.standTimer * 60;
  }
} );

watch( () => props.sitTimer, ( newValue, oldValue ) => {
  if ( currentTimer.value === 'sit' && timeLeft.value === oldValue * 60 ) {
    timeLeft.value = props.sitTimer * 60;
  }
} );

onUnmounted( () => {
  document.removeEventListener( 'visibilitychange', () => {} );
  document.removeEventListener( 'click', () => {} );
} );
</script>

<style lang="scss" scoped>
  h1, p {
    mix-blend-mode: difference;
  }

  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 2rem;
    @media (prefers-reduced-motion: no-preference) {
      transition: background-color 0.5s;
    }
  }

  .action-buttons button {
    mix-blend-mode: difference;
    margin: 10px;
  }
</style>