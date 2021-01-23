import React from 'react';
import {useD3} from '../hooks/d3';
import * as d3 from 'd3';

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
                .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

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
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line);
        },
        [data.length]
    );

    return (
        <svg
            ref={ref}
        >
            <path className="plot-area" />
            <g className="x-axis" />
            <g className='y-axis' />
        </svg>
    );
}

export default Chart;