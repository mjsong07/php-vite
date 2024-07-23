import  { createRouter,createWebHashHistory } from 'vue-router';
const testvue3 = () => import('../views/testvue3.vue')
const list = () => import('../views/list.vue') 

const routes = [
    { path: '/testvue3', component: testvue3 },  //
    { path: '/list', component: list }, //
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
