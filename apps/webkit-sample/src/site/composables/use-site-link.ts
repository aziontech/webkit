import { useRouter } from 'vue-router'

export interface UseSiteLinkReturn {
  isInternal: (href: string) => boolean
  follow: (event: MouseEvent, href: string) => void
}

export function useSiteLink(): UseSiteLinkReturn {
  const router = useRouter()

  const isInternal = (href: string) => href.startsWith('/') && !href.startsWith('//')

  const follow = (event: MouseEvent, href: string) => {
    if (!href || !isInternal(href)) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return
    event.preventDefault()
    router.push(href)
  }

  return { isInternal, follow }
}
