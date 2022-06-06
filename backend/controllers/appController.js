const asyncHandler = require('express-async-handler')
const App = require('../models/appModel')

const currentDate = () => {
    let dt = new Date();
    year  = dt.getFullYear();
    month = dt.toLocaleString('en-us', { month: 'short' });
    day = dt.getDate().toString().padStart(2, "0");
    date_now = (month + "-" + day + "-" + year)
    return date_now
}

const getApps = asyncHandler( async (req,res) => {
    const date_now = currentDate() 
    const apps = await App.find({"date" : date_now}).sort({"app" : 1})
 
    App.watch().
        on('change', data => {
            try {
                new_timespan = data.updateDescription["updatedFields"].timespan
                _id = data.documentKey['_id']
                io.emit("Runtime Update", {new_timespan, _id})
            } catch (error) {
                console.log(error)
            }
        });
    
    res.status(200).json(apps)
})

const getDates = asyncHandler(async (req, res) => {
    const date_now = currentDate() 

    var date_list = []
    const apps = await App.find({})
  
    for (const d of apps){
        if (d.date != date_now){
            date_list.push(d.date)
        }
    }

    date_list = [...new Set(date_list)]
    date_list.reverse()    
    res.status(200).json(date_list)
})

const getAppsOnDate = asyncHandler(async(req, res) => {
    const date = req.params.date;
    const apps = await App.find({"date" : date}).sort({"app" : 1})

    if (apps != 0){
        res.status(200).json(apps)
    }else if (typeof apps !== 'undefined' && apps.length === 0) {
        res.sendStatus(404)
    }
})

const getAppData = asyncHandler(async(req, res) => {
    const app = req.params.app
    var apps = await App.find({"app" : app})

    apps = apps.sort((a, b) => (a < b ? 1 : -1))

    App.watch()
        .on('change', data => {
            try {
                new_timespan = data.updateDescription["updatedFields"].timespan
                _id = data.documentKey['_id']
                io.emit("Runtime Update", {new_timespan, _id})
            } catch (error) {
                console.log(error)
            }
        });

    if (apps != 0){
        res.status(200).json(apps)
    }else if (typeof apps !== 'undefined' && apps.length === 0) {
        res.sendStatus(404)
    }
})

const getAllData = asyncHandler(async(req, res) => {
    const apps = await App.find({})
    console.log('test')
    console.log(apps)
    App.watch().
        on('change', data => {
            new_timespan = data.updateDescription["updatedFields"].timespan
            _id = data.documentKey['_id']
            io.emit("Runtime Update", {new_timespan, _id})
        });
    res.status(200).json(apps)
})

module.exports = {
    getApps,
    getDates,
    getAppsOnDate,
    getAppData,
    getAllData
}