<template>
  <div>
    <div>
      We are in the room: {{ room ? room.name : 'Loading...' }}
    </div>
    <div>
      Debug room prop: {{ JSON.stringify(room) }}
    </div>
    <div>
      Debug joinLink prop: {{ joinLink }}
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
      joinLink: this.$route.query.joinLink,
    };
  },
  methods: {
    fetchRoomDetails() {
      const roomId = this.$route.params.roomId;
      socket.emit('requestRoomDetails', { roomId }); // Emit an event to request room details
    },
  },
  mounted() {
    this.fetchRoomDetails(); // Request room details when the component is mounted

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