<template>
  <div id="app">
    <router-view></router-view>
    <room-creation v-if="!inRoom && !isJoiningRoom" @roomCreated="handleRoomCreated"></room-creation>
  </div>
</template>

<script>
import RoomCreation from './components/RoomCreation.vue';
import socket from './utils/socket';

export default {
  components: {
    RoomCreation,
  },
  computed: {
    isJoiningRoom() { // for controlling what user sees on room join
      return this.$route.name === 'JoinRoom';
    },
  },
  data() {
    return {
      inRoom: false,
      currentRoom: null,
      joinLink: ``,
    };
  },
  methods: {
    // when a room is created
    handleRoomCreated(room) {
      this.currentRoom = room;
      this.inRoom = true;

      // Define joinLink
      this.joinLink = `${window.location.origin}/join/${room._id}`;

      // sets variables in session
      sessionStorage.setItem('currentRoom', JSON.stringify(room));
      sessionStorage.setItem('joinLink', this.joinLink);

      // navigate the creator to their room
      this.$router.push({ name: 'RoomView', params: { roomId: room._id } });
    },
    // when a room is exited
    handleRoomExit() {
      this.inRoom = false;
      this.currentRoom = null;
      sessionStorage.removeItem('currentRoom');
    },
    // when a room is joined
    handleUserJoinedRoom(data) {

      console.log('Session storage userId:', sessionStorage.getItem('userId'));
      this.currentRoom = data.room;
      this.inRoom = true;
      // setting session data (idk if this is necessary)
      sessionStorage.setItem('currentRoom', JSON.stringify(data.room));
    }
  },
  mounted() {
    const storedRoom = sessionStorage.getItem('currentRoom');
    if (storedRoom) { // recognizing we have a room in localStorage
      console.log('Restoring room from localStorage:', storedRoom);
      this.currentRoom = JSON.parse(storedRoom);
      this.inRoom = true;
      socket.emit('reconnectRoom', this.currentRoom.createdBy);
    }

    // listens for server telling us restoring room state was a success
    socket.on('restoreRoomState', (data) => {
      console.log('Room state restored:', data);
      this.currentRoom = data.room;
      this.inRoom;
    });

    // listens for server telling us a user is joining the room
    socket.on('userJoinedRoom', this.handleUserJoinedRoom);
  },
  // before destroying websocket connection
  beforeDestroy() {
    socket.off('restoreRoomState');
    socket.off('userJoinedRoom');
  }
};
</script>
