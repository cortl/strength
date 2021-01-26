import {useState} from 'react';
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import sub from 'date-fns/sub'

import Button from './button';
import chart from '../styles/Chart.module.css';
const Chart = dynamic(() => import('react-apexcharts'), {ssr: false})
const ALL_TIME = 100;
const ONE_YEAR = sub(new Date(), {years: 1});
const SIX_MONTHS = sub(new Date(), {months: 6});

export const formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [month, day, year].join('-');
}

const LineChart = ({title, data: info}) => {
    const router = useRouter();
    const [range, setRange] = useState(ALL_TIME)
    const byRange = (point) => {
        if (range == ALL_TIME) {
            return true;
        } else {
            return new Date(point.date) > range;
        }
    }
    const data = info.filter(byRange)
    const options = {
        chart: {
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            events: {
                dataPointSelection: function (_event, _chartContext, config) {
                    const point = data[config.dataPointIndex];
                    router.push(`/dates/${formatDate(point.date)}`)
                }
            }
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    colors: '#ffffff'
                },
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            },
            axisBorder: {
                color: '#fff'
            },
            axisTicks: {
                color: '#fff'
            },
            tooltip: {
                enabled: false
            },
            type: 'datetime',
        },
        markers: {
            size: 5,
            strokeColors: '#bb86fc',
            colors: ['#000'],
            strokeWidth: 1.5,
            radius: 5
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    colors: ['#ffffff']
                }
            },
            axisBorder: {
                color: '#fff'
            },
            axisTicks: {
                color: '#fff'
            },
            tooltip: {
                enabled: false
            }
        },
        tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            theme: 'dark',
            x: {
                show: true,
                format: 'MM-dd-yyyy'
            }
        },
        stroke: {
            width: 1.5
        },
        colors: ['#bb86fc'],
    };
    const series = [{
        name: title,
        data: data.map(thing => ({x: new Date(thing.date).getTime(), y: thing.value}))
    }]
    return (
        <>
            <Button onClick={() => setRange(ALL_TIME)} pushed={range === ALL_TIME} text={'All Time'} />
            <Button onClick={() => setRange(ONE_YEAR)} pushed={range === ONE_YEAR} text={'Last 12 Months'} />
            <Button onClick={() => setRange(SIX_MONTHS)} pushed={range === SIX_MONTHS} text={'Last 6 Months'} />
            <Chart
                className={chart.legend}
                options={options}
                series={series}
                type="line"
                width="100%"
            />
        </>

    )
}

export default LineChart;