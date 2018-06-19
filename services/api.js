const Axios = require('axios')
const CountryNames = require('countrynames')
const _ = require('lodash')
const RedisClient = require('./redis')
const Moment = require('moment')


const ENDPOINT = {
    MAIN: "/fifa/fixtures"
}

const RedisKey = {
    MAIN: "@ayatmaulana:main"
}

class Api {

    constructor() {
        this.baseUrl = "https://fifa-2018-apis.herokuapp.com"
    }

    async hit(endpoint, params){
        try {
            let isExistInRedis = await this.checkInRedis( RedisKey.MAIN )
            if( isExistInRedis == false ) {
                let hit = await Axios(this.baseUrl + endpoint)       
                let data = hit.data
                await RedisClient.setAsync( RedisKey.MAIN, JSON.stringify(data))
                return hit.data
            }

            return isExistInRedis
        }catch(e) {
            throw new Error(e)
        }

    }

    async checkInRedis(key){
        var reply;
        try{
            reply = await RedisClient.getAsync( key )
            let response = reply ? JSON.parse(reply) : false
            return response

        } catch(e) {
            throw new Error(e)
        } 
    }

    async main(){
        try{
            let getData = await this.hit(ENDPOINT.MAIN)
            let data = getData.data.group_stages
            
            var dataExtract = []
            for ( var key of Object.values(data)){
                dataExtract = [...dataExtract, ...key]
            }

            const newData = _.sortBy(dataExtract, 'datetime')
                .map(item => {
                    if(item.home_team == "England")
                        item.home_team = "United Kingdom"

                    if(item.away_team == "England")
                        item.away_team = "United Kingdom"

                    if(item.home_team == "IR Iran")
                        item.home_team = "Iran"

                    if(item.away_team == "IR Iran")
                        item.away_team = "Iran"

                    if(item.home_team == "Korea Republic")
                        item.home_team = "Korea"

                    if(item.away_team == "Korea Republic")
                        item.away_team = "Korea"

                    return item;
                })
                .map(item => {

                    item.datatime = Moment(item.datatime).format("MMM D, YYYY - hh:mm A")

                item.home_code = CountryNames.getCode(item.home_team)
                item.away_code = CountryNames.getCode(item.away_team)
                return item
            })

            return newData
        }catch(e) {
            throw new Error(e)
        }
    }   

}


module.exports = Api
