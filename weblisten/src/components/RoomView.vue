<template>
    <div>
      We are in the room: {{ room.name }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'RoomView',
    props: ['room'],
  };
  </script>
  