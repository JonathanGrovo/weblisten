<template>
    <button @click="leaveRoom">Leave Room</button>
</template>

<script>
export default {
    methods: {
        leaveRoom() {
            this.$emit('leaveRoom');
        }
    }
}
</script>