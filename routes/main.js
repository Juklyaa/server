const Router = require("koa2-router");
const Response = require("core/Response");
const AppModule = require("core/modules/AppModule");

const router = new Router();

router.get('/ideas', async ctx => {
    const result = await ctx.db.query(`SELECT title, description, private, id_idea id, users.name author
    from ideas 
    INNER JOIN users ON users.id=ideas.user_id `);
    ctx.body = result.rows;
})
router.get('/ideas/:id', async ctx => {
    const id = Number(ctx.request.params.id);
    const result = await ctx.db.query(`select * from ideas where id =$1`,[id]);
    ctx.body = result.rows[0];
})
router.delete("/ideas/:id", async ctx => {
    const id = ctx.request.params.id;
    await ctx.db.query(`delete from ideas where id_idea =$1`,[id]);
    ctx.body = [];
});
router.post("/singleIdea", async ctx => {
    const { title, description, author, private} = ctx.request.body;
    const user = await ctx.db.query(`select * from users where name=$1`, [author]);
    const user_id = user.rows[0].id;
    const result = await ctx.db.query('insert into ideas (title, description, private, user_id) values ($1, $2, $3, $4) RETURNING *', [title, description, private, user_id]);  
    const answer = {
       title, description, author, id: result.rows[0].id_idea
    };
    
    ctx.body = answer;
});

router.put("/ideas/:id", async ctx => {
    const { title, description, author, private} = ctx.request.body;
    const body = ctx.request.body;
      const id = +ctx.params.id;
      database = database.map(item =>{
          if(item.id===id){
              return body;
          }
          return item;
      })
      return Response.json(ctx, body);
});

const checkAuth = (ctx, next) => {
    const body = ctx.request.body;
    console.log(body.title);
    if(!(body.title.length > 10 && body.title.length<40 && body.author.length>10 && body.author.length<50)){
       return Response.error(ctx, "invalid data", 400)
    }
    next();
}
const checkIsId = (ctx, next) => {
    const id = +ctx.params.id;
    const deleteIdea = database.find(item => item.id===id)
    if(!deleteIdea) {
        return Response.error(ctx, "id not find", 404)
    }

    next();
}
const checkLogIn = (ctx, next) => {
    const name = ctx.request.body.name;
    const password = ctx.request.body.password;
    const current = users.find(user => {
        return user.name === name && user.password === password
    });
    
    console.log(current);
    if(!current) {
        return Response.error(ctx, "user not find", 404)
    }
    next();
}

router.get("/logout", ctx => {
    return AppModule.logoutUser(ctx);
});

module.exports = router;
