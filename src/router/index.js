import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Welcome from '../components/Welcome.vue'
import ModuleInfo from '../components/ModuleInfo.vue'
import DeployEnv from '../components/DeployEnv.vue'
import ModulePublish from '../components/ModulePublish.vue'
import Images from '../components/Images.vue'
import JobTemplate from '../components/JobTemplate.vue'
import Vmware from '../components/vwm.vue'
import Testyaml from '@/components/YamlEditor/CodeEditor.vue';



Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/moduleinfo', component: ModuleInfo },
      { path: '/deployenv', component: DeployEnv },
      { path: '/modulepublish', component: ModulePublish },
      { path: '/images', component: Images },
      { path: '/JobTemplate', component: JobTemplate },
      { path: '/vwm', component: Vmware },
      { path: '/testyaml', component: Testyaml }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
