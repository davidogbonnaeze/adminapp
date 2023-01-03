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
}
