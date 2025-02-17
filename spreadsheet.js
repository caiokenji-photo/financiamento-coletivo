
const sheetId = '13qmZWONxRXJl46-nPH7tZnRU946xJIVhg7cHGsTQfiA';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Financiamento Coletivo - Caio Kenji (respostas)';

const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')
function init() {
  console.log("INIT")
  const query = encodeURIComponent("Select C, D")
  const url = `${base}&sheet=${sheetName}&tq=${query}`

  fetch(url)
  .then(res => res.text())
  .then(rep => {
            //Apaga textos adicionais e extrai so o JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            const colz = [];
            const tr = document.createElement('tr');
            //Extrai nome das colunas
            jsonData.table.cols.forEach((heading) => {
              let column = heading.label;
                colz.push(column);
                  const th = document.createElement('th');
                  // th.innerText = column;
                  tr.appendChild(th);

                })
            // output.appendChild(tr);
            //Extrai dados das linhas
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    console.log(rowData.c)
                    console.log(rowData.d)
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                  })
                data.push(row);
              })
              processRows(data);
            })
}

function processRows(json) {
  var total = 0.0
  json.forEach((row) => {
    const tr = document.createElement('tr');
        const keys = Object.keys(row);
        keys.forEach((key) => {
            console.log(total + " " + row[key] + " " + key)
         })
      })
      var myBar = document.getElementById("myBar");
      var textGoal = document.getElementById("textGoal")

      if (total <= 20000) {
        console.log("Ainda nao alcancou a meta " + total)
        console.log("My bar width " + 100 * total / 20000 + "vw")
        myBar.style.width = 100 * total / 20000 + "vw";
        missingAmount = 20000-total
        textGoal.innerHTML = "Faltam " + missingAmount + " reais para alcançar a meta!"
        console.log("Faltam " + missingAmount + " reais para alcançar a meta!")
      } else {
        myBar.style.width = "100vw";
        textGoal.innerHTML = "Meta alcançada! VALEU GALERA!"
      }
      myBar.innerHTML = Math.round(100*total/20000) + "%"
      console.log("myBar " + Math.round(100*total/20000) + "vw")
    }

function sortear() {
  var sorteados = document.getElementById("sorteados")
  sorteados.innerHTML += getOS()
  
  var names = [];
  const query = encodeURIComponent("Select C")
  const url = `${base}&sheet=${sheetName}&tq=${query}`
  console.log("Sortear!!!" + url)

  fetch(url)
  .then(res => res.text())
  .then(rep => {
    console.log(rep)
    //Apaga textos adicionais e extrai so o JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    const colz = [];

    //Extrai nome das colunas
    jsonData.table.cols.forEach((heading) => {
      let column = heading.label;
        colz.push(column);                  
        console.log(column)
        })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        const row = {};
        colz.forEach((ele, ind) => {
            row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
            console.log(row[ele])
            names.push(row[ele])
          })
        })
      })
      console.log(Math.floor(Math.random()*names.length))
      console.log(names)
      sorteados.innerHTML += names[Math.floor(Math.random()*names.length)]
    }
    



const userOs = document.querySelector(".os");

let os = "unknow";

function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
}

