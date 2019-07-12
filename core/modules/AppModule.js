
const Ideas = require('../../models/ideas');
const Users = require('../../models/users');
const { Op } = require('sequelize');


class AppModule {
    async getIdeas () {
        const ideas = await Ideas.findAll({
            include: [{
                model: Users,
                attributes: ['name']
            }],
        });
        return ideas;
    }
    async getIdeaId (id){
        const result = await Ideas.findOne({       
            where: { id },
            include: [{
                model: Users,
                attributes: ['name']
            }],
        })
        return result;
    }
    async deleteIdeaId (id, user_id){
        const result =  await Ideas.destroy({       
            where: {
                id: {
                    [Op.eq]: id,
                }, 
                user_id:{
                    [Op.eq]:user_id
                }
            },
        })
        return result;
    }
    async postIdea(title, description, userId){
        const newIdea = await Ideas.create({title, description, userId});
        return newIdea;
    }
    async putIdeaId(title, description, id, userId){
        const newIdea = await Ideas.update({title, description, userId}, {where: {id}});
        return newIdea;
    }
    async checkIsId(id){

        const result = await Ideas.findOne({       
            where: { id },
        })
        return result;
    }

}

module.exports = new AppModule();