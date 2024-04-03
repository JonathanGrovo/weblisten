<template>
  <div>
    <div>
      We are in the room: {{ room ? room.name : 'Loading...' }}
    </div>
    <!-- div for the link join -->
    <div v-if="joinLink">
      <input v-model="joinLink" readonly>
      <button @click="copyLink">Copy Link</button>
    </div>
    <!-- div for leave room -->
    <div>
      <LeaveRoomButton @leaveRoom="handleLeaveRoom" />
    </div>
  </div>
</template>

<script>
import socket from '@/utils/socket'; // socket instance import
import LeaveRoomButton from './LeaveRoomButton.vue' // component for leaving room
export default {
  name: 'RoomView',
  components: {
    LeaveRoomButton
  },
  data() {
    return {
      room: null, // Initialize room as null
      joinLink: '', // initialize joinLink as empty string
      userId: null,
      roomId: null
    };
  },
  created() {
    // retrieve the user and room IDs from sessionStorage
    this.userId = sessionStorage.getItem('userId');
    this.roomId = this.$route.params.roomId;
  },
  methods: {
    // for fetching information of the room
    fetchRoomDetails() {
      this.joinLink = `${window.location.origin}/join/${this.roomId}`;
      sessionStorage.setItem('joinLink', this.joinLink); // store link in sessionStorage
      socket.emit('requestRoomDetails', { roomId: this.roomId }); // Emit an event to request room details
    },
    // for copying the link to join the room
    copyLink() {
      navigator.clipboard.writeText(this.joinLink)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying link:', err);
        });
    },
    // for when a user leaves a room
    handleLeaveRoom() {
      console.log(`user ${this.userId} is leaving room ${this.roomId}`);
      // emit the user leaving the room and the room they are leaving
      socket.emit('leaveRoom', { userId: this.userId, roomId: this.room._id });

      // NEED TO HANDLE REDIRECT HERE
    }
  },
  mounted() {
    this.fetchRoomDetails(); // Request room details when the component is mounted

    const storedLink = sessionStorage.getItem('joinLink');
    if (storedLink) {
      this.joinLink = storedLink;
    } else {
      this.joinLink = `${window.location.origin}/join/${sessionStorage.getItem('roomId')}`;
    }

    // Listen for the server response with room details
    socket.on('roomDetails', (data) => {
      console.log('Received room details:', data.room);
      this.room = data.room; // Set the room data
    });
  },
  beforeDestroy() {
    // Remove the listener when the component is destroyed
    socket.off('roomDetails');
    // handles case where the user closes the tab or disconnects
    window.addEventListener('beforeunload', this.handleLeaveRoom);
  },
  destroyed() {
    // clean up the event listener
    window.removeEventListener('beforeunload', this.handleLeaveRoom);
  }
};
</script>