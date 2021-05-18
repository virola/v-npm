import { createServer, Model } from 'miragejs'

function successReponse(value, specKey) {
  const response = {
    code: 200,
  }

  if (specKey) {
    response[specKey] = value
  }
  return response
}

function failResponse(msg, code = 401) {
  return {
    code,
    msg
  }
}

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model
    },

    seeds(server) {
      server.create('user', { name: '管理员', userName: 'admin', password: 'admin123', roles: [ 'admin' ] })
      server.create('user', { name: 'Alice', userName: 'alice', password: 'alice', roles: [ 'member' ] })
    },

    routes() {
      this.pretender.handledRequest = (verb, path, request) => {
        // console.log(request)
        console.log(`Mirage server responded to ${path}`)
      }

      this.namespace = 'api'

      this.post('/login', (schema, request) => {
        // 返回jwt token
        return successReponse('abcdtest1234', 'token')
      })

      this.get('/getInfo', schema => {
        const user = schema.users.findBy({ userName: 'admin' })
        return {
          code: 200,
          user,
          roles: user.roles
        }
      })

      this.get('/users', schema => {
        return {
          code: 200,
          rows: schema.users.all()
        }
      })
    }
  })

  return server
}
