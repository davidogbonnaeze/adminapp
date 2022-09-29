import BaseService from "/@src/services/base.service";

export class SeriesService{
  static getSeries(){
    return BaseService.get('series?relations=preacher,sermons,topics,categories')
  }
}
