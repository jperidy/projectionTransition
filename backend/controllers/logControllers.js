const asyncHandler = require('express-async-handler');
const Logs = require('../models/logsModel');

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
    
    const start = req.query.start ? new Date(req.query.start.substring(0,10)) : null;
    const end = req.query.end ? new Date(req.query.end.substring(0,10)) : null;
    const filterType = req.query.type ? { type: req.query.type } : {};
    const filterTarget = req.query.target ? { target: req.query.target } : {};

    if (!start || !end) {
        res.status(400).json({message: 'Error need start and end dates'});
    } else {

        const numberOfDay = (end - start) / (3600 * 24 * 1000 );
        const statictics = [];
        let sum = 0;
        
        for (let incr = 0; incr < Math.ceil(numberOfDay); incr++) {

            start.setUTCHours(0);
            const dayNext = new Date(start);
            dayNext.setUTCDate(dayNext.getUTCDate()+1);

            const filterDate = {
                $and: [
                    {createdAt: { $gte: start }},
                    {createdAt: { $lte: dayNext }}
                ]
            };
            try {
                const result = await Logs.countDocuments({ ...filterType, ...filterTarget, ...filterDate });
                statictics.push({date: start.toISOString(0,10), value: result});
                sum += result;
            } catch (error) {
                res.status(500).json({message: 'error calculating statistics: ' + error});
                return
            }
            start.setUTCDate(start.getUTCDate() + 1);
        }
        res.status(200).json({
            message: 'get statistics',
            type: req.query.type ? req.query.type : 'all',
            target: req.query.target ? req.query.target : 'all',
            start: req.query.start,
            end: req.query.end,
            statistics: statictics,
            sum: sum
        });    
    }
});

// @desc    get statistics
// @route   GET /api/statistics/params
// @access  Private
const getStatisticsParams = asyncHandler(async(req,res) =>{

    
});

module.exports = { logARequest, getStatistics, getStatisticsParams };