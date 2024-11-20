const sheetId = '1RvSs9mEKyiIBi9JuAZlS5LJWjI9f2ThTe7ozMlFNUBk';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Financiamento - Legaliza o Abbey! (respostas)';
const query = encodeURIComponent("Select B, E, F, G, H, I, J, K")
const url = `${base}&sheet=${sheetName}&tq=${query}`

const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')
function init() {
  console.log("INIT")
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
          if (key.includes("Brinde 1") && row[key] != "" && row[key] != null) {
            total = total + row[key] * 15.0
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("Brinde 2") && row[key] != "" && row[key] != null) {
            total = total + row[key] * 40.0
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("Brinde 3") && row[key] != "" && row[key] != null) {
            total += 80.0
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("CLIENTE VIP") && row[key] != "" && row[key] != null) {
            total += 300.0
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("PATROCINADOR PRATA") && row[key] != "" && row[key] != null) {
            total += 200.0
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("PATROCINADOR OURO") && row[key] != "" && row[key] != null) {
            total += 400
            console.log(total + " " + row[key] + " " + key)
          }
          if (key.includes("DIREITO DE FESTA") && row[key] != "" && row[key] != null) {
            total += 500
            console.log(total + " " + row[key] + " " + key)
          }
        })
      })
      var myBar = document.getElementById("myBar");
      var textGoal = document.getElementById("textGoal")
      if (total <= 5000) {
        console.log("Ainda nao alcancou a meta " + total)
        console.log("My bar width " + 100 * total / 5000 + "vw")
        myBar.style.width = 100 * total / 5000 + "vw";
        missingAmount = 5000-total
        textGoal.innerHTML = "Faltam " + missingAmount + " reais para alcançar a meta!"
        console.log("Faltam " + missingAmount + " reais para alcançar a meta!")
      } else {
        myBar.style.width = "100vw";
        textGoal.innerHTML = "Meta alcançada! VALEU GALERA!"
      }
      myBar.innerHTML = Math.round(100*total/5000) + "%"
      console.log("myBar " + Math.round(100*total/5000) + "vw")
    }
