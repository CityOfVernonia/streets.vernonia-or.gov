(function (document, arcgisRest, Chart) {

  const blue = '#325d88';
  const indigo = '#6610f2';
  const purple = '#6f42c1';
  const pink = '#e83e8c';
  const red = '#d9534f';
  const orange = '#f47c3c';
  const yellow = '#ffc107';
  const green = '#93c54b';
  const teal = '#20c997';
  const cyan = '#29abe0';

  const colors = [blue, indigo, purple, pink, red, orange, yellow, green, teal, cyan];

  // Charts defaults
  Chart.plugins.unregister(ChartDataLabels);
  Chart.defaults.global.defaultFontColor = '#3E3F3A';
  Chart.defaults.global.defaultFontFamily = '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

  // canvases
  const funcClassContext = document.querySelector('canvas[data-chart="home-functional-class"]').getContext('2d');
  const ownerContext = document.querySelector('canvas[data-chart="home-ownership"]').getContext('2d');

  // functional classification
  arcgisRest.queryFeatures({
    url: '',
    // where: `FUNC_CLASS <> 'Parking' AND FUNC_CLASS <> 'Path' AND FUNC_CLASS <> 'Driveway'`,
    groupByFieldsForStatistics: 'FUNC_CLASS',
    outStatistics: [
      {
        statisticType: 'sum',
        onStatisticField: 'LENGTH_M',
        outStatisticFieldName: 'LENGTH_M_sum',
      },
    ],
  })
    .then(result => {
      console.log(result);
      let total = 0;
      const labels = [];
      const data = [];

      result.features.forEach(feature => {
        const { attributes: { FUNC_CLASS, LENGTH_M_sum } } = feature;

        labels.push(FUNC_CLASS);
        data.push(LENGTH_M_sum);
        total = total + LENGTH_M_sum;
      });

      new Chart(funcClassContext, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 2,
          legend: {
            display: false,
            position: 'left',
          },
        },
      });
    })
    .catch(error => {
      console.log(error);
    });

  // ownership
  arcgisRest.queryFeatures({
    url: '',
    // where: `FUNC_CLASS <> 'Parking' AND FUNC_CLASS <> 'Path' AND FUNC_CLASS <> 'Driveway'`,
    groupByFieldsForStatistics: 'OWNER',
    outStatistics: [
      {
        statisticType: 'sum',
        onStatisticField: 'LENGTH_M',
        outStatisticFieldName: 'LENGTH_M_sum',
      },
    ],
  })
    .then(result => {
      console.log(result);
      let total = 0;
      const labels = [];
      const data = [];

      result.features.forEach(feature => {
        const { attributes: { OWNER, LENGTH_M_sum } } = feature;

        labels.push(OWNER);
        data.push(LENGTH_M_sum);
        total = total + LENGTH_M_sum;
      });

      new Chart(ownerContext, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 2,
          title: {
            display: true,
            text: `${total}`,
          },
          legend: {
            display: false,
            position: 'left',
          },
        },
      });
    })
    .catch(error => {
      console.log(error);
    });

}(this.document, this.arcgisRest, this.Chart));