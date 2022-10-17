import {Category} from "/@src/interfaces/category";
import {Topic} from "/@src/interfaces/topic";
import {Sermon} from "/@src/interfaces/sermon";
import {Preacher} from "/@src/interfaces/preacher";

export interface Series {
  id: string;
  title: string;
  image_url: string;
  release_date: Date;
  duration: number;
  preacher_id: string;
  preacher: Preacher;
  sermons: Sermon[];
  topics: Topic[];
  categories: Category[];
  created_at: Date;
  updated_at: Date;
}
