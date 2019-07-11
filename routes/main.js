const Router = require("koa2-router");
const Ideas = require('models/ideas');
const Users = require('models/users');
const { Op } = require('sequelize');

const router = new Router();

router.get('/ideas', async ctx => {
    const ideas = await Ideas.findAll({
        include: [{
            model: Users,
            attributes: ['name']
        }],
    });
    ctx.body = ideas;
})


router.get('/ideas/:id', async ctx => {
    const id = Number(ctx.request.params.id);
    const result = await Ideas.findAll({       
        where: {
            id_idea: {
                [Op.eq]: id,
            } 
        },
        include: [{
            model: Users,
            attributes: ['name']
        }],
    })
    ctx.body = result;
})
router.delete("/ideas/:id", async ctx => {
    const id = Number(ctx.request.params.id);
    await Ideas.destroy({       
        where: {
            id_idea: {
                [Op.eq]: id,
            } 
        },
    })
    ctx.body = [];
});
router.post("/singleIdea", async ctx => {
    const { title, description} = ctx.request.body;
    const newIdea = await Ideas.create({title, description});
    
    ctx.body = newIdea
});

router.put("/ideas/:id", async ctx => {
    const { title, description, author, private} = ctx.request.body;
    
    const user = await ctx.db.query(`select * from users where name=$1`, [author]);
    const user_id = user.rows[0].id;
    const id = Number(ctx.request.params.id);
    
    const result = await ctx.db.query(`update ideas SET title=$1, description=$2, private=$3 where id_idea=$4 RETURNING *`, [title, description, private, id]);
    ctx.body = { 
        title,
        author,
        description,
        private,
        id
    }

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
