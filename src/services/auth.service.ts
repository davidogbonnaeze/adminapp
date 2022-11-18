import BaseService from '/@src/services/base.service';

export class AuthService{
  static login(loginDto: any){
    return BaseService.post('auth/login', loginDto)
  }

}
