const database = require('firebase-admin').database();

class UtilsService {

    constructor() {
    }

    async helloWorld() {
        return "Hello World!";
    }

    async AdminLog(user, context, description) {
        
        try {
            const NOW = new Date();
            //console.log("" + NOW.getMonth() + '_' + NOW.getDay() + '_' + NOW.getFullYear())
            await database.ref('/logs/admin/')
            .child(NOW.toDateString()).push({
                user: user.id,
                context: context,
                description: description,
            });

        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = new UtilsService();