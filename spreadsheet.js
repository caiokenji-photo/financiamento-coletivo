
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
            if (!isNaN(floatContrib)) {
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
      var myProgress = document.getElementById("myProgress")
      if (100*total/meta < 1) {
        myProgress.innerHTML = (Math.round(100*total/meta)).toFixed(3) + "%"
      } else {
          myProgress.innerHTML = (Math.round(100*total/meta)).toFixed(2) + "%"
      }
    })
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
  })
}

