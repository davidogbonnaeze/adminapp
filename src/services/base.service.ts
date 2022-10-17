import { useApi } from '/@src/composable/useApi'

const api = useApi();

class BaseService {
  static post(url: string, data: any) {
    return api.post(`/${url}`, data)
  }

  static get(url: string) {
    return api.get(`/${url}`)
  }

  static patch(url: string, data: unknown) {
    return api.patch(`/${url}`, data)
  }

  static delete(url: string) {
    return api.delete(`/${url}`)
  }
}

export default BaseService
