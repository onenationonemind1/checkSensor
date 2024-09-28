// ThingSpeak 채널 설정
const channelID = '2665690'; // 예시 채널 ID
const fieldNumber = 1;
const apiKey = ''; // 필요한 경우 API 키 입력

// 차트 설정
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// SVG 요소 생성
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 스케일 설정
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// 라인 생성기 설정
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

// 축 설정
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// 축 그리기
const xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`);

const yAxisGroup = svg.append("g")
    .attr("class", "y-axis");

// 라인 패스 추가
const path = svg.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5);

// 툴팁 설정
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// ThingSpeak에서 데이터 가져오기
function fetchData() {
    const url = `https://api.thingspeak.com/channels/${channelID}/fields/${fieldNumber}.json?results=60`;
    return d3.json(url)
        .then(response => {
            return response.feeds.map(d => ({
                date: new Date(d.created_at),
                value: parseFloat(d[`field${fieldNumber}`])
            })).filter(d => !isNaN(d.value));
        });
}

// 차트 업데이트
function updateChart(data) {
    // 도메인 업데이트
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.value)]);

    // 라인 업데이트
    path.datum(data)
        .attr("d", line);

    // 축 업데이트
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // 데이터 포인트 업데이트
    const circles = svg.selectAll(".datapoint")
        .data(data);

    circles.enter()
        .append("circle")
        .attr("class", "datapoint")
        .attr("r", 4)
        .attr("fill", "steelblue")
        .merge(circles)
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`날짜: ${d.date.toLocaleString()}<br/>값: ${d.value}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    circles.exit().remove();
}

// 초기 데이터 로드 및 차트 그리기
fetchData().then(data => {
    updateChart(data);
});

// 주기적으로 데이터 업데이트 (15초마다)
setInterval(() => {
    fetchData().then(data => {
        updateChart(data);
    });
}, 15000);