const onChange = (event, from) => {
  // console.log("onChange this.value ", event, " from ", from);
  const A = new Date(event).getDay();
  let select, array, prop;

  switch (from) {
    case 0: {
      select = startHours;
      prop = "start";
      break;
    }
    case 1: {
      select = endHours;
      prop = "end";
      break;
    }
  }

  // Set hours depending of day of the week of selected date
  // modularize
  array = A !== 5 && A !== 6 ? week : weekend;

  let startHoursSelec = [];
  let endHoursSelec = [];
  let indexCount = 0;

  select.value = 0;
  select.innerHTML = "";
  array.forEach((time, index) => {
    time.forEach((viaTime) => {
      let option = document.createElement("option");

      option.value = indexCount;
      if (prop === "start" && !startHoursSelec.includes(viaTime["startHour"])) {
        option.innerText = `${viaTime["startHour"]}:${viaTime["startMinutes"]
          .toString()
          .padStart(2, "0")}`;
        select.appendChild(option);
        startHoursSelec.push(viaTime["startHour"]);
      }

      if (prop === "end" && !endHoursSelec.includes(viaTime["endHour"])) {
        option.innerText = `${viaTime["endHour"]}:${viaTime["endMinutes"]
          .toString()
          .padStart(2, "0")}`;
        select.appendChild(option);
        endHoursSelec.push(viaTime["endHour"]);
      }
      indexCount++;
    });
  });

  if (!from) endDate.min = startDate.value;
};

const tryout = () => {
  // validate dates and hours
  // Modularize
  if (startHours.value > endHours.value && startDate.value === endDate.value) {
    alert("Duracion de la simulacion no valida");
    return;
  }
  if (startDate.value > endDate.value) {
    alert("Duracion de la simulacion no valida");
    return;
  }

  // Modularize
  const startedOn = new Date(startDate.value);
  let currentDate = startedOn;
  let curretTime = -1;

  msdos.innerHTML = "<p>Resultados de la simulación</p>";
  // console.log("currentDate ", currentDate);
  while (currentDate <= endDate.valueAsDate) {
    if (curretTime !== -1) curretTime = 0;
    else curretTime = startHours.value;

    // Modularize
    const dayIndex = currentDate.getDay();

    collection = dayIndex !== 5 && dayIndex !== 6 ? week : weekend;
    const [fec1, fec2] = [
      currentDate.toISOString().substr(0, 10),
      endDate.value,
    ];

    //Modularieze
    collection.forEach((horarios, index) => {
      // Verifiy hours is inside selecter hours
      if (index < curretTime || (fec1 === fec2 && index > endHours.value)) {
        return;
      }

      simularVuelta(msdos, horarios[0], horarios[1], fec1);
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  alert("Ha finalizado la simulacion");
};

const setAgain = () => {
  startDate.valueAsDate = new Date();
  endDate.valueAsDate = new Date();
  onChange(startDate.value, 0);
  onChange(endDate.value, 1);

  endDate.min = startDate.value;
  msdos.innerHTML = "<p>Resultados de la simulación</p>";
  return false;
};

setAgain();
