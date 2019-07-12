const Router = require("koa2-router");
const Ideas = require('models/ideas');
const Users = require('models/users');
const { Op } = require('sequelize');

const AppModule = require("core/modules/AppModule");

const router = new Router();

const withSession = (ctx, next ) => {
    
    if(!ctx.session.user_id){
        return next();
    }
    
    ctx.body = ctx.request.body.id;
}

const checkAuth = (ctx, next) => {
    const {title, description } = ctx.request.body;
    if(!(title.length > 5 && title.length<40 && description.length>10 && description.length<50)){
       return error(ctx, "invalid data", 400)
    }
    next();
}
const checkIsId = (ctx, next) => {
    const id = Number(ctx.params.id);
    console.log('check 1')
    return  AppModule.checkIsId(id).then(result => {
        console.log('check 2')
        console.log(result);
        if(!result) {
            return error(ctx, "id donot find", 404)
        }else
        next();
    })

}
const error = (ctx, message = "Server error", status = 500) => {
    ctx.status = status;
    ctx.type = "json";
    ctx.body = { success: 0, message: message };
}


router.post('/users', withSession, async ctx =>{
    const { name, password } = ctx.request.body;
    const user = await Users.findOne({
        where: {
            name: {
                [Op.eq]: name,
            },
            
        },
    });
    if(!user){
        ctx.body = {user_id:null}
    }else{
        const id = user.id;
        ctx.session.user_id = id;
        ctx.body={user_id: id};
    }
})

router.get('/logout', async ctx =>{
    ctx.session = null;
    ctx.body = {user_id:null};
})

router.get('/users', async ctx => {
    const users = await Users.findAll();
    ctx.body = users;    
})
router.get('/users/:id', async ctx => {
    const users = await Users.findOne({
        where: {
            id: {
                [Op.eq]: ctx.request.params.id,
            } 
        },
    });
    ctx.body = users;    
})


router.get('/ideas', async ctx => {
    return  AppModule.getIdeas().then((result)=>{
        ctx.body = result; 
    })
})

const checkLogin = (ctx, next) => {
    if(ctx.session.user_id){
        next()
    }
    else 
       ctx.body = {access: "defied"}
}


router.get('/ideas/:id', checkLogin, checkIsId, async ctx => {
    
    const id = Number(ctx.request.params.id);
    return  AppModule.getIdeaId(id).then((result)=>{
        if(!result){
            ctx.body = {access: "denied"}
        }else
            ctx.body = result;
    })
    

      
})
router.delete("/ideas/:id", checkLogin, checkIsId, async ctx => {
    
    const id = Number(ctx.request.params.id);
    return  AppModule.deleteIdeaId(id, ctx.session.user_id).then((result)=>{
        if(!result){
            ctx.body = {access: "denied"}
        }else
            ctx.body = [];
    })
    
});

router.post("/ideas", checkLogin, checkAuth, async ctx => {
    const { title, description} = ctx.request.body;
    return  AppModule.postIdea(title, description, ctx.session.user_id).then((result)=>{
        ctx.body = result;
    })
    
});

router.put("/ideas/:id", checkLogin, checkIsId, checkAuth, async ctx => {
    const { title, description} = ctx.request.body;
    const id = Number(ctx.request.params.id);

    return  AppModule.putIdeaId(title, description, id, ctx.session.user_id).then((result)=>{
        ctx.body = result;
    })
});



module.exports = router;
