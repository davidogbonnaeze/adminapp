import BaseService from '/@src/services/base.service';

export class PreacherService{
  static getPreachers(){
    return BaseService.get('preacher?relations=sermons,series,followers')
  }
}


