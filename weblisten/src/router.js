import Vue from 'vue';
import Router from 'vue-router';
import JoinRoom from './components/JoinRoom';
import RoomView from './components/RoomView';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        // route for joining rooms
        {
            path: '/join/:roomId',
            name: 'JoinRoom',
            component: JoinRoom,
        },
        // route for viewing room
        {
            path: '/room/:roomId',
            name: 'RoomView',
            component: RoomView,
            props: true, // pass route params as props to component
        },
    ],
});