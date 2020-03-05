/// <reference path="jquery-3.4.1.js" />
(() => {
  // let symbolArr = [];
  // let allCoins;
  let tempLastCoin;
  // for Modal "BNB", "ETH", "XRP", "BCH", "LTC"
  // let removeArr = [];
  let chartArr = [];

  $(() => {
    // Navigating
    $(".page-link.currencies").click(() => {
      $(".container#currencies").css("display", "block");
      $("#chartContainer").css("display", "none");
      $(".container-fluid#about").css("display", "none");

      $(".active").css("background-color", " rgb(236, 235, 235)");
      $(".reports").css("background-color", "white");
      $(".about").css("background-color", "white");
      chartArr = [];
      $(".page-src").css("display", "block");

    });

    $(".page-link.reports").click(() => {
      $(".container#currencies").css("display", "none");
      $("#chartContainer").css("display", "block");
      $(".container-fluid#about").css("display", "none");

      $(".active").css("background-color", "white");
      $(".reports").css("background-color", " rgb(236, 235, 235)");
      $(".about").css("background-color", "white");

      pushToChart();
      $(".page-src").css("display", "none");
    });
    $(".page-link.about").click(() => {
      $(".container#currencies").css("display", "none");
      $("#chartContainer").css("display", "none");
      $(".container-fluid#about").css("display", "block");



      $(".active").css("background-color", "white");
      $(".reports").css("background-color", "white");
      $(".about").css("background-color", " rgb(236, 235, 235)");
      $(".pagelink a").css("color", "white");
      $(".active").css("color", "white");
      $(".reports").css("color", "white");

      $(".page-src").css("display", "none");

    })

    // ------------------------------------------------------------------------------



    // Loading Functions
    function loading() {
      const div = `<div class="loading"><p>Loading</p></div>`;
      $("#loading").append(div);
    }
    function moreLoading(parent) {
      const div = `<div class="lds-hourglass"></div>`;
      $(`.${parent}`).append(div);
    }

    // ------------------------------------------------------------------------------
    //Sticky

    //----------------------------------
    loading();
    createCoins();

    // Coins creating Function
    function createCoins() {
      getCoins(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD`)
        .then(coins => {
          allCoins = coins;
          // console.log(allCoins);
          makeCoins(coins);
          $("#loading").empty();
        }).catch(msg => alert(msg));

    }


    // ------------------------------------------------------------------------------

    //  Create Inner Coin Information Function 
    function makeCoins(coins) {
      for (let item of coins) {
        localStorage.removeItem(item.id);
        const newCard = `
                    <div class="card coin-box col-xs-12 col-sm-12 col-md-4 col-lg-3 " id="${item.name}"  >
                    <div class="card-body" >
                    <input type="checkbox"  class="switch " id="${item.symbol}">
                    <p class="card-title ">${item.symbol}</p>
                    <p class="card-text">Name: ${item.name} </p>
                    <p><a class="btn ctrl-standard typ-subhed fx-bubbleDown  more" data-toggle="collapse" 
                    id="${item.id}" href="javascript:void(0)" role="button">More Info</a>
                    </p>
                    <div class="${item.id} collapse card card-body">`;
        const endCard = `</div></div>`;
        $(".coins").append(newCard, endCard);
      }
    }

    //----------------------------------------------------------------------------------------------
    // Get Coins Function
    function getCoins(url) {
      return new Promise((resolve, reject) => {
        $.getJSON(url, coins => {
          resolve(coins);
        })
          .fail(() => {
            reject("The URL that is inplace is incorrect, Please try again later.")
          });
      });
    }

    //----------------------------------------------------------------------------------------------

    // Get Coins More Info Function 
    function getMoreInfo(id) {
      if (localStorage.getItem(id) === null) {
        $.getJSON((`https://api.coingecko.com/api/v3/coins/${id}`), coin => {
          const img = `<p> <img src="${coin.image.small}" class"coin-logo" ></p>`;
          const p1 = `<p>USD: $ ${coin.market_data.current_price.usd}</p>`;
          const p2 = `<p>EUR: € ${coin.market_data.current_price.eur}</p>`;
          const p3 = `<p>NIS: ₪ ${coin.market_data.current_price.ils}</p>`;
          const div = `${img}${p1}${p2}${p3}</div>`;
          $(`.${coin.id}`).empty();
          $(`.${coin.id}`).append(div);
          localStorage.setItem(`${coin.id}`, div);
          setTimeout(() => {
            localStorage.removeItem(`${coin.id}`);
          }, 120000);

        })
          .fail(() => {
            reject(alert("⚙️The ID that is inplace is incorrect, Please try again later.⚙️"));
          });
      }
      else {
        const storedDiv = localStorage.getItem(id);
        const newDiv = storedDiv;
        $(`.${id}`).empty();
        $(`.${id}`).append(newDiv);
      }
    }
    //----------------------------------------------------------------------------------------------
    // More info button collapse function
    $(document).on("click", ".more", async function () {
      if ($(`.${this.id}`).attr("class") == `${this.id} card card-body collapse show`) {
        $(`.${this.id}`).toggle("collapse");
        setTimeout(() => {
          $(`.${this.id}`).empty();
        }, 10);
      }
      else {
        moreLoading(this.id);
        await getMoreInfo(this.id);
        $(`.${this.id}`).toggle("collapse");
      }

    });



    //----------------------------------------------------------------------------------------------

    // Search Bar
    $(".input-search").on("keyup", function () {
      $(".card-title").each(function () {

        if ($(this).text().toUpperCase().includes($(".input-search").val().toUpperCase())) {
          $(this).parent().parent().css("display", "block");
        } else {
          $(this).parent().parent().css("display", "none");
        }
      });

      if ($(".input-search").val() === "") {
        $(".card").css("display", "block");
      }
    });

    $(".btn-clear").click(() => {
      $(".input-search").val("");
      $(".input-search").keyup();
    });

    // Modal Functions


    $(document).on("change", ".switch", function () {

      if ($('#exampleModal').is(':visible') || $("input[type='checkbox']:checked").length < 6) {
        return;
      }
      if ($('#exampleModal').is("hidden")) {
        $(".modal-body").empty();
      }
      tempLastCoin = this;
      $(this).prop("checked", false);
      $(`#modal`).click();
      $(".modal-body").empty();
      createModalBody();
    });
    //----------------------------------------------------------------------------------------------

    function createModalBody() {
      const info = `<p>You can only choose 5 Coins please edit your coin selection.</p><hr>`;
      $(".modal-body").append(info);
      $("input[type='checkbox']:checked").each(function () {
        const p = `<p class="text-uppercase">${this.id}</p>`;
        const input = `<input type="checkbox" class="switch" id="${this.id}" checked>`;
        const newDiv = `<div class="col-12 coin-modal text-left">${p}${input}</div><hr>`;
        $(".modal-body").append(newDiv);
      });

    }
    //----------------------------------------------------------------------------------------------
    // Save Changes modal button function 
    $(document).on("click", ".save", function () {
      $(".modal-body input[type='checkbox']").each(function () {
        if (!this.checked) {
          $(`.card input[type='checkbox']#${this.id}`).prop("checked", false);
          $(`#${tempLastCoin.id}`).prop("checked", true);
        }
        $(".modal-body").empty();
      });
      $(`.modal`).modal("toggle");
    });

    //-----------------------------------------Chart--------------------------------------------------

    // Chart Arr push
    function pushToChart() {
      if ($("input[type=checkbox]:checked").length === 0) {

      }
      else {
        $("input[type=checkbox]:checked").each(function () {
          chartArr.push(this.id.toUpperCase());
        })
      }
    }


    $(".reports").on("click", () => {
      function makechart(response) {
        let USDrate = [];
        let dataset = [];
        let currencyArr = Object.values(response);
        for (i = 0; i < currencyArr.length; i++) {
          USDrate.push(currencyArr[i].USD)

        }

        for (i = 0; i < USDrate.length; i++) {
          dataset.push({
            "seriesname": `${chartArr[i]}`,
            "alpha": "100",
            "data": [{
              "value": `${USDrate[i]}`
            }]
          })
        }

        FusionCharts.ready(function () {

          let header = "";
          chartArr.forEach((coin, i) => {
            header += coin + ", ";
          })
          header = header.slice(0, header.length - 2);

          var myChart = new FusionCharts({
            id: `${Math.random()}`,
            type: 'realtimeline',
            renderAt: 'chartContainer',
            width: '100%',
            height: '400',
            dataFormat: 'json',
            dataSource: {
              "chart": {
                "theme": "fusion",
                "palettecolors": "#5d62b5,#29c3be,#f2726f, #ffc533, #62b58f",
                "caption": `Realtime Price  to USD`,
                "subCaption": `of ${header}`,
                "showrealtimevalue": "1",
                "refreshinterval": "2",
                "borderAlpha": "0",
                "numdisplaysets": "40",
                "numDivLines": "10",
                "showLegend": "1",
                "interactiveLegend": "1",
                "canvasBorderAlpha": "10",
                "labeldisplay": "rotate",
                "bgAlpha": "0",
                "showValues": "0",
                "numberPrefix": "$",
                "showlabels": "1",
                "animation": "1",
                "showRealTimeValue": "0"

              },
              "categories": [{
                "category": [{
                  "label": "Now"
                }]
              }],
              "dataset": dataset
            },
            events: {
              'rendered': function (evt, args) {

                //Format minutes, seconds by adding 0 prefix accordingly
                function formatTime(time) {
                  (time < 10) ? (time = "0" + time) : (time = time);
                  return time;
                }

                API_BASE_URL2 = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
                let toUSD = "&tsyms=USD";
                let choosenCoins = ""
                chartArr.forEach((coin, i) => {
                  choosenCoins += coin + ",";
                })
                choosenCoins = choosenCoins.slice(0, choosenCoins.length - 1);
                const API_KEY = "061af3634a276c305e832b9840107a0af5c631360b22c8ac82fe1bad39dd64dc"

                let updateRates = []
                currDate = new Date(),
                  label = formatTime(currDate.getHours()) + ":" + formatTime(currDate.getMinutes()) + ":" + formatTime(currDate.getSeconds())
                let strRates = "&value=";

                $.get({
                  url: `${API_BASE_URL2}${choosenCoins}${toUSD}&api_key=${API_KEY}`,
                  dataType: 'json',
                  success: response => {


                    let currenciesArr = Object.values(response)
                    for (let i = 0; i < currencyArr.length; i++) {
                      updateRates.push(currenciesArr[i].USD)
                    }
                    for (i = 0; i < updateRates.length; i++) {
                      strRates += updateRates[i] + "|"
                    }
                    strRates = strRates.slice(0, strRates.length - 1);
                  },
                });


                evt.sender.chartInterval = setInterval(function () {
                  //Get reference to the chart using its ID
                  var chartRef = evt.sender,
                    //We need to create a querystring format incremental update, containing
                    //label in hh:mm:ss format
                    //and a value (random).
                    currDate = new Date(),
                    label = formatTime(currDate.getHours()) + ":" + formatTime(currDate.getMinutes()) + ":" + formatTime(currDate.getSeconds())
                  let strData = "&label=" + label + strRates

                  // //Build Data String in format &label=...&value=...
                  // //Feed it to chart.
                  chartRef.feedData(strData);

                }, 2000);

              },
              "disposed": function (evt, args) {
                clearInterval(evt.sender.chartInterval);
              }
            }
          }).render();
        });

      }



      function addCoinToChart() {
        if (chartArr.length === 0) {
          $('#chartContainer').html('<h1 class="text-center" >Realtime Coin Value Graph</h1><h2 class="text-center">Please Choose Coins To Display Graph</h2>')
          return;
        } else {
          $('#chartContainer').html(`
                  <div class="spinner-border chart-spinner text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                  </div>
      `)
          $('.chart-spinner').show()
        }

        const API_BASE_URL2 = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
        let toUSD = "&tsyms=USD";
        let choosenCoins = ""
        chartArr.forEach((coin, i) => {
          choosenCoins += coin + ",";
        })
        choosenCoins = choosenCoins.slice(0, choosenCoins.length - 1);
        const API_KEY = "061af3634a276c305e832b9840107a0af5c631360b22c8ac82fe1bad39dd64dc"



        $.get({
          url: `${API_BASE_URL2}${choosenCoins}${toUSD}&api_key=${API_KEY}`,
          dataType: 'json',
          success: response => {
            makechart(response)
          },
        });
      }
      addCoinToChart();

    })

    //------------------------------------------------------------------------------------------------



    $(".logo").click(() => {
      alert(`JavaScript makes me want to flip the table and say "Fuck this shit",
             but i can never be sure what "this" refers to.`)
    })

    $(".emptyModal").click(() => {
      $(".modal-body").empty();
    });
  });
})();











