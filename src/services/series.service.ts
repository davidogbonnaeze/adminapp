import BaseService from '/@src/services/base.service'

export class SeriesService {
  static createSeries(createSeriesDto: any) {
    return BaseService.post('series', createSeriesDto)
  }

  static getSeries() {
    return BaseService.get('series?relations=preacher,sermons,topics,categories')
  }

  static deleteSeries(seriesId: string) {
    return BaseService.delete(`series/${seriesId}`)
  }

  static updateSeries(seriesId: string, payload: any) {
    return BaseService.put(`series/${seriesId}`, payload)
  }

  static updateSeriesImage(seriesId: string, payload: any) {
    return BaseService.patch(`series/${seriesId}/image`, payload)
  }
}
