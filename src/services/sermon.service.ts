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
}
