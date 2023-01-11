import BaseService from '/@src/services/base.service'

export class SermonService {
  static createSermon(createSermonDto: any) {
    return BaseService.post('sermon', createSermonDto)
  }

  static getSermons() {
    return BaseService.get('sermon?relations=preacher,series')
  }

  static deleteSermon(sermonId: string, objectId: string) {
    return BaseService.delete(`sermon/${sermonId}`, { params: { objectId } })
  }

  static updateSermon(sermonId: string, objectId: string, payload: any) {
    return BaseService.put(`sermon/${sermonId}`, payload, { params: { objectId } })
  }

  static updateSermonImage(sermonId: string, objectId: string, payload: any) {
    return BaseService.patch(`sermon/${sermonId}/image`, payload, {
      params: { objectId },
    })
  }

  static updateSermonAudio(sermonId: string, objectId: string, payload: any) {
    return BaseService.patch(`sermon/${sermonId}/audio`, payload, {
      params: { objectId },
    })
  }
}
