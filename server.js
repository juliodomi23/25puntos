// ponytail: seed duplicado del index.html a propósito — server para un demo
// de una sola tarde, no vale la pena compartir código entre cliente y server.
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// 'invit' es el agente que usa quien venga a la demo: tiene historial pero
// el día de hoy arranca en cero, para que capture en vivo delante de la dueña.
const AGENTES_IDS = ['ana', 'luis', 'caro', 'jose', 'mari', 'julio', 'invit'];
const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
const iso = d => d.toISOString().slice(0, 10);

function blank() { return {}; }

function seed() {
  const perfiles = { ana: 1.25, luis: .95, caro: .55, jose: 1.05, mari: .8, julio: 1.1, invit: 1 };
  const data = {};
  let rnd = 42; const rand = () => (rnd = (rnd * 9301 + 49297) % 233280) / 233280;
  for (const aid of AGENTES_IDS) {
    data[aid] = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(hoy); d.setDate(d.getDate() - i);
      if (d.getDay() === 0) continue;
      const f = perfiles[aid] * (0.6 + rand() * 0.8);
      const r = {
        llam: Math.round(9 * f + rand() * 4), citaObt: Math.round(3 * f + rand() * 2),
        refObt: Math.round(1.6 * f + rand()), refCont: Math.round(1.2 * f),
        citasTot: Math.round(2.5 * f + rand()), citasNvas: Math.round(1.4 * f),
        cuestPlan: Math.round(1.5 * f), cuest: Math.round(1.3 * f + rand() * .8),
        cierrePlan: Math.round(f), cierre: rand() < .55 * f ? 1 : 0,
        sol: rand() < .4 * f ? 1 : 0, comision: 0,
      };
      r.comision = r.sol * (2800 + Math.round(rand() * 30) * 100);
      if (i === 0) {
        if (aid === 'caro' || aid === 'invit') continue;   // hoy sin capturar
        for (const k in r) if (k !== 'comision') r[k] = Math.round(r[k] * 0.55);
        r.comision = r.sol * 3200;
      }
      data[aid][iso(d)] = r;
    }
  }
  return data;
}

let DB = { reg: seed(), pros: {}, pipe: {} };

app.get('/api/state', (req, res) => res.json(DB));

app.post('/api/set', (req, res) => {
  const { agente, dia, campo, value } = req.body || {};
  if (!AGENTES_IDS.includes(agente) || !dia || !campo) return res.status(400).end();
  (DB.reg[agente] ||= {});
  (DB.reg[agente][dia] ||= blank());
  DB.reg[agente][dia][campo] = Math.max(0, +value || 0);
  res.json({ ok: true });
});

// las 4 listas de 5 que trae el formato de Excel en sus primeras filas
const LISTAS = ['pros', 'desa', 'venta', 'serv'];
app.post('/api/pros', (req, res) => {
  const { agente, lista = 'pros', index, value } = req.body || {};
  if (!AGENTES_IDS.includes(agente) || !LISTAS.includes(lista) || index == null) return res.status(400).end();
  (DB.pros[agente] ||= {});
  (DB.pros[agente][lista] ||= ['', '', '', '', '']);
  DB.pros[agente][lista][index] = String(value || '').slice(0, 80);
  res.json({ ok: true });
});

// solicitudes de hoy: lista de montos capturados por el agente (el resto —
// comisión, bono — se calcula en el cliente y solo se muestra a la dueña).
app.post('/api/sol', (req, res) => {
  const { agente, dia, list } = req.body || {};
  if (!AGENTES_IDS.includes(agente) || !dia || !Array.isArray(list)) return res.status(400).end();
  (DB.reg[agente] ||= {});
  (DB.reg[agente][dia] ||= blank());
  DB.reg[agente][dia].solicitudes = list.slice(0, 30).map(v => Math.max(0, +v || 0));
  res.json({ ok: true });
});

// cierres en el horno: posibles cierres del agente (no depende del día).
app.post('/api/pipe', (req, res) => {
  const { agente, list } = req.body || {};
  if (!AGENTES_IDS.includes(agente) || !Array.isArray(list)) return res.status(400).end();
  DB.pipe[agente] = list.slice(0, 30).map(x => ({
    prospecto: String(x?.prospecto || '').slice(0, 80),
    monto: Math.max(0, +x?.monto || 0),
    etapa: String(x?.etapa || '').slice(0, 40),
    fecha: String(x?.fecha || '').slice(0, 10),
  }));
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3070;
app.listen(PORT, () => console.log('Panel 25 Puntos demo v2 escuchando en :' + PORT));
