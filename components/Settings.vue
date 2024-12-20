<template>
  <div>
    <svg
      @click="openModal"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      style="cursor: pointer;"
    >
      <path d="M19.14,12.94a7.14,7.14,0,0,0,0-1.88l2.11-1.65a.5.5,0,0,0,.12-.63l-2-3.46a.5.5,0,0,0-.61-.22l-2.49,1a7.16,7.16,0,0,0-1.63-.95l-.38-2.65A.5.5,0,0,0,13.75,3H10.25a.5.5,0,0,0-.5.42L9.37,6.07a7.16,7.16,0,0,0-1.63.95l-2.49-1a.5.5,0,0,0-.61.22l-2,3.46a.5.5,0,0,0,.12.63L4.86,11.06a7.14,7.14,0,0,0,0,1.88L2.75,14.59a.5.5,0,0,0-.12.63l2,3.46a.5.5,0,0,0,.61.22l2.49-1a7.16,7.16,0,0,0,1.63.95l.38,2.65a.5.5,0,0,0,.5.42h3.5a.5.5,0,0,0,.5-.42l.38-2.65a7.16,7.16,0,0,0,1.63-.95l2.49,1a.5.5,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.63ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
    </svg>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <form @submit="saveSettings">
          <h2>Settings</h2>
          <div class="form-group">
            <label for="standTimer">Stand Timer (minutes):</label>
            <input type="number" id="standTimer" v-model.number="standTimer" />
          </div>
          <div class="form-group">
            <label for="sitTimer">Sit Timer (minutes):</label>
            <input type="number" id="sitTimer" v-model.number="sitTimer" />
          </div>
          <div class="form-group">
            <label for="standBgColor">Stand Background Color:</label>
            <input type="color" id="standBgColor" v-model="standBgColor" />
          </div>
          <div class="form-group">
            <label for="sitBgColor">Sit Background Color:</label>
            <input type="color" id="sitBgColor" v-model="sitBgColor" />
          </div>
          <div class="form-group">
            <label for="notificationsEnabled">Enable Notifications:</label>
            <input type="checkbox" id="notificationsEnabled" v-model="notificationsEnabled" />
          </div>
          <div class="form-actions">
            <button class="secondary" @click="closeModal">Cancel</button>
            <input class="primary" type="submit" value="Save"/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  sitTimer: {
    type: Number,
    required: true
  },
  standTimer: {
    type: Number,
    required: true
  },
  sitBgColor: {
    type: String,
    required: true
  },
  standBgColor: {
    type: String,
    required: true
  },
  notificationsEnabled: {
    type: Boolean,
    default: false,
  }
});

const showModal = ref(false);
const sitTimer = ref(props.sitTimer);
const standTimer = ref(props.standTimer);
const sitBgColor = ref(props.sitBgColor);
const standBgColor = ref(props.standBgColor);
const notificationsEnabled = ref(props.notificationsEnabled && Notification.permission === 'granted');

const emits = defineEmits(['update:config']);

const refreshDataWithProps = () => {
  sitTimer.value = props.sitTimer;
  standTimer.value = props.standTimer;
  sitBgColor.value = props.sitBgColor;
  standBgColor.value = props.standBgColor;
  notificationsEnabled.value = props.notificationsEnabled && Notification.permission === 'granted';
};

const openModal = () => {
  refreshDataWithProps();
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveSettings = async () => {
  if (Notification.permission !== 'granted' && notificationsEnabled.value) {
    Notification.requestPermission();
  }

  emits('update:config', {
    sitTimer: sitTimer.value,
    standTimer: standTimer.value,
    sitBgColor: sitBgColor.value,
    standBgColor: standBgColor.value,
    notificationsEnabled: notificationsEnabled.value,
  });
  closeModal();
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.modal-content {
  background-color: rgb(41, 41, 41);
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
  z-index: 2;
}

.close {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

svg {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>