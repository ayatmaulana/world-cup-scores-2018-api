const Axios = require('axios')
const CountryNames = require('countrynames')
const _ = require('lodash')
const Collect = require('collect.js')
const RedisClient = require('./redis')
const Moment = require('moment')


const ENDPOINT = {
    MAIN: "/fifa/fixtures",
    GROUP: "/fifa/grouptable"
}

const RedisKey = {
    MAIN: "@ayatmaulana:main",
    GROUP: "@ayatmaulana:group"
}

class Api {

    constructor() {
        this.baseUrl = "https://fifa-2018-apis.herokuapp.com"
    }

    async hit(endpoint, params, redisKey){
        try {
            let isExistInRedis = await this.checkInRedis( redisKey )
            if( isExistInRedis == false ) {
                let hit = await Axios(this.baseUrl + endpoint)       
                let data = hit.data
                await RedisClient.setAsync( redisKey, JSON.stringify(data))
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
            let getData = await this.hit(ENDPOINT.MAIN, {}, RedisKey.MAIN)
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

                    item.datetime = Moment(item.datatime).format("MMM D, YYYY - hh:mm A")

                item.home_code = CountryNames.getCode(item.home_team)
                item.away_code = CountryNames.getCode(item.away_team)
                return item
            })

            return newData
        }catch(e) {
            throw new Error(e)
        }
    }   

    async group(groupName = null){
        try {
            let getData = await this.hit( ENDPOINT.GROUP, {}, RedisKey.GROUP)
            let data = getData.data

            if(groupName)
                data = Collect(data).firstWhere("title", groupName)

            return data
        } catch(e){
            throw new Error(e)
        }
    }

}


module.exports = Api
