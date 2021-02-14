const DOMContentLoaded_event = window.document.createEvent("Event");
DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
window.document.dispatchEvent(DOMContentLoaded_event);

(function () {
  let myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      {
        id: "date",
        dataType: tableau.dataTypeEnum.date,
      },
      {
        id: "open",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "high",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "low",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "close",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "volume",
        dataType: tableau.dataTypeEnum.int,
      },
    ];

    const tableSchema = {
      id: "AlphaVantageDailyStockConnector",
      alias: "Stock Data",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    symbol = JSON.parse(tableau.connectionData) || {
      ticker: "IBM",
      api: "demo",
    };
    $.getJSON(
      "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
        symbol +
        "&outputsize=full&apikey=" +
        api,
      function (resp) {
        let data = resp["Weekly Time Series"],
          tableData = [];

        for (d in data) {
          tableData.push({
            date: d,
            open: parseFloat(data[d]["1. open"]),
            high: parseFloat(data[d]["2. high"]),
            low: parseFloat(data[d]["3. low"]),
            close: parseFloat(data[d]["4. close"]),
            volume: parseInt(data[d]["5. volume"]),
          });
        }

        table.appendRows(tableData);
        doneCallback();
      }
    );
  };

  tableau.registerConnector(myConnector);

  $(document).ready(function () {
    $("#submitButton").click(function (event) {
      event.preventDefault();
      const form = document.querySelector("#alphaVantageForm");
      const data = Object.fromEntries(new FormData(form).entries());
      console.log(data);
      tableau.connectionData = JSON.stringify(data);
      tableau.connectionName = "Historical " + $("#ticker").val() + " Data";
      tableau.submit();
    });
  });
})();
