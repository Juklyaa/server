const { Client } = require('pg') // https://node-postgres.com/


module.exports = {
  getConnection: async () => {
    const client = new Client({
      user: 'juli',
      password: '123', 
      database: 'IdeasDB',
      port: 5432
    });
    
    await client.connect()
    return client;
  }  
}