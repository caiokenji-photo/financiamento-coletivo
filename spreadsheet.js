
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

function salvarSorteado(sorteado) {
  var params = {
    "key": access_token,
    "range":"Sorteio!A1",
    "majorDimension": "ROWS",
    "values": [
      [sorteado]
    ],
  }
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', 'https://sheets.googleapis.com/v4/spreadsheets/{' + sheetId+ '}/values/Sorteio!A1?valueInputOption=USER_ENTERED');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send(JSON.stringify(params));
  
}

// Discovery doc URL for APIs used by the quickstart
const CLIENT_ID = '78429735597-9gc1oejj42ofa33ev5qbnk081mmadm15.apps.googleusercontent.com ';
const API_KEY = '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';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await listMajors();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       */
      async function listMajors() {
        let response;
        try {
          // Fetch first 10 files
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sorteio!A1',
          });
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
          document.getElementById('content').innerText = 'No values found.';
          return;
        }
        // Flatten to string to display
        const output = range.values
        document.getElementById('content').innerText = output;
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

