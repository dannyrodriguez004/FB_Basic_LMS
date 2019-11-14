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
                time: (new Date()).getTime(),
                context: context,
                description: description,
            });

        } catch (err) {
            console.error(err);
        }
    }

    async getLogs() {

        let payload = [];

        try {

            let logsRef = await database.ref('/logs/admin/').once('value');

            logsRef.forEach(date => {
                let Day = {date: date.key, logs: []};
                date.forEach( log => {

                    Day.logs.push({
                        id: log.key,
                        user: log.child('user').val(),
                        time: log.child('time').val(),
                        description: log.child('description').val()
                    });
                });
                payload.push(Day);
            });

        } catch(err) {
            console.error(err);
            
        }

        return payload;
    }

}

module.exports = new UtilsService();