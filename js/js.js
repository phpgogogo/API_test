$(document).ready(function () {
    $.ajax({ //Process the form using $.ajax()
        type: 'get', //Method type
        url: 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-A0002-001?Authorization=CWB-4EBAEEC1-2629-4C09-B0C7-9A75DA7A359B&downloadType=WEB&format=JSON', //Your form processing file URL
        data: $(this).serialize(), //Forms name
        dataType: 'json',
        success: function (result) {
            data = result.cwbopendata.location;
            // console.log("縣市:", data[0].parameter[0].parameterValue);
            // console.log("地名:", data[0].locationName);
            // console.log("高度:", data[0].weatherElement[0].elementValue.value, "公尺");
            // console.log("測量時間:", data[0].time.obsTime);
            // console.log("60分鐘累積雨量:", data[0].weatherElement[1].elementValue.value, "mm");
            // console.log("10分鐘累積雨量:", data[0].weatherElement[2].elementValue.value, "mm");
            // console.log("3小時累積雨量:", data[0].weatherElement[3].elementValue.value, "mm");
            // console.log("6小時累積雨量:", data[0].weatherElement[4].elementValue.value, "mm");
            // console.log("12小時累積雨量:", data[0].weatherElement[5].elementValue.value, "mm");
            // console.log("24小時累積雨量:", data[0].weatherElement[6].elementValue.value, "mm");
            // console.log("本日累積雨量:", data[0].weatherElement[7].elementValue.value, "mm");
            // console.log("前1日0時到現在之累積雨量:", data[0].weatherElement[8].elementValue.value, "mm");
            // console.log("前2日0時到現在之累積雨量:", data[0].weatherElement[9].elementValue.value, "mm");
            // time0.getFullYear()
            time0 = new Date(data[0].time.obsTime);
            // console.log(time0);
            // console.log("year", time0.getFullYear());
            // console.log("month", time0.getMonth() + 1);
            // console.log("day", time0.getDate());
            // console.log("hour", time0.getHours());
            // console.log("min", time0.getMinutes());
            // console.log("sec", time0.getSeconds());
            // console.log("資料筆數:", data.length);

            //指定為全域變數
            source=result;
            

            $("#now").text(`資料最後更新時間:${time0.getHours()}時${time0.getMinutes()}分`);

            $("h1").prepend(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}`);
            $("tr>th").eq(1).text(`縣市`)
            $("tr>th").eq(2).text(`地名`)
            $("tr>th").eq(3).text(`60分鐘累積雨量`)
            $("tr>th").eq(4).text(`3小時累積雨量`)
            $("tr>th").eq(5).text(`6小時累積雨量`)
            $("tr>th").eq(6).text(`12小時累積雨量`)
            $("tr>th").eq(7).text(`24小時累積雨量`)

            for (i = 0; i < data.length; i++) {
                if(parseFloat(data[i].weatherElement[1].elementValue.value)<0){
                    data[i].weatherElement[1].elementValue.value="0.00";
                }
                if(parseFloat(data[i].weatherElement[3].elementValue.value)<0){
                    data[i].weatherElement[3].elementValue.value="0.00";
                }
                if(parseFloat(data[i].weatherElement[4].elementValue.value)<0){
                    data[i].weatherElement[4].elementValue.value="0.00";
                }
                if(parseFloat(data[i].weatherElement[5].elementValue.value)<0){
                    data[i].weatherElement[5].elementValue.value="0.00";
                }
                if(parseFloat(data[i].weatherElement[6].elementValue.value)<0){
                    data[i].weatherElement[6].elementValue.value="0.00";
                }
                $("tbody").append(`
            <tr>
                <td>${i + 1}</td>
                <td>${data[i].parameter[0].parameterValue}</td>
                <td>${data[i].locationName}</td>
                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
            </tr>`);
            }
            // 幫dataTable新增判斷數字+字串的排序方法
            jQuery.extend( jQuery.fn.dataTableExt.oSort, {
                "formatted-num-pre": function ( a ) {
                    a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
                    return parseFloat( a );
                },
             
                "formatted-num-asc": function ( a, b ) {
                    return a - b;
                },
             
                "formatted-num-desc": function ( a, b ) {
                    return b - a;
                }
            } );
            $("#table_id").DataTable(
                {
                    columnDefs: [
                        { type: 'formatted-num', targets: [3,4,5,6,7] }
                      ],
                    //   order: [[ 7, 'desc' ]]
                } 
            );

            // 下拉式選單
            let city=[];
            data.forEach(item=>{
                // console.log(item.parameter[0].parameterValue)
                if(city.indexOf(item.parameter[0].parameterValue)==-1){
                    city.push(item.parameter[0].parameterValue)
                }
            })
            // console.log(city);
            select(city);

            $("#city").on("change",(e)=>{
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                let selectCity=$(e.target).val()
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()} ${selectCity}累積降雨量`);
                // console.log(selectCity);
                for(i=0;i<data.length;i++){
                    // console.log(data[i].parameter[0].parameterValue==selectCity);
                    if(data[i].parameter[0].parameterValue==selectCity){
                        $("tbody").append(`
                            <tr>
                                <td>${i + 1}</td>
                                <td>${data[i].parameter[0].parameterValue}</td>
                                <td>${data[i].locationName}</td>
                                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
                            </tr>`);
                    }
                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-secondary");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );
                
            })

            const north = ["新北市", "臺北市", "基隆市", "新竹市", "桃園市", "新竹縣", "宜蘭縣"];
            const mid = ["臺中市", "苗栗縣", "彰化縣", "南投縣", "雲林縣"];
            const south = ["高雄市", "臺南市", "嘉義市", "嘉義縣", "屏東縣", "澎湖縣"];
            const east = ["花蓮縣", "臺東縣"];

            $("#all").on("click", function () {
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}各縣市累積降雨量`);
                for (i = 0; i < data.length; i++) {
                    $("tbody").append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${data[i].parameter[0].parameterValue}</td>
                    <td>${data[i].locationName}</td>
                    <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                    <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                    <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                    <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                    <td>${data[i].weatherElement[6].elementValue.value}mm</td>
                </tr>`);

                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-primary");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );

            })

            $("#north").on("click", function () {
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                // $("#table_id").empty();
                // $("#table_id").empty();
                // $("#table_id").hide();
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}北部地區累積降雨量`);
                for (i = 0; i < data.length; i++) {
                    if (north.indexOf(data[i].parameter[0].parameterValue) >= 0) {
                        $("tbody").append(`
            <tr id='northPart'>
                <td>${i + 1}</td>
                <td>${data[i].parameter[0].parameterValue}</td>
                <td>${data[i].locationName}</td>
                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
            </tr>`);
                    }
                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-success");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );

            })
            $("#mid").on("click", function () {
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}中部地區累積降雨量`);
                for (i = 0; i < data.length; i++) {
                    if (mid.indexOf(data[i].parameter[0].parameterValue) >= 0) {
                        $("tbody").append(`
            <tr id='midPart'>
                <td>${i + 1}</td>
                <td>${data[i].parameter[0].parameterValue}</td>
                <td>${data[i].locationName}</td>
                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
            </tr>`);
                    }
                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-info");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );

            })
            $("#south").on("click", function () {
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}南部地區累積降雨量`);
                for (i = 0; i < data.length; i++) {
                    if (south.indexOf(data[i].parameter[0].parameterValue) >= 0) {
                        $("tbody").append(`
            <tr id='southPart'>
                <td>${i + 1}</td>
                <td>${data[i].parameter[0].parameterValue}</td>
                <td>${data[i].locationName}</td>
                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
            </tr>`);
                    }
                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-warning");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );

            })
            $("#east").on("click", function () {
                $("#table_id").DataTable().destroy();
                $("tbody").html("");
                $("h1").text(`${time0.getFullYear()}/${time0.getMonth() + 1}/${time0.getDate()}東部地區累積降雨量`);
                for (i = 0; i < data.length; i++) {
                    if (east.indexOf(data[i].parameter[0].parameterValue) >= 0) {
                        $("tbody").append(`
            <tr id='eastPart'>
                <td>${i + 1}</td>
                <td>${data[i].parameter[0].parameterValue}</td>
                <td>${data[i].locationName}</td>
                <td>${data[i].weatherElement[1].elementValue.value}mm</td>
                <td>${data[i].weatherElement[3].elementValue.value}mm</td>
                <td>${data[i].weatherElement[4].elementValue.value}mm</td>
                <td>${data[i].weatherElement[5].elementValue.value}mm</td>
                <td>${data[i].weatherElement[6].elementValue.value}mm</td>
            </tr>`);
                    }
                }
                $("#table_id").find('tr').first().removeClass();
                $("#table_id").find('tr').first().addClass("table-danger");
                $("#table_id").DataTable(
                    {
                        columnDefs: [
                            { type: 'formatted-num', targets: [3,4,5,6,7] }
                          ],
                        //   order: [[ 7, 'desc' ]]
                    } 
                );

            })

            // 撈出各地區60分鐘總雨量
            north_total = 0;
            mid_total = 0;
            south_total = 0;
            east_total = 0;
            north_length = 0;
            mid_length = 0;
            south_length = 0;
            east_length = 0;
            data.forEach((value, key) => {
                if (north.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[1].elementValue.value) >= 0) {
                    north_total = north_total + parseFloat(value.weatherElement[1].elementValue.value);
                    north_length++;
                }
                if (mid.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[1].elementValue.value) >= 0) {
                    mid_total = mid_total + parseFloat(value.weatherElement[1].elementValue.value);
                    mid_length++;
                }
                if (south.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[1].elementValue.value) >= 0) {
                    south_total = south_total + parseFloat(value.weatherElement[1].elementValue.value);
                    south_length++;
                }
                if (east.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[1].elementValue.value) >= 0) {
                    east_total = east_total + parseFloat(value.weatherElement[1].elementValue.value);
                    east_length++;
                }
            })
            // console.log("北部60分鐘總雨量", north_total, "資料筆數:", north_length);
            // console.log("中部60分鐘總雨量", mid_total, "資料筆數:", mid_length);
            // console.log("南部60分鐘總雨量", south_total, "資料筆數:", south_length);
            // console.log("東部60分鐘總雨量", east_total, "資料筆數:", east_length);

            // 撈出各地區24小時總雨量
            north_total24 = 0;
            mid_total24 = 0;
            south_total24 = 0;
            east_total24 = 0;
            north_length24 = 0;
            mid_length24 = 0;
            south_length24 = 0;
            east_length24 = 0;
            data.forEach((value, key) => {
                if (north.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[6].elementValue.value) >= 0) {
                    north_total24 = north_total24 + parseFloat(value.weatherElement[6].elementValue.value);
                    north_length24++;
                }
                if (mid.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[6].elementValue.value) >= 0) {
                    mid_total24 = mid_total24 + parseFloat(value.weatherElement[6].elementValue.value);
                    mid_length24++;
                }
                if (south.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[6].elementValue.value) >= 0) {
                    south_total24 = south_total24 + parseFloat(value.weatherElement[6].elementValue.value);
                    south_length24++;
                }
                if (east.indexOf(value.parameter[0].parameterValue) >= 0 && parseFloat(value.weatherElement[6].elementValue.value) >= 0) {
                    east_total24 = east_total24 + parseFloat(value.weatherElement[6].elementValue.value);
                    east_length24++;
                }
            })
            // console.log("北部24小時總雨量", north_total24, "資料筆數:", north_length24);
            // console.log("中部24小時總雨量", mid_total24, "資料筆數:", mid_length24);
            // console.log("南部24小時總雨量", south_total24, "資料筆數:", south_length24);
            // console.log("東部24小時總雨量", east_total24, "資料筆數:", east_length24);

            // 各地區60分鐘總降雨量
            $("#60min_total").on("click", function () {
                $("#myChart2").hide();
                $("#myChart").show();
                $("#exampleModalLabel").text("各地區60分鐘總降雨量");

            });
            // 各地區24小時總降雨量
            $("#24hr_total").on("click", function () {
                $("#myChart2").show();
                $("#myChart").hide();
                $("#exampleModalLabel").text("各地區24小時總降雨量");

            });
            const ctx = document.getElementById('myChart');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['北部', '中部', '南部', '東部'],
                    datasets: [{
                        label: '60分鐘總雨量(mm)',
                        data: [north_total, mid_total, south_total, east_total],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const ctx2 = document.getElementById('myChart2');
            const myChart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['北部', '中部', '南部', '東部'],
                    datasets: [{
                        label: '24小時總雨量(mm)',
                        data: [north_total24, mid_total24, south_total24, east_total24],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    });
    
    function select(array){
        let option="`<option value=''></option>`";
        array.forEach(city=>{
            option=option+`<option value='${city}'>${city}</option>`;
        })
        $("#city").html(option)
    }
    
});
