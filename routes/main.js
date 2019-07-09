const Router = require("koa2-router");
const Response = require("core/Response");
const database = require("core/config");

const AppModule = require("core/modules/AppModule");

const router = new Router();
/*
router.get("/ping", ctx => {
    return AppModule.ping(ctx);
});
*/
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
router.get("/ideas", ctx => {
    return AppModule.getIdea(ctx);
});

router.get("/ideas/:id", checkIsId, ctx => {
    return AppModule.getIdeaId(ctx);
});
  router.delete("/ideas/:id", checkIsId, ctx => {
    return AppModule.deleteId(ctx);
});
  router.post("/singleIdea", checkAuth, ctx => {
    return AppModule.postIdea(ctx) 
});
  router.put("/ideas/:id", checkIsId, checkAuth, ctx => {
    return AppModule.putIdea(ctx);
});

router.get("/user", ctx => {
    return AppModule.getIdea(ctx);
});



module.exports = router;
