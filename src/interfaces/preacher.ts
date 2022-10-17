import { Series } from './series'
import { Sermon } from './sermon'
import { User } from './user'

export interface Preacher {
  id: string
  title: string
  name: string
  bio: string
  image_url: string
  sermons: Sermon[]
  series: Series[]
  followers: User[]
  created_at: Date
  updated_at: Date
}
