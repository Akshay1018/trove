export const testConfig = {
  database: {
    url: 'mongodb://localhost:27017/test-db'
  },
  session: {
    secret: 'test-session-secret',
    name: 'test-sid',
    maxAge: 86400000
  }
}; 