import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notice, NoticeRequest } from '@/entities/notice/model'

const today = () => new Date().toISOString().slice(0, 10)

export const useNoticeStore = defineStore('notice', () => {
  const notices = ref<Notice[]>([
    {
      id: 'N-001',
      title: '서버 점검이 03:00에 예정되어 있습니다.',
      content: '서버 안정성 향상을 위한 정기 점검이 예정되어 있습니다. 점검 중에는 서비스 이용이 제한됩니다.',
      published: true,
      createdAt: '2026-05-21',
    },
    {
      id: 'N-002',
      title: '새 게임 모드가 추가되었습니다.',
      content: '신규 미니게임이 곧 공개됩니다. 많은 관심 부탁드립니다.',
      published: true,
      createdAt: '2026-05-24',
    },
    {
      id: 'N-003',
      title: '비밀번호 정책이 강화되었습니다.',
      content: '보안 강화를 위해 비밀번호 정책이 변경되었습니다. 새로운 비밀번호 규칙을 확인해 주세요.',
      published: true,
      createdAt: '2026-05-19',
    },
  ])

  let nextId = notices.value.length + 1

  const create = (input: NoticeRequest) => {
    notices.value.unshift({
      id: `N-${String(nextId++).padStart(3, '0')}`,
      title: input.title,
      content: input.content,
      published: true,
      createdAt: today(),
    })
  }

  const update = (id: string, input: NoticeRequest) => {
    const target = notices.value.find((n) => n.id === id)
    if (!target) return
    target.title = input.title
    target.content = input.content
  }

  const remove = (id: string) => {
    const index = notices.value.findIndex((n) => n.id === id)
    if (index !== -1) notices.value.splice(index, 1)
  }

  return { notices, create, update, remove }
})
