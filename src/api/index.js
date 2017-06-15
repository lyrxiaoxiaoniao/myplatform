import axios from 'src/interceptor'
import config from 'src/config'

export default {
  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const url = config.serverURI + uri
    return axios({ method, url, data })
  },

  GET (uri, data = null) {
    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const url = config.serverURI + uri
    return axios.get(url, {
      params: data
    })
  },

  POST (uri, data = null) {
    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    const URL = config.serverURI + uri
    return axios.post(URL, data)
  }
}
