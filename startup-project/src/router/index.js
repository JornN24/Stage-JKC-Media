import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/home",
            name: "home",
            component: HomeView,
        },
        {
            path: "/",
            name: "sign in",
            component: () => import("../views/Login.vue"),
        },
        {
            path: "/sign-up",
            name: "sign up",
            component: () => import("../views/Register.vue"),
        },
        {
            path: "/settings",
            name: "Settings",
            component: () => import("../views/Settings.vue"),
        },
    ],
});


export default router;