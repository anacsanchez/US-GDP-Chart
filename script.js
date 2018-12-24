fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(res => res.json())
  .then(({data}) => createBarChart(data))

const width = 1000;
const height = 500;
const wPadding = 80;
const hPadding = 40;
const regFill = "green";
const highlightFill = "#48b448";

d3.select("#bar-chart")
  .style("width", `${width}px`)

function createBarChart(data) {
  const minYear = parseYear(data[0][0]);
  const maxYear = parseYear(data[data.length - 1][0]);

  const xScale = d3.scaleTime()
                    .domain([minYear, maxYear])
                    .range([wPadding, width - wPadding])

  const yScale = d3.scaleLinear()
                    .domain([0,d3.max(data, d => d[1])])
                    .range([height - hPadding, hPadding])

  d3.select("#bar-chart")
      .append("div")
      .attr("id", "title")
      .html(`<div>United States GDP Growth</div><div> ${data[0][0].substr(0,4)}-${data[data.length - 1][0].substr(0,4)}</div>`)

  const chart = d3.select('#bar-chart')
                    .append('svg')
                    .attr("id", "chart-svg")
                    .attr("width", width)
                    .attr("height", height)

  const tooltip = d3.select("#bar-chart")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("opacity", "0")

  const rects = chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", (d,i) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("height", (d) => (height - hPadding) - yScale(d[1]))
        .attr("width", d => (width - wPadding) / data.length)
        .attr("fill", regFill)
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on('mousemove', function(d) {
          d3.select(this)
            .attr("fill", highlightFill)
          tooltip
            .style("top", `${d3.mouse(this)[1] - 5}px`)
            .style("left", `${d3.mouse(this)[0] - 40}px`)
            .text(`${d3.timeFormat("%Y")(new Date(d[0].substr(0, 4),null))} Q${(Math.ceil(Number.parseInt(d[0].substr(5, 2)) - 1) / 3)+1} $${d[1]} Billion`)
            .attr("data-date",d[0])
            .style("opacity", 1)
        })
        .on('mouseout', function(d) {
          d3.select(this)
              .attr("fill", regFill)
          d3.select("#tooltip")
              .style("opacity", 0)
        })

  const xAxis = d3.axisBottom(xScale)
  chart.append('g')
        .attr("transform", `translate(0, ${height - hPadding})`)
        .attr("id", "x-axis")
        .call(xAxis)

  const yAxis = d3.axisLeft(yScale)
  chart.append('g')
        .attr("transform", `translate(${wPadding}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis)

  const yAxisLabel = chart.append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 0)
                          .attr("x", -(height/2))
                          .attr("dy", "1em")
                          .style("font-style","italic")
                          .style("font-size", "1em")
                          .attr("text-anchor", "middle")
                          .text("Gross Domestic Product, Billions (USD)")
  d3.select("#bar-chart")
      .append("div")
      .attr("id","info")
      .text("Additional Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
}

//data in string YYYY-DD-MM format
function parseYear(data) {
  return new Date(data.substr(0, 4), null)
}




