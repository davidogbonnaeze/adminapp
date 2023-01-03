import BaseService from '/@src/services/base.service'

export class PreacherService {
  static createPreacher(createPreacherDto: any) {
    return BaseService.post('preacher', createPreacherDto)
  }

  static getPreachers() {
    return BaseService.get('preacher?relations=sermons,series,followers')
  }

  static deletePreacher(preacherId: string) {
    return BaseService.delete(`preacher/${preacherId}`)
  }
}
