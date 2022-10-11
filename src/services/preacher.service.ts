import BaseService from '/@src/services/base.service';

export class PreacherService{
  static createPreacher(createPreacherDto: any){
    return BaseService.post('preacher', createPreacherDto)
  }

  static getPreachers(){
    return BaseService.get('preacher?relations=sermons,series,followers')
  }
}


