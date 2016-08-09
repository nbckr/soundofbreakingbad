
new Chartist.Bar('#ct-title-duration', {
    labels: ['Twin Peaks', 'Game of Thrones', 'Six Feet Under', 'House', 'The Wire', 'Deadwood', 'House of Cards', 'Boardwalk Empire', 'The Sopranos', 'Weeds', 'The X-Files', 'Mad Men', 'Sherlock', 'Tatort', 'Breaking Bad', 'Lost'],
    series: [
        [157, 100, 99, 98, 92, 92, 92, 91, 89, 52, 42, 37, 31, 31, 18, 12]
    ]
}, {
    chartPadding: {
        top: 0,
        right: 0,
        bottom: 30,
        left: 30
    },
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {
        offset: 105
    },
    plugins: [
        Chartist.plugins.ctAxisTitle({
            axisX: {
                axisTitle: 'Dauer in Sekunden',
                axisClass: 'ct-axis-title',
                offset: {
                    x: 30,
                    y: 38
                },
                textAnchor: 'middle'
            },
            axisY: {
                axisTitle: 'Serien',
                axisClass: 'ct-axis-title',
                offset: {
                    x: 0,
                    y: 15
                },
                textAnchor: 'middle',
                flipTitle: true
            }
        })
    ]
});



