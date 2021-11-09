const asyncHandler = require('express-async-handler');
const Logs = require('../models/logsModel');
const config = require('../../config/config.json');
const packageConfig = require('../../package.json');

// @desc    log a request
const logARequest = (type, target) => {
    
    const log = {type, target};
    Logs.create(log)
        //.then(result => console.log('result: ' + result))
        .catch((error) => console.log('error writting log: ' + error));
};


// @desc    get statistics
// @route   GET /api/statistics?start=&end=&type=&target=
// @access  Private
const getStatistics = asyncHandler(async(req,res) =>{
    
    const today = new Date(Date.now() + 1*1000*3600*24);
    const lastWeek = new Date(Date.now() - 7*1000*3600*24);
    let start = req.query.start ? new Date(req.query.start.substring(0,10)) : null;
    let end = req.query.end ? new Date(req.query.end.substring(0,10)) : null;
    const filteredPages = req.query.pages ? req.query.pages.split('-SEP-') : null;
    
    if (!start) start = lastWeek;
    if (!end) end = today;

    // if (!start || !end) {

    //     res.status(400).json({message: 'Error need start and end dates'});
    
    // } else {

        // _ADD 09/11
        //console.log('DEBUG: ', start, end);
        const filterRangeDate = {
            $and: [
                {createdAt: { $gte: start }},
                {createdAt: { $lte: end }}
            ]
        };

        const logs = await Logs.find({...filterRangeDate});
        //console.log('DEBUG', logs.length);
        //console.log('DEBUG', filterRangeDate);
        let targets = logs.map(x => x.target);
        targets = [... new Set(targets)];

        if (filteredPages && filteredPages.length > 0) {
            targets = targets.filter(x => filteredPages.includes(x));
        }
        
        let labels = [];
        let datasets = [];
        
        const numberOfDay = (end - start) / (3600 * 24 * 1000 );
        
        for (let targetItem = 0; targetItem < targets.length; targetItem++) {

            const targetpage = targets[targetItem];
            const filterTarget = { target: targetpage };

            const data = [];
            const backgroundColor = [];
            const borderColor = [];
            const borderWidth = 1;
            const label = targetpage;
            const randomColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

            datasets.push({label, data, backgroundColor, borderColor, borderWidth})
            
            const copyStart = new Date(start);
            copyStart.setUTCHours(0);
            const dayNext = new Date(copyStart);
            
            for (let incr = 0; incr < Math.ceil(numberOfDay); incr++) {
                dayNext.setUTCDate(dayNext.getUTCDate()+1);

                const filterDate = {
                    $and: [
                        {createdAt: { $gte: copyStart }},
                        {createdAt: { $lte: dayNext }}
                    ]
                };
                try {
                    const result = logs.map(x => {
                        if (
                            x.target === filterTarget.target
                            && x.createdAt >= copyStart
                            && x.createdAt <= dayNext
                        ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }).reduce((prev, current) => prev + current);
                    //const result = await Logs.countDocuments({ ...filterTarget, ...filterDate });
                    
                    data.push(Number(result));
                    backgroundColor.push(randomColor);
                    borderColor.push(randomColor);

                    // use for x axis labels
                    if (targetItem === 0) {
                        labels.push(copyStart.toISOString().substring(0,10));
                    }
                } catch (error) {
                    res.status(500).json({message: 'error calculating statistics: ' + error});
                    return;
                }
                copyStart.setUTCDate(copyStart.getUTCDate() + 1);
            }
        }
        res.status(200).json({
            message: 'get statistics',
            type: req.query.type ? req.query.type : 'all',
            target: req.query.target ? req.query.target : 'all',
            start: start, //req.query.start,
            end: end, //req.query.end,
            data: {labels, datasets},
        });    
    // }
});

// @desc    get statistics
// @route   GET /api/statistics/params
// @access  Private
const getStatisticsParams = asyncHandler(async(req,res) =>{

    const logs = await Logs.find().sort({target: 1});
    let targets = logs.map(x => x.target);
    targets = [... new Set(targets)];
    res.status(200).json({message: 'get all targets', data: targets, application: {version: packageConfig.version, mode: config.NODE_ENV} });
    
});

module.exports = { logARequest, getStatistics, getStatisticsParams };