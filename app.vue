<template>
  <div>
    <Settings
      :sit-timer="sitTimer"
      :stand-timer="standTimer"
      :sit-bg-color="sitBgColor"
      :stand-bg-color="standBgColor"
      :notifications-enabled="notificationsEnabled"
      @update:config="updateConfig"
      />
    <CountdownTimer
      :sit-timer="sitTimer"
      :stand-timer="standTimer"
      :sit-bg-color="sitBgColor"
      :stand-bg-color="standBgColor"
      :notifications-enabled="notificationsEnabled"
      />
  </div>
</template>

<script setup>
import { standIcon } from './constants/icons';
useHead( {
  title: 'Stand Timer',
  link: [
    {
      rel: 'icon',
      hid: 'emoji-icon',
      href: standIcon,
    },
  ],
} );

const {
  sitTimer,
  standTimer,
  sitBgColor,
  standBgColor,
  notificationsEnabled,
  saveSettings,
} = useTimerConfig();

const updateConfig = ( config ) => {
  saveSettings( config );
};
</script>

<style lang="scss">
  @use "~/assets/scss/index.scss";
</style>
