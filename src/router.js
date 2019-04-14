import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Setup from "./components/Setup.vue";
import Load from "./components/Load.vue";
import GamePlay from "./components/GamePlay.vue";
import Identify from "./components/Identify.vue";
import SinglePlayer from "./components/SinglePlayer.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/new",
      name: "setup",
      component: Setup
    },
    {
      path: "/load",
      name: "load",
      component: Load
    },
    {
      path: "/game/:gameId/identify",
      name: "identify",
      component: Identify
    },
    {
      path: "/game/:gameId",
      name: "game",
      component: GamePlay
    },
    {
      path: "/game/:gameId/single",
      name: "single",
      component: SinglePlayer
    }
  ]
});
