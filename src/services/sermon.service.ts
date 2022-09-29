import BaseService from "/@src/services/base.service";

export class SermonService{
  static getSermons(){
    return BaseService.get('sermon?relations=preacher,series');
  }
}
