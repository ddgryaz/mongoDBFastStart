/* global MongoDb */
global.MongoDb = require('mongodb')

class mongoDBFastStart {
    constructor (config) {
        this.dbSettings = Object.assign({
            host: 'localhost',
            port: 27017
        }, config || {})

        const dbSettings = this.dbSettings

        let creds = ''
        if (dbSettings.user && dbSettings.pwd) {
            creds = encodeURI(dbSettings.user + ':' + dbSettings.pwd) + '@'
        }
        dbSettings.authDb = dbSettings.authDb || dbSettings.db

        if (dbSettings.replica) {
            this.url = 'mongodb://' + creds + dbSettings.replica.members.join(',') + '/' + dbSettings.db + '?authSource=' + dbSettings.authDb + '&replicaSet=' + dbSettings.replica.name
            // this.url += '&readPreference=nearest'
        } else {
            this.url = 'mongodb://' + creds + dbSettings.host + ':' + dbSettings.port + '/' + dbSettings.db + '?authSource=' + dbSettings.authDb + '&connectTimeoutMS=60000'
        }

    }

    connect () {
        const tModule = this
        return new Promise((resolve, reject) => {
            const MongoClient = MongoDb.MongoClient
            MongoClient.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, function (err, client) {
                if (err || !client) {
                    reject(err)
                    return
                }
                tModule.client = client
                tModule.db = client.db(tModule.dbSettings.db)
                resolve(tModule.db)
            })
        })
    }
}

module.exports = mongoDBFastStart
