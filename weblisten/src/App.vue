<template>
  <div id="app">
    <room-creation v-if="!inRoom" @roomCreated="handleRoomCreated"></room-creation>
    <room-view v-else :room="currentRoom"></room-view>
  </div>
</template>

<script>
import RoomCreation from './components/RoomCreation.vue';
import RoomView from './components/RoomView.vue';

export default {
  components: {
    RoomCreation,
    RoomView,
  },
  data() {
    return {
      inRoom: false,
      currentRoom: null,
    };
  },
  methods: {
    handleRoomCreated(room) {
      this.currentRoom = room;
      this.inRoom = true;
    },
  },
};
</script>
