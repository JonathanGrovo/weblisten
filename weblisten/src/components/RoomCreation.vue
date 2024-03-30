<template>
  <div>
    <h2>Create a Room</h2>
    <form @submit.prevent="createRoom">
      <input type="text" v-model="roomName" placeholder="Room Name" required>
      <input type="number" v-model="maxUsers" placeholder="Max Users" required>
      <button type="submit">Create Room</button>
    </form>
  </div>
</template>

<script>
import socket from '@/utils/socket'; // Adjust the path to your WebSocket instance

export default {
  data() {
    return {
      roomName: '',
      maxUsers: 10,
    };
  },
  methods: {
    createRoom() {
      const roomData = {
        name: this.roomName,
        maxUsers: this.maxUsers,
        createUser: true,
        // Add any other room details you need
      };
      socket.emit('createRoom', roomData); // Emit the createRoom event

      // Reset the form fields
      this.roomName = '';
      this.maxUsers = 10;
    },
  },
  mounted() {
    // listen for the roomCreated event
    socket.on('roomCreated', (data) => {
        console.log('Room created:', data.room);
        console.log('User created:', data.user);
        this.$emit('roomCreated', data.room);
        // update the UI, store room and user data etc
    });
    
    // listen for the errorCreatingRoom event
    socket.on('errorCreatingRoom', (errorMessage) => {
        console.error('Error creating room:', errorMessage);
    });
  },
};
</script>

<style scoped>
.room-creation {
  /* Add your styles here */
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
