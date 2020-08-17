import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";

export default function CustomersChart({
  value,
  data,
  labels,
  // array of numbers
  data1,
  // chart line color
  color,
  // chart line size
  border
}) {
  const canvasBarRef = useRef();
  const canvasLineRef = useRef();
  useEffect(() => {
    const config = {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Registros",
            borderColor: color,
            borderWidth: border,
            pointBackgroundColor: Chart.helpers
            .color("#000000")
            .alpha(0)
            .rgbString(),
            pointHoverRadius: 4,
            pointHoverBorderWidth: 12,
            pointBackgroundColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.registers,
            backgroundColor:"blue"
          },
          {
            label: "Usuarios",
            borderColor: color,
            borderWidth: border,
            pointBackgroundColor: Chart.helpers
            .color("#000000")
            .alpha(0)
            .rgbString(),
            pointHoverRadius: 4,
            pointHoverBorderWidth: 12,
            pointBackgroundColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.users,
            backgroundColor:"red"
          },
          {
            label: "Clientes",
            borderColor: color,
            borderWidth: border,
            pointBackgroundColor: Chart.helpers
            .color("#000000")
            .alpha(0)
            .rgbString(),
            pointHoverRadius: 4,
            pointHoverBorderWidth: 12,
            pointBackgroundColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.clients,
            backgroundColor:"green"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text:"Gráfica Absolutos"
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: false
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        hover: {
          mode: "ErrorsPage.js"
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: ""
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: "Value"
              },
              ticks: {
                beginAtZero: true,
              }
            }
          ]
        },

        elements: {
          point: {
            radius: 4,
            borderWidth: 12
          }
        },

        layout: {
          padding: {
            left: 0,
            right: 10,
            top: 5,
            bottom: 0
          }
        }
      }
    };

    const chart = new Chart(canvasBarRef.current, config);
    const configLine = {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Usuarios/Registros",
            borderColor: "blue",
            borderWidth: border,
            pointHoverRadius: 1,
            pointHoverBorderWidth: 4,
            pointBackgroundColor: Chart.helpers
              .color("blue")
              .alpha(1)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("blue")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("blue")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.users_registers,
            backgroundColor:"blue"
            //backgroundColor:usersRegistersColors
          },
          {
            label: "Clientes/Registros",
            borderColor: "red",
            borderWidth: border,
            pointHoverRadius: 1,
            pointHoverBorderWidth: 4,
            pointBackgroundColor: Chart.helpers
              .color("red")
              .alpha(1)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("red")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.clients_registers,
            backgroundColor:"red",
          },
          {
            label: "Clientes/Usuarios",
            borderColor: "green",
            borderWidth: border,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 12,
            pointBackgroundColor: Chart.helpers
              .color("green")
              .alpha(1)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("green")
              .alpha(0)
              .rgbString(),

            pointHoverBorderColor: Chart.helpers
              .color("green")
              .alpha(0.1)
              .rgbString(),
            fill: false,
            data: data.clients_users,
            backgroundColor:"green"
            //backgroundColor:clientsUsersColors
          }
        ]
      },
      options: {
        title: {
          display: true,
          text:"Gráfica Conversions"
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: false
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        hover: {
          mode: "ErrorsPage.js"
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: ""
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: false,
              scaleLabel: {
                display: true,
                labelString: "Value"
              },
              ticks: {
                beginAtZero: true,
                min:0,
                max:100,
                stepSize:20,
                callback: function(value, index, values) {
                  return value + '%';
              }
              }
            }
          ]
        },

        elements: {
          point: {
            radius: 4,
            borderWidth: 12
          }
        },

        layout: {
          padding: {
            left: 0,
            right: 10,
            top: 5,
            bottom: 0
          }
        }
      }
    };

    const chartLine = new Chart(canvasLineRef.current, configLine);

    return () => {
      chart.destroy();
      chartLine.destroy();
    };
  }, [data]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="kt-widget26">
          <div className="kt-widget26__content">
          </div>

          <div
            className="kt-widget26__chart  mb-5 ml-5"
          >
            <canvas ref={canvasBarRef} id="kt_chart_quick_stats_1" />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="kt-widget26">
          <div className="kt-widget26__content">
          </div>

          <div
            className="kt-widget26__chart mb-5 ml-5"
          >
            <canvas ref={canvasLineRef} id="kt_chart_quick_stats_2" />
          </div>
        </div>
      </div>
    </div>

  );
}
