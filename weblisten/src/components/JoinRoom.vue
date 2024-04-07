<template>
    <div>
        Joining room...
    </div>
</template>

<script>
import socket from '@/utils/socket'; // importing socket instance

export default {
    name: 'JoinRoom',
    mounted() {
        const roomId = this.$route.params.roomId // access roomId from route parameters
        const userId = sessionStorage.getItem('userId'); // access userId from sessionStorage
        // telling server we want to join the room
        socket.emit('joinRoom', { roomId, userId, createUser: !userId });

        // listen for a successful join event from the server
        socket.on('userJoinedRoom', (data) => {
            // if we don't have an existing id for the user
            if (!userId) {
                // sets the user and room ids of newly joining user
                sessionStorage.setItem('userId', data.user._id);
                sessionStorage.setItem('roomId', data.room._id);
                // only redirect if current user is one who joined
                this.$router.push({ name: 'RoomView', params: { roomId } });
            }
        });
    },
};
</script>