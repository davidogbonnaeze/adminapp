import Axios from 'axios'

class BaseService {
  static post(uri: string, data: any) {
    return this.http().post(this.setUri(uri), data)
  }

  static put(uri: string, data: any, params?: any) {
    return this.http().put(this.setUri(uri), data, params)
  }

  static get(uri: string) {
    return this.http().get(this.setUri(uri))
  }

  static patch(uri: string, data: any, params?: any) {
    return this.http().patch(this.setUri(uri), data, params)
  }

  static delete(uri: string, params?: any) {
    return this.http().delete(this.setUri(uri), params)
  }

  static http() {
    return Axios.create()
  }

  static setUri(uri: string) {
    return import.meta.env.VITE_API_BASE_URL + uri
  }
}

export default BaseService
