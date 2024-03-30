<template>
    <div>
        Joining room...
    </div>
</template>

<script>
import socket from '@/utils/socket';

export default {
    name: 'JoinRoom',
    mounted() {
        const roomId = this.$route.params.roomId // access roomId from route parameters
        console.log('Joining room with ID:', roomId);
        const userId = sessionStorage.getItem('userId');
        socket.emit('joinRoom', { roomId, userId, createUser: !userId });
        console.log('Emitted joinRoom event:', { roomId, userId, createUser: !userId });

        // listen for a successful join confirmation event from server
        socket.on('joinConfirmed', () => {
            this.$router.push({ name: 'RoomView', params: { roomId }}); // redirect
        });
    },
};
</script>