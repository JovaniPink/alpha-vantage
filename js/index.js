const DOMContentLoaded_event = window.document.createEvent("Event");
DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
window.document.dispatchEvent(DOMContentLoaded_event);

(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
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

    var tableSchema = {
      id: "AlphaVantageDailyStockConnector",
      alias: "Stock Data",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    symbol = tableau.connectionTicker || "IBM";
    api = tableau.connectionAPI || "demo";
    $.getJSON(
      "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
        symbol +
        "&outputsize=full&apikey=" +
        api,
      function (resp) {
        var data = resp["Weekly Time Series"],
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
    $("#submitButton").click(function () {
      tableau.connectionTicker = $("#ticker").val();
      tableau.connectionAPI = $("#auth").val();
      console.log(tableau.connectionAPI);
      tableau.connectionName = "Historical " + $("#ticker").val() + " Data";
      tableau.submit();
    });
  });
})();
