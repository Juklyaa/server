const Response = require("core/Response");
let database = require("core/config");

class AppModule {
    async ping(ctx) {
        return Response.text(ctx, "pong");
    }

    async getIdea(ctx) {
        return Response.json(ctx, database);
    }
    async getIdeaId(ctx) {
        const id = +ctx.params.id;
        return Response.json(ctx, database.find((item)=>{
            return item.id===id;
        }));
    }
    async deleteId(ctx) {
        const id = +ctx.params.id;
        database = database.filter(item =>{
            return!(item.id===id)
        })
        
        return Response.json(ctx, {id});

    }
    async postIdea(ctx) {
        const body = ctx.request.body;
        database.push(body);
        return Response.json(ctx, database);      
    }
    async putIdea(ctx) {
        const body = ctx.request.body;
        const id = +ctx.params.id;
        database = database.map(item =>{
            if(item.id===id){
                return body;
            }
            return item;
        })
        return Response.json(ctx, body);
    }
}

module.exports = new AppModule();