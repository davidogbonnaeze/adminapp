import BaseService from '/@src/services/base.service'

export class TopicService {
  static createTopic(createTopicDto: any) {
    return BaseService.post('topic', createTopicDto)
  }

  static getTopics() {
    return BaseService.get('topic?relations=series,sermons')
  }

  static deleteTopic(topicId: string) {
    return BaseService.delete(`topic/${topicId}`)
  }

  static updateTopic(topicId: string, payload: any) {
    return BaseService.put(`topic/${topicId}`, payload)
  }
}
