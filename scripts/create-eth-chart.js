function createChart(priceData, obituariesData) {
    const priceSeries = priceData.map(d => [Date.parse(d.date), d.price]);

    // Include all obituaries, even those without corresponding price data
    const obituarySeries = obituariesData.map(d => {
        const priceEntry = priceData.find(p => p.date === d.date);
        return {
            x: Date.parse(d.date),
            y: priceEntry ? priceEntry.price : null,
            statement: d.statement,
            author: d.author,
            source: d.source,
            link: d.link
        };
    });

    // Determine the earliest date for the x-axis range
    const earliestPriceDate = priceData.length ? Date.parse(priceData[0].date) : null;
    const earliestObitDate = obituariesData.length ? Math.min(...obituariesData.map(d => Date.parse(d.date))) : null;
    const minDate = earliestObitDate ? Math.min(earliestPriceDate, earliestObitDate) : earliestPriceDate;

    Highcharts.chart('ethChart', {
        chart: {
            backgroundColor: '#222222',
            events: {
                load: function () {
                    
                        this.renderer.image('assets/ETH_Obituaries_logo.png', 
                            this.plotLeft + this.plotWidth / 2 - 250, // Center horizontally
                            this.plotTop + this.plotHeight / 2 - 250, // Center vertically
                            500, // Width of the image
                            500  // Height of the image
                        ).css({
                            opacity: 0.1 // Adjust this value for desired opacity
                        }).add();
                    
                    this.series[0].graph.attr({
                        filter: 'url(#glow)'
                    });
                    

                    // Add centered watermark text
                    this.watermark = this.renderer.text('EthereumObituaries.com', 0, 0)
                        .attr({
                            zIndex: 0,
                            align: 'center'
                        })
                        .css({
                            color: '#ffffff',
                            opacity: 0.1,
                            fontSize: '24px',
                            fontWeight: 'bold'
                        })
                        .add();

                    // Position the watermark
                    this.watermarkUpdate();
                },
                redraw: function() {
                    // Reposition the watermark on redraw
                    this.watermarkUpdate();
                }
            }
        },
        title: {
            text: null // Remove the chart title
        },
        subtitle: {
            text: null // Remove the chart subtitle
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    const year = Highcharts.dateFormat('%Y', this.value);
                    return `<a href="#year-${year}" style="color: white; text-decoration: none;">${year}</a>`;
                },
                useHTML: true,
                style: {
                    color: '#ffffff'
                }
            },
            min: minDate,
            tickInterval: 365 * 24 * 3600 * 1000, // Set tick interval to one year
            startOnTick: true,
            endOnTick: false,
            tickPositioner: function () {
                var positions = [],
                    tick = Math.floor(this.dataMin),
                    increment = 365 * 24 * 3600 * 1000; // One year in milliseconds

                for (tick; tick <= this.dataMax; tick += increment) {
                    positions.push(tick);
                }
                return positions;
            }
        },
        yAxis: {
            type: 'logarithmic',
            min: 0.4,
            title: {
                text: 'ETH Price',
                style: {
                    color: '#ffffff'
                }
            },
            labels: {
                formatter: function() {
                    return '$' + this.value;
                },
                style: {
                    color: '#ffffff'
                }
            },
            gridLineColor: '#444444',
            minorTickInterval: null,
            tickInterval: 0.5
        },
        tooltip: {
            useHTML: true,
            backgroundColor: '#333333',
            borderRadius: 5,
            style: {
                pointerEvents: 'auto',
                padding: '0px',
                color: '#ffffff'
            },
            formatter: function() {
                let displayDate = this.x;
                if (this.point.statement === "Sidechains: the coming death of altcoins and ethereum.") {
                    displayDate = Date.parse("2014-04-09");
                }
                if (this.point.statement === "Why Ethereum is dead in the water.") {
                    displayDate = Date.parse("2014-10-15");
                }

                if (this.series.name === 'Ethereum Price') {
                    return false; // Disable tooltip for Ethereum Price
                } else {
                    const price = this.point.y !== null ? `<div class="highcharts-tooltip-price">$${this.point.y.toFixed(2)} ETH</div>` : '<div class="highcharts-tooltip-price">N/A</div>';
                    return `
                        <div class="highcharts-tooltip-box">
                            ${price}
                            <div class="highcharts-tooltip-date">${Highcharts.dateFormat('%Y-%m-%d', displayDate)}</div>
                            <div class="highcharts-tooltip-statement">
                                <a href="${this.point.link}" target="_blank">${this.point.statement}</a>
                            </div>
                            <div class="author-source-container">
                                <span class="highcharts-tooltip-author">— ${this.point.author}</span>
                                <span class="highcharts-tooltip-source">(${this.point.source})</span>
                            </div>
                        </div>`;
                }
            }
        },
        series: [
            {
                name: 'Ethereum Price',
                data: priceSeries,
                type: 'line',
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                    stops: [
                        [0, '#FFA500'],
                        [1, '#FF4500']
                    ]
                },
                marker: {
                    enabled: false
                },
                enableMouseTracking: false,
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
            {
                name: 'Obituaries',
                data: obituarySeries,
                type: 'scatter',
                color: 'red',
                marker: {
                    symbol: `url(assets/headstone-emoji.svg)`,
                    radius: 6,
                    states: {
                        hover: {
                            enabled: true,
                            radiusPlus: 0,
                        }
                    }
                },
                states: {
                    inactive: {
                        opacity: 1
                    }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            window.open(this.link, '_blank');
                        }
                    }
                }
            }
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    }, function(chart) { // on complete
        chart.watermarkUpdate = function() {
            if (this.watermark) {
                var bbox = this.watermark.getBBox();
                this.watermark.attr({
                    x: this.plotLeft + (this.plotWidth / 2),
                    y: this.plotTop + (this.plotHeight / 2) + (bbox.height / 4)
                });
            }
        };
    });
}