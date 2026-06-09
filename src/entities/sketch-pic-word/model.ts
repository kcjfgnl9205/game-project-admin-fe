export interface SketchPicWord {
  id: string
  word: string
  createdAt: string
  updatedAt: string
}

export interface SketchPicWordRequest {
  word: string
}

export interface SketchPicWordBulkRequest {
  words: string[]
}

export interface SketchPicWordBulkResponse {
  inserted: number
  skipped: number
}
