import {Series} from "/@src/interfaces/series";
import {Sermon} from "/@src/interfaces/sermon";

export interface Topic{
  id: string;
  name: string;
  color: string;
  image_url: string;
  sermons: Sermon[];
  series: Series[];
  created_at: Date;
  updated_at: Date;
}
