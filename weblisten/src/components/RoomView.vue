<template>
  <div>
    <div>
      We are in the room: {{ room ? room.name : 'Loading...' }}
    </div>
    <div v-if="joinLink">
      <input v-model="joinLink" readonly>
      <button @click="copyLink">Copy Link</button>
    </div>
  </div>
</template>

<script>
import socket from '@/utils/socket'; // socket instance import
export default {
  name: 'RoomView',
  data() {
    return {
      room: null, // Initialize room as null
      joinLink: '', // initialize joinLink as empty string
    };
  },
  methods: {
    fetchRoomDetails() {
      const roomId = this.$route.params.roomId;
      this.joinLink = `${window.location.origin}/join/${roomId}`;
      sessionStorage.setItem('joinLink', this.joinLink); // store link in sessionStorage
      socket.emit('requestRoomDetails', { roomId }); // Emit an event to request room details
    },
    copyLink() {
      navigator.clipboard.writeText(this.joinLink)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying link:', err);
        });
    },
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
  },
};
</script>