import { createServer, Model } from 'miragejs'

function successReponse(value = {}) {
  const response = {
    code: 200,
    success: true,
    ...value
  }
  return response
}

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      act: Model
    },

    seeds(server) {
      server.create('user', { name: '管理员', userName: 'admin', password: 'admin123', roles: [ 'admin' ] })
      server.create('user', { name: 'Alice', userName: 'alice', password: 'alice', roles: [ 'member' ] })

      server.create('act', { name: '活动名称1', type: 1, address: '活动地址2', activityTime: Date.now() })
      server.create('act', { name: '活动名称2', type: 2, address: '活动地址2', activityTime: Date.now() })
    },

    routes() {
      this.pretender.handledRequest = (verb, path, request) => {
        // console.log(request)
        console.log(`Mirage server responded to ${path}`)
      }

      this.namespace = 'api'

      this.post('/login', (schema, request) => {
        // 返回jwt token
        return successReponse({
          msg: 'abcdtest1234'
        })
      })

      this.get('/getLoginUserInfo', schema => {
        const user = schema.users.findBy({ userName: 'admin' })
        return successReponse({
          data: user
        })
      })

      this.get('/users', schema => {
        return {
          code: 200,
          rows: schema.users.all()
        }
      })

      this.get('/h5_get_index_data', schema => {
        return successReponse({
          data: {
            balance: 122123,
          }
        })
      })

      // 通用图片上传
      this.post('/common/uploadImage', schema => {
        return successReponse({
          data: 'share/157907104191618370709.jpeg'
        })
      })


      // ====================
      // 活动管理相关CRUD
      // ===================

      this.get('/act/list', schema => {
        return successReponse({
          data: {
            dataList: schema.acts.all().models
          }
        })
      })

      this.get('/act/info',  (schema, request) => {
        // console.log(request)
        const data = schema.acts.find(request.queryParams.id)
        // console.log(data)
        return successReponse({
          data: data
        })
      })

      this.post('/act/add', (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)

        return schema.acts.create(attrs)
      })
    }
  })

  return server
}
