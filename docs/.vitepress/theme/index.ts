import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
import './style.css'
import IssueFeedback from './IssueFeedback.vue'
import HeroSection from './HeroSection.vue'
import FeatureSection from './FeatureSection.vue'
import LanguageBanner from './LanguageBanner.vue'

// 根据当前路径找到对应语言的菜单项并加上 active 标记
function markCurrentLang() {
  const path = window.location.pathname
  // 取第一个路径段作为语言前缀
  const match = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//)
  const currentLang = match ? match[1] : 'root'

  // VitePress 语言菜单里 href 是 /<lang>/ 或 /
  const langLinks = document.querySelectorAll('.VPMenuLink a.VPLink')
  langLinks.forEach(link => {
    const a = link as HTMLAnchorElement
    const href = a.getAttribute('href') || ''
    const isRoot = currentLang === 'root' && href === '/'
    const isMatch = currentLang !== 'root' && href === `/${currentLang}/`
    const wrapper = a.closest('.VPMenuLink') as HTMLElement | null
    if (wrapper) {
      wrapper.classList.toggle('is-current-lang', isRoot || isMatch)
    }
  })
}

function isHomePage(path: string): boolean {
  return path === 'index.md' || /^[a-z]{2}(-[A-Z]{2})?\/index\.md$/.test(path)
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => {
        const route = useRoute()
        if (isHomePage(route.data.relativePath)) {
          return [h(HeroSection), h(FeatureSection), h(LanguageBanner)]
        }
        return null
      }
    })
  },
  enhanceApp({ app, router }) {
    app.component('IssueFeedback', IssueFeedback)
    app.component('HeroSection', HeroSection)
    app.component('FeatureSection', FeatureSection)
    app.component('LanguageBanner', LanguageBanner)
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        nextTick(markCurrentLang)
      }
    }
  },
  setup() {
    if (typeof window !== 'undefined') {
      nextTick(markCurrentLang)
    }
  }
} satisfies Theme
