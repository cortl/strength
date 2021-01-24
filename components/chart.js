import React from 'react';
import * as d3 from 'd3';

import {useD3} from '../hooks/d3';

import chart from '../styles/Chart.module.css'

const Chart = ({data}) => {
    const ref = useD3(
        (svg) => {
            const height = 500;
            const width = 800;
            const margin = {top: 20, right: 30, bottom: 30, left: 40};

            const x = d3.scaleUtc()
                .domain(d3.extent(data, d => new Date(d.date)))
                .range([margin.left, width - margin.right])

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top])

            const xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(width / 90).tickSizeOuter(0))

            const yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .call(g => g.select(".domain").remove())
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(data.y))

            const line = d3.line()
                .defined(d => !isNaN(d.value))
                .x(d => x(new Date(d.date)))
                .y(d => y(d.value))

            svg.select(".x-axis").call(xAxis);
            svg.select(".y-axis").call(yAxis);

            svg.attr("viewBox", [0, 0, width, height]);


            svg.select('.plot-area')
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#bb86fc")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line);

            svg
                .select('.dots')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(new Date(d.date)))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("fill", "#bb86fc")
        },
        [data.length]


    );

    return (
        <svg
            ref={ref}
        >
            <path className="plot-area" />
            <g className="dots" />
            <g className={`x-axis ${chart.legend}`} />
            <g className={`y-axis ${chart.legend}`} />
        </svg>
    );
}

export default Chart;