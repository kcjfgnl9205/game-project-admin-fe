import { useToastStore } from '@/shared/stores/toast.store'
import { messageFrom } from '@/shared/lib/error-message'

export const useToast = () => {
  const store = useToastStore()

  return {
    success: (message: string) => store.show('success', message),
    error: (e: unknown, fallback = '오류가 발생했어요') => {
      const message = typeof e === 'string' ? e : messageFrom(e, fallback)
      store.show('error', message)
    },
    info: (message: string) => store.show('info', message),
    warning: (message: string) => store.show('warning', message),
    dismiss: (id: number) => store.dismiss(id),
  }
}
