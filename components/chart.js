import React, {useState} from 'react';
import * as d3 from 'd3';
import sub from 'date-fns/sub'

import {useD3} from '../hooks/d3';
import Button from './button';

import chart from '../styles/Chart.module.css'

const ALL_TIME = 100;
const ONE_YEAR = sub(new Date(), {years: 1});
const SIX_MONTHS = sub(new Date(), {months: 6});

const Chart = ({data: info}) => {

    const [range, setRange] = useState(ALL_TIME)
    const byRange = (point) => {
        if (range == ALL_TIME) {
            return true;
        } else {
            return new Date(point.date) > range;
        }
    }
    const data = info.filter(byRange)
    const ref = useD3(
        (svg) => {
            const height = 500;
            const width = 800;
            const margin = {top: 20, right: 30, bottom: 30, left: 50};

            const x = d3.scaleUtc()
                .domain(d3.extent(data, d => new Date(d.date)))
                .range([margin.left, width - margin.right])

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top])

            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left - 10},0)`)
                .call(d3.axisLeft(y).ticks(5, "s"))
                .call(g => g.select(".domain").remove())
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(data.y))

            const make_y_gridlines = () => {
                return d3.axisLeft(y)
                    .ticks(5)
            }

            svg.append("g")
                .attr("class", chart.grid)
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )

            const line = d3.line()
                .defined(d => !isNaN(d.value))
                .x(d => x(new Date(d.date)))
                .y(d => y(d.value))

            svg.select(".x-axis").call(xAxis);
            svg.select(".y-axis").call(yAxis);

            svg.attr("viewBox", [-10, 0, width, height]);


            svg.select('.plot-area')
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#bb86fc")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line)

            svg.selectAll('circle').remove();

            svg
                .select('.dots')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(new Date(d.date)))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("stroke-width", 1.5)
                .attr("stroke", "#bb86fc")
        },
        [data.length]

    );

    return (
        <>
            <Button onClick={() => setRange(ALL_TIME)} pushed={range === ALL_TIME} text={'All Time'} />
            <Button onClick={() => setRange(ONE_YEAR)} pushed={range === ONE_YEAR} text={'Last 12 Months'} />
            <Button onClick={() => setRange(SIX_MONTHS)} pushed={range === SIX_MONTHS} text={'Last 6 Months'} />
            <svg
                className={chart.legend}
                ref={ref}
            >
                <path className="plot-area" />
                <g className="dots" />
                <g className={'trend'} />
                <g className={`x-axis ${chart.legend}`} />
                <g className={`y-axis ${chart.legend}`} />
            </svg>
        </>
    );
}

export default Chart;