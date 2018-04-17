const itc = require('itunesconnectanalytics')


exports.queryHandler = (authorizer, app, type, time, timetype, measures) => {
    const timeKey = 'time'
    const dimension = ({}).dimension
    const analyticsQuery = itc.AnalyticsQuery[type](app, {'measures':measures, 'frequency': itc.frequency.months})[timeKey](time,timetype)
    authorizer().request(analyticsQuery, function(error, result) {
      if (error || !result.results) {
        // TODO: smarter retry
        instance = authorizer()
        console.log(result)
      } else {
        const data = {}
        result.results.forEach((groupResult) => {
          groupResult.data.forEach((row) => {
            if (dimension) {
              row[dimension] = groupResult.group.title
            }
            const key = ['date', dimension].map(k => row[k]).join('')
            data[key] = Object.assign({}, data[key], row)
          })
        })
        const rows = Object.values(data)

        const valuesByColumn = {}
        rows.forEach((row) => {
          Object.entries(row).forEach(([ key, value ]) => {
            valuesByColumn[key] = [ ...(valuesByColumn[key] || []), value ]
          })
        })
        const columns = Object.entries(valuesByColumn).map(([ col, values ]) => {
          let type = 'string'
          if (values.every(v => typeof(v) === 'number')) {
            type = values.every(Number.isInteger) ? 'integer' : 'float'
          } else if(values.every(v => typeof(v) === 'boolean')) {
            type = 'boolean'
          } else if (values.every(v => !Number.isNaN(Date.parse(v)))) {
            type = values.some(v => v.includes('T')) ? 'datetime' : 'date'
          }
          return {
            name: col,
            friendly_name: col,
            type: type,
          }
        })
        const modifiedrows = JSON.stringify(rows)
        console.log({
          'rows':modifiedrows
        })
      }
    })
}
