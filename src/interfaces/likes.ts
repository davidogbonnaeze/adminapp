import {Sermon} from "/@src/interfaces/sermon";
import {User} from "/@src/interfaces/user";

export interface Likes{
  id: string;
  sermon_id: string;
  sermon: Sermon;
  user_id: string;
  user: User;
  created_at: Date;
  updated_at: Date;
}
