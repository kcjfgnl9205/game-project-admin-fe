export interface WhoDrewWordPair {
  id: string
  civilianWord: string
  mafiaWord: string
  createdAt: string
  updatedAt: string
}

export interface WhoDrewWordPairRequest {
  civilianWord: string
  mafiaWord: string
}

export interface WhoDrewWordPairBulkRequest {
  pairs: WhoDrewWordPairRequest[]
}

export interface WhoDrewWordPairBulkResponse {
  inserted: number
  skipped: number
}
