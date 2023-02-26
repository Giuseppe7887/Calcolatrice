// UI
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

// icons
import { FontAwesome5 as Icona, Ionicons } from '@expo/vector-icons';

// UX
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { commaNumber } from './comma-sep.js';

const simboloDiviso = "\u00F7";
const simboloPer = "\u00D7";
const simboloPiu = "\u002B";
const simboloUguale = "\u003D";
const simboloMeno = "\u002D";
const simboloVirgola = "\u002C";

const operatori = [simboloDiviso, simboloMeno, simboloPiu, simboloPer, simboloUguale, simboloVirgola];
const corrispondenze = {
  [simboloVirgola]: ".",
  [simboloMeno]: "-",
  [simboloDiviso]: "/",
  [simboloPiu]: "+",
  [simboloPer]: "*",
  [simboloUguale]: "="
};


export default function App() {
  let [lis, setLis] = useState([]);
  let [result, setResult] = useState(0);
  let [mode, setMode] = useState({ mode: 'moon', text: "black", backgound: "white", logo: "#F8770E" });

  function calcola() {
    // eval va in break perche non riesce a calcoare un esoressione che finisce con un operatore quindi uso il try
    try {
      // fammi la somma e buttala nello state dello schermo
      if (!lis.length) return;
      // per ogni elemento di lis traducili in simboli matematici
      const translated = lis.map(x => {
        if (operatori.includes(x)) {
          return corrispondenze[x];
        } else {
          return x;
        };
      });
      const thisResult = eval(translated.join(""));
      // se si trova un errore ritorna
      if (`"${thisResult}"`.includes("e")) return;
      setResult(x => x = thisResult);
      return thisResult;
    } catch (err) {};
  }

  // funzioni della calcolatrice  
  async function getFun(x) {
    // se è il primo elemento non mandarlo a schermo (non puo essere un operatore)
    if (!lis.length) return;
    if(lis.length && operatori.includes(x) && operatori.includes(lis[lis.length -1])){
      let temp = [...lis];
      temp.pop();
      temp.push(x)
      setLis(x=> x=temp);
      if (lis.length == 1) return setResult(0);
      return;
    }
    if (x === "=") {
      // se l'ultimo elemento è una virgola retrun
      if (lis[lis.length - 1] === ",") return;
      // asincronizzazione del set della lista come il risultato e del risultato come 0 al click dell'uguale
      // if(currentNumber.split().includes(",")) return alert('')
      return new Promise(
        function (resolve, reject) {
          resolve(
            setLis([calcola()])
          )
          reject('errore')
        }
      ).then(res => setResult(x => x = 0))
        .catch(err => "errore di calcolo: " + err.message)
    }
    if (x === "D") { // delete all
      setLis([]);
      setResult(0);
      return;
    } else if (x === "C") {
      let temp = [...lis];
      temp.pop();
      setLis(temp);
      if (lis.length == 1) return setResult(0);
      return;
    };

    // butta il valore nella lista per l'eval
    // se è un operatore x ed è uguale all'ultimo elemento nella lista evita, esempio (++)
    if (operatori.includes(x) && lis[lis.length - 1] === x) return;
    // se è un operatore x ma è diverso dall'ultimo elemento nella lista cambialo con quello appena inserito esempio (+-)
    if (operatori.includes(x) && operatori.includes(lis[lis.length - 1]) && lis[lis.length - 1] !== x) {
      let temp1 = [...lis];
      temp1.pop();
      temp1.push(x);
      setLis();
      return;
    }

    // se passa tutti i test butta dentro il simbolo (operatore) calcolando la corrispondenza matematica dell'entità
    var temp = [...lis, x];
    setLis(temp);
  };


  async function getText(testo) {
    // prendi il testo (aluta se un oggetto o una stringa e prendi il valore necessario) ps. se clicca sul bottone riceve oggetto, se sul numero una stringa
    // const testo = typeof e.target._internalFiberInstanceHandleDEV.child.memoizedProps === 'object' ? e.target._internalFiberInstanceHandleDEV.child.memoizedProps.children : e.target._internalFiberInstanceHandleDEV.child.memoizedProps;
   
    if (!lis.length && testo === ",") return;
    // non permettere 0 di fila all'inizio
    if (lis.length === 1 && lis.every(x => x === "0" && testo === "0")) return

    // se la lunghezza di lis è uguale a 1 (secondo giro) l'entry è diverso da 0
    if (lis.length === 1 && testo !== "0") {
      // se è un numero (al scondo giro buttalo dentro)
      if (testo !== "0" && testo !== "," && lis[lis.length - 1] != "0") {
        const temp = [...lis, testo];
        return setLis(temp)
      }
      // se è una virgola al primo giro buttala dentro
      if (testo !== ",") {
        lis.pop()
        setLis(lis)
      }
    }

    // se gia ce una virgola e ne vuole inserire un altra retrun
    if (testo === "," && lis[lis.length - 1] === ",") return;
    if (!testo) return;
    // se il valore essite buttalo nella lista per l'eval

    // se il penultmo è una virgola vedi se l'eval non va in break fai passare, senno è un espressione invalida    
    if (lis[lis.length - 2] === ",") {

      try {
        const prova = [...lis, testo].join("")

        setLis([...lis, testo]);
      } catch (err) {
        console.log(err);
      }

    } else {
      setLis([...lis, testo]);
    }
  };

  useEffect(() => {
    calcola()
  }, [lis]);



  function selectMode() {
    if (mode.mode === 'sunny') {
      setMode(x => x = {
        mode: "moon",
        color: "black",
        backgound: "white",
        text: "black",
        logo: "#FF8600"
      })
    } else {
      setMode(x => x = {
        mode: "sunny",
        color: "white",
        backgound: "#252850",
        text: "white",
        logo: "#FF8600"
      })
    }

  }
  {/*style={{width:65,height:65,backgroundColor:mode.logo, borderRadius:50,display:"flex",alignItems:"center", justifyContent:"center"}}*/ }

  return (
    <View style={[styles.container, { backgroundColor: mode.mode === 'sunny' ? "#252850" : "white" }]}>
      <View style={styles.schermo}>
        <Text style={{ color: mode.text, fontSize: 30 }} numberOfLines={1} adjustsFontSizeToFit> {lis && commaNumber(lis.join(""),".",".")}</Text>
        <Text style={{ fontSize: 50, color: mode.text }} numberOfLines={1} adjustsFontSizeToFit>=  {commaNumber(result,".",".")}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyItem}>
          <TouchableOpacity style={[styles.bottone, { marginTop: 10, backgroundColor: mode.backgound }]} onPress={()=> getFun("D")}><Text style={[styles.textButton, { color: mode.logo }]}>DEL</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(7)}><Text style={[styles.textButton, { color: mode.text }]}>7</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={() => getText(4)}><Text style={[styles.textButton, { color: mode.text }]}>4</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={() => getText(1)}><Text style={[styles.textButton, { color: mode.text }]}>1</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getFun("C")}><Icona name="backspace" size={24} color={mode.logo} style={styles.textButton} /></TouchableOpacity>
        </View>
        <View style={styles.bodyItem}>
          <TouchableOpacity style={[styles.bottone, { marginTop: 10, backgroundColor: mode.backgound }]} onPress={() => selectMode()}><Ionicons name={mode.mode} size={24} color={mode.text} style={styles.textButton} /></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={() => getText(8)}><Text style={[styles.textButton, { color: mode.text }]}>8</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={() => getText(5)}><Text style={[styles.textButton, { color: mode.text }]}>5</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(2)}><Text style={[styles.textButton, { color: mode.text }]}>2</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(0)}><Text style={[styles.textButton, { color: mode.text }]}>0</Text></TouchableOpacity>
        </View>
        <View style={styles.bodyItem}>
          <TouchableOpacity style={[styles.bottone, { marginTop: 10, backgroundColor: mode.backgound }]} onPress={()=> getFun(simboloDiviso)}><Icona name='divide' size={24} color={mode.logo} style={styles.textButton} /></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(9)}><Text style={[styles.textButton, { color: mode.text }]}>9</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(6)}><Text style={[styles.textButton, { color: mode.text }]}>6</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(3)}><Text style={[styles.textButton, { color: mode.text }]}>3</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getText(simboloVirgola)}><Text style={[styles.textButton, { fontSize: 30, color: mode.text }]}>{simboloVirgola}</Text></TouchableOpacity>
        </View>
        <View style={styles.bodyItem}>
          <TouchableOpacity style={[styles.bottone, { marginTop: 10, backgroundColor: mode.backgound }]} onPress={()=> getFun(simboloPer)}><Icona name="times" size={24} color={mode.logo} style={styles.textButton} /></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getFun(simboloMeno)}><Icona size={24} color={mode.logo} name='minus' style={styles.textButton} /></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { backgroundColor: mode.backgound }]} onPress={()=> getFun(simboloPiu)}><Icona size={24} color={mode.logo} name='plus' style={styles.textButton} /></TouchableOpacity>
          <TouchableOpacity style={[styles.bottone, { height: "35.5%", backgroundColor: mode.backgound, alignItems: "flex-start" }]} onPress={()=> getFun(simboloUguale)}>
            <View style={{ backgroundColor: mode.logo, height: "90%", width: "90%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icona name="equals" key={'ciao'} size={24} color={mode.text} style={[styles.textButton]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: "flex",
    flexDirection: "column",
    // backgroundColor:"rgba(100,100,100,0.2)"
  },
  schermo: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 20
    // backgroundColor:"rgba(100,100,100,0.09)"
  },
  body: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bodyItem: {
    width: "25%"
  },
  bottone: {
    backgroundColor: "#FAFAFA",
    width: "90%",
    height: "17%",
    marginBottom: 7,
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
  },
  textButton: {
    fontSize: 25
  }
});
