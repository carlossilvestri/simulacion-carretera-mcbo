const simularVuelta = (msdos, sprintNorthToSouth, sprintSouthToNorth, fec) => {
  /*Vehiculos por minuto */

  total = [sprintNorthToSouth.totals, sprintSouthToNorth.totals];

  resetVariables();

  ul = document.createElement("ul");
  createHeader(fec, sprintNorthToSouth);
  verifyHolyDay(fec);
  // For each minute
  for (let t = 0; t <= sprintNorthToSouth.duration; t++) {
    simulateLap(sprintNorthToSouth, 0, fec, t);
    simulateLap(sprintSouthToNorth, 1, fec, t);
  }

  const med = calculateAverage();

  /**Informe final de la iteracion */
  createInformer(msdos, sprintNorthToSouth, sprintSouthToNorth, med);
};

const simulateLap = (sprint, i, fec, t) => {
  newVehicleAcumm = 0;

  /**Si no hay eventos, calcular la probabilidad de que ocurra alguno */
  calculateEvent(sprint, t, i);
  /**Finalizó el evento, alertar al usuario */
  finalizeEvent(sprint, t, i);

  // Hacer avanzar los vehiculos
  handleVehicles(i);
  /**Calcula la cantidad de vehiculos que ingresarán en este minuto */
  handleNewVehicle(sprint, t, i);

  /**Incluir la cantidad actual para calcular la media */
  averageAcum(t, i);
  console.log(getTime(t, sprint));
  // Manejar el uso de la via extra
  handleExtraVia(sprint, t, i);
};

const calculateEvent = (sprint, t, i) => {
  if (!interrupcion[i].activo)
    interrupcion[i].activo = Math.random() <= probInterrupcion[i];

  /**Se inició un evento, alertar al usuario */
  if (interrupcion[i].activo && !interrupcion[i].fin) {
    interrupcion[i].fin = t + 5 + Math.floor(Math.random() * 11);
    interrupcion[i].razon = razones[Math.floor(Math.random() * 6)];
    const li = document.createElement("li");
    li.innerHTML = `
           <p class="dashed" >
              <span class="alert">Alerta</span><br/>
              Ha iniciado: ${interrupcion[i].razon}<br/>
              Via : ${getVia(i)} Hora : ${getTime(t, sprint)}<br/>
              Finaliza a las ${getTime(interrupcion[i].fin, sprint)}<br/>
           </p>
        `;
    ul.appendChild(li);
  }
};

const finalizeEvent = (sprint, t, i) => {
  if (
    interrupcion[i].fin &&
    interrupcion[i].fin !== -1 &&
    interrupcion[i].fin <= t
  ) {
    const li = document.createElement("li");
    li.innerHTML = `
             <p class="dashed">
                <span style="margin-left: 2rem">Alerta</span><br/>
                Ha finalizado: ${interrupcion[i].razon}<br/>
                Via : ${getVia(i)}<br/>
                Finalizada a las ${getTime(interrupcion[i].fin, sprint)}<br/>
             </p>
          `;
    ul.appendChild(li);
    /**Resetear las variables del evento */
    interrupcion[i].fin = null;
    interrupcion[i].activo = false;
  }
};

const handleVehicles = (i) => {
  if (vehiculos[i]) {
    vehiculos[i] = vehiculos[i].reduce((coleccion, vehiculo, index) => {
      /**Durante un evento los vehiculos no avanzan */
      if (interrupcion[i].activo && !(terceraVia && terceraVia.para === i))
        return [...coleccion, vehiculo];

      /**Sacar del los vehiculos en la via los que ya llegaron */
      if (vehiculo.go() === 0) {
        ++llegaron[i];
        return coleccion;
      }
      /**Mantener los que aun no llegan */
      return [...coleccion, vehiculo];
    }, []);
  }
};

const handleNewVehicle = (sprint, t, i) => {
  if (total[i]) {
    let add =
      (Math.random() * (sprint.totals * 2 - 0) + 0) / sprint.travelDuration;
    newVehicleAcumm += add % 1;

    if (newVehicleAcumm >= 1) {
      add++;
      newVehicleAcumm--;
    }

    vpm[i].push(add);

    if (add >= 1) {
      for (let k = 0; k < add; k++) {
        vehiculos[i].push(new Vehiculo(t, sprint.travelDuration));
      }
    }
  }
};

const averageAcum = (t, i) => {
  media[i].push(vehiculos[i].length);
  if (max[i].cant < vehiculos[i].length)
    max[i] = { cant: vehiculos[i].length, time: t };
};

const handleExtraVia = (sprint, t, i) => {
  if (vehiculos[i].length >= densidadMax && !terceraVia) {
    if (den && den.densidad < vehiculos[i].length / 12e3) {
      den = {
        cant: vehiculos[i].length,
        time: t,
        densidad: vehiculos[i].length / 12e3,
        via: i,
      };
    } else if (!den) {
      den = {
        cant: vehiculos[i].length,
        time: t,
        densidad: vehiculos[i].length / 12e3,
        via: i,
      };
    }
  }

  /**De ser necesario, activar la via auxiliar */
  if (den && !terceraVia) {
    terceraVia = { para: den.via, fin: t + 120 };
    const li = document.createElement("li");
    li.innerHTML = `
          <p class="dashed">
             A las ${getTime(t, sprint)}<br/>
            <span class="activated">Se activo la via axiliar para el sentido ${getVia(
              terceraVia.para
            )}</span><br/>
             Vehiculos ${vehiculos[i].length}<br/>
             Para un tope vehicular de 125 <br/>
             Finaliza a las ${getTime(terceraVia.fin, sprint)}<br/>
          </p>
       `;

    ul.appendChild(li);
  }
  den = null;

  /**Alertar cuando la tercera via se desactive */
  if (terceraVia && terceraVia.fin <= t) {
    const li = document.createElement("li");
    li.innerHTML = `
          <p class="dashed">
             <span class="available">La via auxiliar vuelve a estar disponible</span><br/>
             Finalizada a las ${getTime(terceraVia.fin, sprint)}<br/>
          </p>
       `;
    ul.appendChild(li);
    terceraVia = null;
    den = null;
  }
};

const resetVariables = () => {
  media = [[], []];
  max = [
    { time: 0, cant: 0 },
    { time: 0, cant: 0 },
  ];

  llegaron = [0, 0];
  salieron = [0, 0];
  terceraVia = null;
  den = null;

  interrupcion = [
    { razon: "Manifestacion LGBTQ+", fin: null, activo: false },
    { razon: "Manifestacion LGBTQ+", fin: null, activo: false },
  ];

  vehiculos = [[], []];

  vpm = [[], []];
};

const createHeader = (fec, sprint) => {
  const fe = document.createElement("li");
  fe.innerHTML = `
               <p style="text-align: center">
                 Simulando ${fec}
               </p>
            `;
  ul.appendChild(fe);
  const ciclo = document.createElement("li");
  ciclo.innerHTML = `
               <p style="text-align: center">
                 Ciclo ${
                   sprint.startHour
                 }:${sprint.startMinutes.toString().padStart(2, "0")} - ${
    sprint.endHour
  }:${sprint.endMinutes.toString().padStart(2, "0")} </p>`;
  ul.appendChild(ciclo);
};

const verifyHolyDay = (fec) => {
  if (fec.endsWith("12-24") || fec.endsWith("12-31")) {
    interrupcion[1].razon = "festividad";
    interrupcion[1].fin = -1;
    interrupcion[1].activo = true;
    interrupcion[2].razon = "festividad";
    interrupcion[2].fin = -1;
    interrupcion[2].activo = true;

    const li = document.createElement("li");
    li.innerHTML = `
         <p class="dashed" >
            <span style="margin-left: 2rem">Alerta</span><br/>
            Por ser día festivo nacional<br/>
            Tope de Flujo Vehicular es decir el colapso total<br/>
            de la vía con un tiempo de recorrido indefinido<br/>
         </p>
      `;
    ul.appendChild(li);
  }
};

const calculateAverage = () => {
  const med = [];

  for (let i = 0; i < 2; i++) {
    const element = media[i];

    let middle = Math.floor(element.length / 2);
    if (element.length % 2 === 1) {
      med.push(element[middle]);
    } else {
      med.push((element[middle - 1] + element[middle]) / 2);
    }
  }
  return med;
};

const createInformer = (msdos, sprintNorthToSouth, sprintSouthToNorth, med) => {
  const li = document.createElement("li");
  let vpmNorthSouth =
    vpm[0].reduce((acumm, current) => acumm + current) / vpm[0].length;
  let vpmSouthNorth =
    vpm[1].reduce((acumm, current) => acumm + current) / vpm[1].length;

  vpmNorthSouth = Math.round(vpmNorthSouth);
  vpmSouthNorth = Math.round(vpmSouthNorth);

  li.innerHTML = `
   <p class="dashed">
      <span class="report">Reporte final del ciclo</span><br/>
      <span class="report-vias">${getVia(0)}</span><br/>
      <span class="report-results">Promedio de ingreso de vehiculos por minuto : ${vpmNorthSouth}</span><br/>
      <span class="report-results">Mayor cantidad de vehiculos : ${
        max[0].cant
      } a las ${getTime(max[0].time, sprintNorthToSouth)}</span><br/>
      <span class="report-results">Media de vehiculos en la via: ${
        med[0]
      }</span><br/>
      <br/>
      <span class="report-vias">${getVia(1)}</span><br/>
      <span class="report-results">Promedio de ingreso de vehiculos por minuto : ${vpmSouthNorth}<br/>
      <span class="report-results">Mayor cantidad de vehiculos : ${
        max[1].cant
      } a las ${getTime(max[1].time, sprintSouthToNorth)}</span><br/>
      <span class="report-results">Media de vehiculos en la via: ${
        med[1]
      }</span><br/
   </p>
   `;
  ul.appendChild(li);

  msdos.appendChild(ul);
};

const getTime = (minutes, sprint) => {
  /*console.log(minutes);
  console.log(sprint);*/
  let hh = sprint.startHour + Math.floor(minutes / 60);
  let mm = sprint.startMinutes + minutes - Math.floor(minutes / 60) * 60;

  if (mm >= 60) {
    mm -= 60;
    hh++;
  }
  const hora =
    hh.toString().padStart(3, " ") + ":" + mm.toString().padStart(2, "0");
  return hora;
};

const getVia = (via = via) => {
  return via ? "Sur-Norte" : "Norte-Sur";
};

class Vehiculo {
  constructor(startHour, tiempo) {
    this.tiempoRestante = tiempo;
    this.startHour = startHour;
  }
  go() {
    if (this.tiempoRestante === 0) return this.tiempoRestante;
    this.tiempoRestante--;
    return this.tiempoRestante;
  }
}

var media = [
  [], //Media de vehiculos en la via norte sur
  [], //Media de vehiculos en la via sur norte
];
var max = [
  { time: 0, cant: 0 }, //Maxima cantidad de vehiculos en una hora en la via norte sur
  { time: 0, cant: 0 }, //Maxima cantidad de vehiculos en una hora en la via sur norte
];

/**Cuantos vehiculos han llegado al final de la autopista */
var llegaron = [0, 0];
/**Cuantos vehiculos han ingresado a la autopista en este ciclo */
var salieron = [0, 0];
/**Control de la tercera via */
var terceraVia = null;
/**Control de densidad vehiculas */
var den;

/**Control de las manifestaciones */
var interrupcion = [
  { razon: "Manifestacion LGBTQ+", fin: null, activo: false },
  { razon: "Manifestacion LGBTQ+", fin: null, activo: false },
];

var vehiculos = [[], []];

var vpm = [[], []];

var total = [];

var ul;

var newVehicleAcumm = 0;
