$(function() {
    var chart = c3.generate({
        bindto: '#chart',
        data: {
            url: '../../data/de/title-duration-sec.json',
            mimeType: 'json',
            type: 'bar',
            colors: {
                "Breaking Bad (USA, 2008-2013)": 'darkgreen'
            },
            names: {
                //"Breaking Bad (USA, 2008-2013)": 'Breaking BAD'
            }
        },
        bar: {
            width: {
                ratio: 0.75
            }
        },
        color: {
            pattern: ["#383838", "#424242", "#4D4D4D", "#575757", "#626262", "#6C6C6C", "#777777", "#818181", "#8C8C8C", "#969696", "#A1A1A1", "#ABABAB", "#B6B6B6", "#C0C0C0", "#CBCBCB", "#D6D6D6"]
        },
        tooltip: {
            show: false
        },
        axis: {
            y: {
                label: {
                    text: 'Dauer in Sekunden',
                    position: 'outer-middle'
                }
            }
        }

    });
});