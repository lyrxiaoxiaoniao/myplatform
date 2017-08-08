import api from 'src/api'
import config from 'src/config'

export default {
  GET_USERINFO ({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.GET(config.basic.refresh)
      .then(response => {
        if (response.data.errcode === '0000') {
          console.log(1111111)
          const data = response.data.data
          commit('SET_USER_INFO', data)
          commit('SET_TOKEN', response.data.data.token)
        } else {
          commit('SET_USER_INFO', null)
          commit('SET_TOKEN', null)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  }
}
