import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const Recommend = () => import("../components/recommend/Recommend")
const Singer = () => import ("../components/singer/Singer")
const Rank = () => import ("../components/rank/Rank")
const Search = () => import ("../components/search/Search")
const SingerDetail = () => import("../components/singer/Singer-Detail")
const Disc = () => import("../components/disc/Disc")
const TopList = () => import("../components/top-list/TopList")
const UserCenter = () => import("../components/user-center/UserCenter")
const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path:'/recommend',
    component:Recommend,
    children:[
      {
        path:':id',
        component:Disc
      }
    ]
  },
  {
    path:'/singer',
    component: Singer,
    children:[
      {
        path:':id',
        component:SingerDetail
      }
    ]
  },
  {
    path:'/rank',
    component:Rank,
    children:[{
      path:':id',
      component:TopList
    }]
  },
  {
    path:'/search',
    component:Search
  },
  {
    path:'/user',
    component:UserCenter
  }
]

const router = new VueRouter({
  routes,
  mode:'history',
  base:'/vue_music/'
})

export default router
