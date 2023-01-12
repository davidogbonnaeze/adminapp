import BaseService from '/@src/services/base.service'

export class SermonService {
  static createSermon(createSermonDto: any) {
    return BaseService.post('sermon', createSermonDto)
  }

  static getSermons() {
    return BaseService.get('sermon?relations=preacher,series')
  }

  static deleteSermon(sermonId: string) {
    return BaseService.delete(`sermon/${sermonId}`)
  }

  static updateSermon(sermonId: string, payload: any) {
    return BaseService.put(`sermon/${sermonId}`, payload)
  }

  static updateSermonImage(sermonId: string, payload: any) {
    return BaseService.patch(`sermon/${sermonId}/image`, payload)
  }

  static updateSermonAudio(sermonId: string, payload: any) {
    return BaseService.patch(`sermon/${sermonId}/audio`, payload)
  }
}
