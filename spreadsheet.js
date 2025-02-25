
const sheetId = '13qmZWONxRXJl46-nPH7tZnRU946xJIVhg7cHGsTQfiA';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Financiamento Coletivo - Caio Kenji (respostas)';

const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')


function init() {
  console.log("INIT")
  const query = encodeURIComponent("Select D")
  const url = `${base}&sheet=${sheetName}&tq=${query}`

  var total = 0.0;
  var meta = 20000;
  fetch(url)
  .then(res => res.text())
  .then(rep => {
    //Apaga textos adicionais e extrai so o JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    var colz = []
    //Extrai nome das colunas
    jsonData.table.cols.forEach((heading) => {
      let column = heading.label;
      colz.push(column)
    })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        colz.forEach((ele, ind) => {
          if (rowData.c[ind] != null) {
            var floatContrib = parseFloat(rowData.c[ind].v)
            if (floatContrib != NaN) {
              console.log(total + " contribuicao " + floatContrib)
              total += floatContrib
            } 
          }    
      })
      })
      var myBar = document.getElementById("myBar");
      var textGoal = document.getElementById("textGoal")

      if (total <= meta) {
        myBar.style.width = 100 * total / meta + "vw";
        missingAmount = meta-total
        textGoal.innerHTML = "Faltam " + missingAmount + " reais para alcançar a meta!"
      } else {
        myBar.style.width = "100vw";
        textGoal.innerHTML = "Meta alcançada! VALEU GALERA!"
      }
      myBar.innerHTML = Math.round(100*total/meta) + "%"
    })

    var s = localStorage.getItem("sorteados")
    if (s != null) {
      var sorteados = document.getElementById("sorteados")
      sorteados.innerHTML += " " + s
    }
}


function sortear() {
  var sorteados = document.getElementById("sorteados")
  
  let names = [];
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
      })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        colz.forEach((ele, ind) => {
            if (rowData.c[ind] != null) {
              names.push(rowData.c[ind].v);
              console.log("Names " + rowData.c[ind].v)
           } 
        })
    })
    let rand = Math.random()
    let len = names.length * 1.0
    let indice_sorteado = Math.floor(rand*len)
    let sorteado = names[indice_sorteado]
    sorteados.innerHTML += sorteado+"\n"
    localStorage.setItem("sorteados", sorteados.innerHTML)
    salvarSorteado(sorteado)
  })
}

function readK() {
  const query = encodeURIComponent("Select K")
  const url = `${base}&sheet=${sheetName}&tq=${query}`
  let ks = [];
  fetch(url)
  .then(res => res.text())
  .then(rep => {
    //Apaga textos adicionais e extrai so o JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    var colz = []
    //Extrai nome das colunas
    jsonData.table.cols.forEach((heading) => {
      let column = heading.label;
      colz.push(column)
    })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        colz.forEach((ele, ind) => {
          if (rowData.c[ind] != null) {
            ks.push(rowData.c[ind].v)
          }    
        })
      })
    })
  return ks;
}

function salvarSorteado(sorteado) {
  var params = {
    "majorDimension": "ROWS",
    "values": [
      [sorteado]
    ],
    "range":"Sorteio!A1",
  }
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_REDIRECT_URI=""

  const client = google.accounts.oauth2.initTokenClient({
    client_id: 'YOUR_GOOGLE_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    callback: (response) => {
  
    },
  });
  var k = readK()
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://sheets.googleapis.com/v4/spreadsheets/{' + sheetId+ '}/values/Sorteio!A1?:append');
  xhr.send(JSON.stringify(params));
}



