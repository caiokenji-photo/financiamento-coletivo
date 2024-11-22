
const sheetId = '1_04NYnlOYqxBwyZSrisceKUt1FqBrCcJG7QyWXAuhLw';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Financiamento Coletivo - Caio Kenji (respostas)';
const query = encodeURIComponent("Select B, C")
const url = `${base}&sheet=${sheetName}&tq=${query}`

const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')
function init() {
  console.log("AFAF")
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
          console.log(total + " " + key+ " " + row[key])
        })
      })
      var meta = 20000
      var myBar = document.getElementById("myBar");
      var textGoal = document.getElementById("textGoal")
      if (total <= meta) {
        console.log("Ainda nao alcancou a meta " + total)
        console.log("My bar width " + 100 * total / meta + "vw")
        myBar.style.width = 100 * total / meta + "vw";
        missingAmount = meta-total
        textGoal.innerHTML = "Faltam " + missingAmount + " reais para alcançar a meta!"
        console.log("Faltam " + missingAmount + " reais para alcançar a meta!")
      } else {
        myBar.style.width = "100vw";
        textGoal.innerHTML = "Meta alcançada! VALEU GALERA!"
      }
      myBar.innerHTML = Math.round(100*total/meta) + "%"
      console.log("myBar " + Math.round(100*total/meta) + "vw")
    }
