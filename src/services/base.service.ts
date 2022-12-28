import Axios from 'axios'

class BaseService {
  static post(uri: string, data: any) {
    return this.http().post(this.setUri(uri), data)
  }

  static put(uri: string, data: any) {
    return this.http().put(this.setUri(uri), data)
  }

  static get(uri: string) {
    return this.http().get(this.setUri(uri))
  }

  static patch(uri: string, data: any) {
    return this.http().patch(this.setUri(uri), data)
  }

  static delete(uri: string) {
    return this.http().delete(this.setUri(uri))
  }

  static http() {
    return Axios.create()
  }

  static setUri(uri: string) {
    return import.meta.env.VITE_API_BASE_URL + uri
  }
}

export default BaseService
