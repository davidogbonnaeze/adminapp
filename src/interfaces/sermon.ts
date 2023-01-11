import { Preacher } from '/@src/interfaces/preacher'
import { Listen } from '/@src/interfaces/listens'
import { Likes } from '/@src/interfaces/likes'
import { Series } from '/@src/interfaces/series'
import { Topic } from '/@src/interfaces/topic'
import { Category } from '/@src/interfaces/category'

export interface Sermon {
  id: string
  title: string
  image_url: string
  audio_url: string
  release_date: Date
  duration: number
  preacher_id: string
  preacher: Preacher
  topics: Topic[]
  categories: Category[]
  series_id: string
  series: Series
  listens: Listen[]
  likes: Likes[]
  isLiked?: boolean
  created_at: Date
  updated_at: Date
  objectID: string
}
