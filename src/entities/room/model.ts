export interface Room {
  id: string
  name: string
  players: number
  status: 'open' | 'closed'
  createdAt: string
}
