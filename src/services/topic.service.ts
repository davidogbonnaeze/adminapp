import BaseService from "/@src/services/base.service";

export class TopicService{
  static getTopics() {
    return BaseService.get('topic?relations=series,sermons')
  }
}
