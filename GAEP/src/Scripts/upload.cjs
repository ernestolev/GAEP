const admin = require("firebase-admin");
const data = {
    "exalumnos":[
     {
      "NOMBRE": "JESÚS WILLIAM ABURTO CASTILLA",
      "DNI": 80295507
     },
     {
      "NOMBRE": "JUAN ALBERTO ACEVEDO ROMÁN",
      "DNI": 8977631
     },
     {
      "NOMBRE": "BRANDO JAIR AGUIRRE CHÓQUEZ",
      "DNI": 700747848
     },
     {
      "NOMBRE": "LUIS JAVIER ALEJOS ALMEYDA",
      "DNI": 45497129
     },
     {
      "NOMBRE": "HENRY YURI ALEJOS CUADROS",
      "DNI": 71472219
     },
     {
      "NOMBRE": "CÉSAR AUGUSTO ALMEYDA ÁVALOS",
      "DNI": 21814725
     },
     {
      "NOMBRE": "CECILIA MARJORIET ALMEYDA CARAZA",
      "DNI": 74866441
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL ALMEYDA SIFUENTES",
      "DNI": 21870314
     },
     {
      "NOMBRE": "MANUEL JESÚS ALMEYDA SOTELO",
      "DNI": 218500843
     },
     {
      "NOMBRE": "JUAN ALBERTO ALMEYDA YATACO",
      "DNI": 21782698
     },
     {
      "NOMBRE": "JUAN PABLO AMORETTI MENDOZA",
      "DNI": 44012921
     },
     {
      "NOMBRE": "JORGE ALONSO AMORETTI YATACO",
      "DNI": 47303278
     },
     {
      "NOMBRE": "NÉSTOR ANTONIO AMORETTI ZAMBRANO",
      "DNI": 21807024
     },
     {
      "NOMBRE": "VÍCTOR EDUARDO ANCHANTE YATACO",
      "DNI": 21869402
     },
     {
      "NOMBRE": "JUAN EDILBERTO ANGULO YATACO",
      "DNI": 21787231
     },
     {
      "NOMBRE": "CHRISTIAN FERNANDO ANGULO YATACO",
      "DNI": 21878713
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL ANICAMA VENTURA",
      "DNI": 21802866
     },
     {
      "NOMBRE": "JUAN ENRIQUE ANTÓN CHIRINOS",
      "DNI": 41746473
     },
     {
      "NOMBRE": "LUIS ORLANDO ANTÓN SAKO"
     },
     {
      "NOMBRE": "JORGE RICARDO ANTÓN VIVANCO",
      "DNI": 21788040
     },
     {
      "NOMBRE": "NICANOR LIDO APOLAYA DE LA CRUZ",
      "DNI": 21867437
     },
     {
      "NOMBRE": "JOSÉ JESÚS GONZALO APOLAYA SÁNCHEZ",
      "DNI": 21862152
     },
     {
      "NOMBRE": "CÉSAR JESÚS APOLAYA VIVANCO",
      "DNI": 21862527
     },
     {
      "NOMBRE": "LUIS EUSEBIO AURIS LÉVANO",
      "DNI": 21817384
     },
     {
      "NOMBRE": "BERNARDO MARTÍN ÁVALOS ESPINOZA",
      "DNI": 21884167
     },
     {
      "NOMBRE": "HERBERT GUILLERMO ÁVALOS GARCÍA",
      "DNI": 43506662
     },
     {
      "NOMBRE": "EDGAR HUGO ÁVALOS MARTÍNEZ",
      "DNI": 21858854
     },
     {
      "NOMBRE": "WLFREDO ÁVALOS MARTÍNEZ",
      "DNI": 21819302
     },
     {
      "NOMBRE": "WALTER FREDY ÁVALOS MARTÍNEZ",
      "DNI": 21835958
     },
     {
      "NOMBRE": "DENNIS ÁVALOS MARTINEZ",
      "DNI": 21857077
     },
     {
      "NOMBRE": "DENNIS YEISSON ÁVALOS MARTÍNEZ",
      "DNI": 48375552
     },
     {
      "NOMBRE": "LUIS ENRIQUE ÁYBAR PENJEAN",
      "DNI": 21796433
     },
     {
      "NOMBRE": "LIBERTO NARCISO ÁYBAR PEVE",
      "DNI": 21843320
     },
     {
      "NOMBRE": "VÍCTOR HUGO AYONA HERRERA",
      "DNI": 41784572
     },
     {
      "NOMBRE": "LUIS ALBERTO AZNARÁN GÓMEZ",
      "DNI": 21781886
     },
     {
      "NOMBRE": "RICHARD EDILBERTO BOADA CAMPOS",
      "DNI": 43358474
     },
     {
      "NOMBRE": "JORGE JULIO LUIS BUENDÍA NAPA",
      "DNI": 42762724
     },
     {
      "NOMBRE": "JUSTO GERMÁN CABOS CORNEJO",
      "DNI": 21860140
     },
     {
      "NOMBRE": "DANFFER MARTÍN CABRERA MATTA",
      "DNI": 21781112
     },
     {
      "NOMBRE": "OMAR CABRERA ROJO",
      "DNI": 21795018
     },
     {
      "NOMBRE": "JUAN VICTOR CAHUANA DE LA CRUZ",
      "DNI": 21858328
     },
     {
      "NOMBRE": "EDUARDO JAVIER CAHUANA GUILLÉN",
      "DNI": 43692418
     },
     {
      "NOMBRE": "JUAN MANUEL CAMPOS LÉVANO",
      "DNI": 43272475
     },
     {
      "NOMBRE": "JORGE ALFREDO CAPURRO MARTÍNEZ",
      "DNI": 21814754
     },
     {
      "NOMBRE": "ÁNGEL ALFONSO CARBAJAL ALMEYDA",
      "DNI": 21861762
     },
     {
      "NOMBRE": "ROLANDO ALFREDO CÁRDENAS ANI CAMA",
      "DNI": 21812019
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL CÁRDENAS PÁUCAR"
     },
     {
      "NOMBRE": "JORGE MIGUEL CÁRDENAS SAMÁN",
      "DNI": 21857761
     },
     {
      "NOMBRE": "GERMÁN JULIO CASAS BERDEJO",
      "DNI": 21565222
     },
     {
      "NOMBRE": "LUIS JESÚS CASIANO ÁVALOS",
      "DNI": 21793537
     },
     {
      "NOMBRE": "HÉCTOR CASTILLA ARIAS",
      "DNI": 21833550
     },
     {
      "NOMBRE": "LUIS ALBERTO CASTILLA CARBAJAL",
      "DNI": 21787815
     },
     {
      "NOMBRE": "JORGE LUIS CASTILLA LÉVANO",
      "DNI": 8156785
     },
     {
      "NOMBRE": "HENRY DOMINGO CASTRO RÍOS",
      "DNI": 21819332
     },
     {
      "NOMBRE": "AUGUSTO GUILLERMO CHÁVEZ APOLAYA",
      "DNI": 21815989
     },
     {
      "NOMBRE": "CARLOS ERNESTO CHÁVEZ CASTRO",
      "DNI": 21802287
     },
     {
      "NOMBRE": "JEYSON JOSIAS CHÁVEZ DÁVILA",
      "DNI": 21868396
     },
     {
      "NOMBRE": "JOAQUÍN JUNIOR CHÁVEZ ESQUIVEL",
      "DNI": 75843922
     },
     {
      "NOMBRE": "ROBERT MANUEL CHOLALA GRANDEZ",
      "DNI": 21867329
     },
     {
      "NOMBRE": "RODOLFO CHOQUE ORDÓÑEZ",
      "DNI": 21882372
     },
     {
      "NOMBRE": "FREDY CONDORI CUNO",
      "DNI": 40489647
     },
     {
      "NOMBRE": "JESÚS HUMBERTO CÓRDOVA AMORETTI",
      "DNI": 21806221
     },
     {
      "NOMBRE": "LUIS ALFONSO CUBA TRILLO",
      "DNI": 21806663
     },
     {
      "NOMBRE": "JOSÉ LUIS CUETO LUQUE",
      "DNI": 21865196
     },
     {
      "NOMBRE": "ÓSCAR ROBERTO DAGNINO MARTÍNEZ",
      "DNI": 21860870
     },
     {
      "NOMBRE": "HÉCTOR ARTURO DÁVALOS FERREYRA",
      "DNI": 21865295
     },
     {
      "NOMBRE": "CÉSAR DE LA CRUZ CHUMBIAUCA",
      "DNI": 21794892
     },
     {
      "NOMBRE": "GERARDO JULIÁN DE LA CRUZ HUAMÁN",
      "DNI": 21841099
     },
     {
      "NOMBRE": "CHRISTIAN ANDRÉS DE LA CRUZ VALENZUELA",
      "DNI": 43638236
     },
     {
      "NOMBRE": "BLAS RUBÉN DE LA CRUZ VILLAR",
      "DNI": 21871665
     },
     {
      "NOMBRE": "NGO JOSÉ DEL CARMEN DIANDERAS DE LA CRUZ",
      "DNI": 21864893
     },
     {
      "NOMBRE": "JOSÉ MANUEL DÍAZ CAMACHO",
      "DNI": 45648047
     },
     {
      "NOMBRE": "JOSÉ MEDARDO DÍAZ NES TÁREZ",
      "DNI": 21791259
     },
     {
      "NOMBRE": "VÍCTOR ANTONIO DONAYRE GUGLIERMI",
      "DNI": 21799348
     },
     {
      "NOMBRE": "JESUS ELÍAS YATACO",
      "DNI": 21862312
     },
     {
      "NOMBRE": "ALFREDO ESTEBAN FAJARDO ALMEIDA",
      "DNI": 41463022
     },
     {
      "NOMBRE": "ROQUE MANUEL FÉLIX GUERRA",
      "DNI": 21867774
     },
     {
      "NOMBRE": "ÁNGEL GABRIEL FÉLIX VÉLIZ",
      "DNI": 7508340
     },
     {
      "NOMBRE": "MARINO ALEX FERNÁNDEZ LUYO",
      "DNI": 80063655
     },
     {
      "NOMBRE": "JUAN JOSÉ FIGUEROA DE RIVERA",
      "DNI": 21859731
     },
     {
      "NOMBRE": "SEVERIANO ANTONIO FLORES MARCOS",
      "DNI": 7444473
     },
     {
      "NOMBRE": "DANIEL AUGUSTO FLORES PALOMINO",
      "DNI": 46029989
     },
     {
      "NOMBRE": "MARCOS ANTONIO GALA DÁVALOS",
      "DNI": 21817873
     },
     {
      "NOMBRE": "JOSÉ GÁLVEZ BARRERA",
      "DNI": 21795200
     },
     {
      "NOMBRE": "NOÉ LUIS GARCÍA CARRIZALES",
      "DNI": 21823688
     },
     {
      "NOMBRE": "LUIS FERNANDO GARCÍA CHACALIAZA",
      "DNI": 21862488
     },
     {
      "NOMBRE": "ARTURO ROBINSON GARCIA HERNÁNDEZ",
      "DNI": 21822898
     },
     {
      "NOMBRE": "*ELISBÁN NELTALÍ GARCÍA ORBEGOSO",
      "DNI": 40786604
     },
     {
      "NOMBRE": "FREDDY AUGUSTO GARCÍA ORTIZ",
      "DNI": 21882453
     },
     {
      "NOMBRE": "ORLANDO ALBERTO GARCÍA RONCEROS",
      "DNI": 21873970
     },
     {
      "NOMBRE": "GIOVANNY ALEXIS GARCIA URIBE",
      "DNI": 40607609
     },
     {
      "NOMBRE": "FÉLIX RÓGER GARCÍA-RAMÍREZ GARCÍA",
      "DNI": 10429401
     },
     {
      "NOMBRE": "MARTÍN DOMINGO GENTILLE BARRIOS",
      "DNI": 21846214
     },
     {
      "NOMBRE": "CESAR JUAN DE DIOS GONZALES TASAYCO",
      "DNI": 10278425
     },
     {
      "NOMBRE": "JAIME RAÚL GONZALES ATÚNCAR",
      "DNI": 21863784
     },
     {
      "NOMBRE": "NÉSTOR PEDRO GUTIÉRREZ MUÑOZ",
      "DNI": 21787483
     },
     {
      "NOMBRE": "PEDRO FRANCISCO GUZMÁN VÉLIZ",
      "DNI": 21806162
     },
     {
      "NOMBRE": "JAIME RAÚL HERNÁNDEZ FELIPA",
      "DNI": 218100248
     },
     {
      "NOMBRE": "JUAN CARLOS HERNÁNDEZ HUAMÁN",
      "DNI": 41013675
     },
     {
      "NOMBRE": "FLORENCIO VICTOR HERNANDEZ RIVERA",
      "DNI": 8353862
     },
     {
      "NOMBRE": "LUIS ALBERTO HERRERA MUNAYCO",
      "DNI": 21870503
     },
     {
      "NOMBRE": "OMAR ALEJANDRO HIGAKI SILVA",
      "DNI": 21795935
     },
     {
      "NOMBRE": "ÓSCAR ALBERTO HUALLANCA BENAVIDES",
      "DNI": 21799725
     },
     {
      "NOMBRE": "ALFREDO HUAMÁN NAPA",
      "DNI": 21860362
     },
     {
      "NOMBRE": "ANTONIO EMILIO HUAMÁN NAPA",
      "DNI": 21795222
     },
     {
      "NOMBRE": "ABRAHAM HUAMÁN NAPA",
      "DNI": 21813647
     },
     {
      "NOMBRE": "FERNANDO JACOBO CASTILLA",
      "DNI": 21797006
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL JANAMPA VILLAVICENCIO",
      "DNI": 21569722
     },
     {
      "NOMBRE": "EDGAR JAVIER JAVE MATÍAS",
      "DNI": 41413793
     },
     {
      "NOMBRE": "SILVIO ALBERTO JAYO MUÑANTE",
      "DNI": 21801666
     },
     {
      "NOMBRE": "VÍCTOR BRUM JOYA CHACHICO",
      "DNI": 70325085
     },
     {
      "NOMBRE": "RICHARD ALFREDO LÁZARO APOLAYA",
      "DNI": 21807138
     },
     {
      "NOMBRE": "JUAN FELIPE LEÓN FLORES",
      "DNI": 21783514
     },
     {
      "NOMBRE": "VÍCTOR CIRILO LÉVANO ANGULO",
      "DNI": 21868978
     },
     {
      "NOMBRE": "JESÚS ALBERTO LÉVANO CÁRDENAS",
      "DNI": 21884488
     },
     {
      "NOMBRE": "JOSÉ SIMON LEVANO CARPIO",
      "DNI": 21794074
     },
     {
      "NOMBRE": "VÍCTOR GERARDO LÉVANO CARPIO",
      "DNI": 7576626
     },
     {
      "NOMBRE": "YVÁN FRANCISCO LÉVANO CASAS",
      "DNI": 45155922
     },
     {
      "NOMBRE": "MANUEL JESÚS LÉVANO HUAMÁN",
      "DNI": 21863023
     },
     {
      "NOMBRE": "CÉSAR CONCEPCIÓN LÉVANO MATTA",
      "DNI": 41329503
     },
     {
      "NOMBRE": "CÉSAR MIGUEL LÉVANO TASAYCO",
      "DNI": 21870439
     },
     {
      "NOMBRE": "MARIO LÉVANO TASAYCO",
      "DNI": 42832982
     },
     {
      "NOMBRE": "JOSÉ WILLY LÉVANO TORRES",
      "DNI": 21798408
     },
     {
      "NOMBRE": "FELIBERTO RAÚL LÉVANO TORRES",
      "DNI": 217925009
     },
     {
      "NOMBRE": "HILARIO LÉVANO UGARTE",
      "DNI": 21797420
     },
     {
      "NOMBRE": "PERCY ALFREDO LIRA PEÑA",
      "DNI": 21795792
     },
     {
      "NOMBRE": "TULIO FÉLIX LIRA PEÑA",
      "DNI": 21819620
     },
     {
      "NOMBRE": "LUIS ALBERTO LLANCARI MEDINA",
      "DNI": 21806854
     },
     {
      "NOMBRE": "ALDO JAVIER LOAYZA BARRUTIA",
      "DNI": 21796851
     },
     {
      "NOMBRE": "FREDDY ARTURO LOCK RIVAS",
      "DNI": 21870682
     },
     {
      "NOMBRE": "WALTER ANTONIO LÓPEZ ANTÓN",
      "DNI": 76565815
     },
     {
      "NOMBRE": "ALEJANDRO SANTOS LOYOLA SARAVIA",
      "DNI": 21820684
     },
     {
      "NOMBRE": "RAFAEL JESÚS LOZANO MENDOZA",
      "DNI": 21862944
     },
     {
      "NOMBRE": "JOSÉ FELIPE LURITA PEÑA",
      "DNI": 21887465
     },
     {
      "NOMBRE": "JUAN JOSÉ MAGALLANES APOLAYA",
      "DNI": 21807848
     },
     {
      "NOMBRE": "HUGO SANTOS MAGALLANES BAUTISTA",
      "DNI": 21853777
     },
     {
      "NOMBRE": "JAVIER DOMINGO MAGALLANES BAUTISTA",
      "DNI": 21854309
     },
     {
      "NOMBRE": "CARLOS SEVERIANO MAGALLANES BAUTISTA",
      "DNI": 43219717
     },
     {
      "NOMBRE": "LUIS ANGEL MAGALLANES CARBAJAL",
      "DNI": 21879021
     },
     {
      "NOMBRE": "FREDDY ALCIDES MAGALLANES PACHAS",
      "DNI": 21811843
     },
     {
      "NOMBRE": "MARCO ANTONIO MAGALLANES PACHAS",
      "DNI": 21812167
     },
     {
      "NOMBRE": "EULOGIO AGUSTIN MARALLANO MARCOS",
      "DNI": 21794938
     },
     {
      "NOMBRE": "OSCAR YVAN MARCHÁN PÉREZ",
      "DNI": 21876936
     },
     {
      "NOMBRE": "JUAN HUMBERTO MARCOS RIVADENEYRA",
      "DNI": 21805658
     },
     {
      "NOMBRE": "JOSÉ LUIS MÁRQUEZ VÁSQUEZ",
      "DNI": 21825030
     },
     {
      "NOMBRE": "ERIC PABLO MARTICORENA AGUIRRE",
      "DNI": 41785075
     },
     {
      "NOMBRE": "MARTÍN JAIME MARTÍNEZ CARRASCAL",
      "DNI": 21871275
     },
     {
      "NOMBRE": "JHONY LUIS MARTÍNEZ GUERRA",
      "DNI": 21786577
     },
     {
      "NOMBRE": "JORGE LUIS MARTÍNEZ MENDOZA",
      "DNI": 21780810
     },
     {
      "NOMBRE": "EDGAR FERNANDO MARTÍNEZ QUISPE",
      "DNI": 21876997
     },
     {
      "NOMBRE": "PERCY HERBERT MARTÍNEZ ROSAS",
      "DNI": 21819333
     },
     {
      "NOMBRE": "ALFREDO MARTÍNEZ TASAYCO",
      "DNI": 21869092
     },
     {
      "NOMBRE": "PETER MARTÍNEZ TORRES",
      "DNI": 21877075
     },
     {
      "NOMBRE": "VICTOR MATEO BOHÓRQUEZ",
      "DNI": 43640258
     },
     {
      "NOMBRE": "FREDY ANTONO MATÍAS LUJÁN",
      "DNI": 21788744
     },
     {
      "NOMBRE": "MAUREN ARTURO MAUROLAGOITIA VALDIVIES( 21863841"
     },
     {
      "NOMBRE": "JONNY JESÚS MELO CAMPOS",
      "DNI": 21782105
     },
     {
      "NOMBRE": "JOSÉ LUIS MENDOZA CANALES",
      "DNI": 21876964
     },
     {
      "NOMBRE": "NÁSSER JUAN MENDOZA GARCÍA",
      "DNI": 40852884
     },
     {
      "NOMBRE": "NÁSSER JESÚS MENDOZA MORALES",
      "DNI": 73856353
     },
     {
      "NOMBRE": "DIEGO MENDOZA MORALES",
      "DNI": 73856354
     },
     {
      "NOMBRE": "FRANKS EDVERD MENDOZA RETAMOZO",
      "DNI": 21564959
     },
     {
      "NOMBRE": "LENIN ALEJANDRO MENDOZA URBINA",
      "DNI": 41152277
     },
     {
      "NOMBRE": "CARLOS ENRIQUE MENDOZA URBINA",
      "DNI": 21872963
     },
     {
      "NOMBRE": "ALEX PAVEL MONASÍ LUJÁN",
      "DNI": 41067876
     },
     {
      "NOMBRE": "JORGE LUIS MONSERRATE HERRERA",
      "DNI": 25573736
     },
     {
      "NOMBRE": "RONY FRANCCISCO MONTALVÁN APOLAYA",
      "DNI": 21811892
     },
     {
      "NOMBRE": "LUIS MIGUEL MUNAYCO CASTILLO",
      "DNI": 21868791
     },
     {
      "NOMBRE": "JOSÉ HUMBERTO NOBLECILLA ATOCHE",
      "DNI": 21868111
     },
     {
      "NOMBRE": "CÉSAR AGUSTO NOBLECILLA ATOCHE",
      "DNI": 80042995
     },
     {
      "NOMBRE": "GREGORIO ORTIZ FUENTES",
      "DNI": 21781751
     },
     {
      "NOMBRE": "MARCO ANTONO OSORIO TORRES",
      "DNI": 21881567
     },
     {
      "NOMBRE": "RICARDO FERNANDO PACHAS CASAS",
      "DNI": 21860199
     },
     {
      "NOMBRE": "ÁNGEL JAVIER PACHAS MESÍAS",
      "DNI": 21852399
     },
     {
      "NOMBRE": "VICTOR HUGO PACHAS MORÁN",
      "DNI": 21873261
     },
     {
      "NOMBRE": "PEDRO MARTÍN PACHAS YÁÑEZ",
      "DNI": 8588867
     },
     {
      "NOMBRE": "JUAN ALCIBIADES PACHAS YATACO",
      "DNI": 21798449
     },
     {
      "NOMBRE": "JUAN ALBERTO PADILLA ANCAYA",
      "DNI": 21842309
     },
     {
      "NOMBRE": "MANUEL DOMINGO PADILLA BENAVIDES",
      "DNI": 21812800
     },
     {
      "NOMBRE": "SAÚL FAUSTO PADILLA GONZALES",
      "DNI": 21813559
     },
     {
      "NOMBRE": "HÉCTOR JESÚS PALOMINO AURIS",
      "DNI": 41978761
     },
     {
      "NOMBRE": "RÓMULO MÁXIMO PATIÑO ARANA",
      "DNI": 41159095
     },
     {
      "NOMBRE": "CRISTIAN PATIÑO ARANA",
      "DNI": 42963757
     },
     {
      "NOMBRE": "JOSÉ FABIÁN PAZ QUIJANDRÍA",
      "DNI": 21800787
     },
     {
      "NOMBRE": "CARLOS ALBERTO PEÑA ALMEIDA",
      "DNI": 21857337
     },
     {
      "NOMBRE": "LUIS MANUEL PEÑALOZA ATÚNCAR",
      "DNI": 21849146
     },
     {
      "NOMBRE": "LUIS ALFREDO PÉREZ GARCÍA",
      "DNI": 21780852
     },
     {
      "NOMBRE": "JOSÉ CARLOS PÉREZ GUERRERO",
      "DNI": 6758940
     },
     {
      "NOMBRE": "RIO LUCIO LEANDRO PUENTE PINO",
      "DNI": 7586619
     },
     {
      "NOMBRE": "MANUEL ATILIO QUIJANDRÍA VALENCIA",
      "DNI": 21789203
     },
     {
      "NOMBRE": "JUAN ANTONIO QUISPE CALIXTO",
      "DNI": 74088355
     },
     {
      "NOMBRE": "ROBERT ERNESTO QUISPE CASAS",
      "DNI": 21854149
     },
     {
      "NOMBRE": "JUAN MANUEL RAMOS LOLI",
      "DNI": 21800019
     },
     {
      "NOMBRE": "EDGAR ALFREDO RAMOS TORRES",
      "DNI": 41641671
     },
     {
      "NOMBRE": "PERCY DOMINGO RAMOS TORRES",
      "DNI": 21866740
     },
     {
      "NOMBRE": "RUDYARD RENWICK LUIS",
      "DNI": 21862165
     },
     {
      "NOMBRE": "JORGE GIOVANI RODRÍGUEZ HERRERA",
      "DNI": 10427952
     },
     {
      "NOMBRE": "ÁNGEL JOSÉ RODRÍGUEZ RONCEROS",
      "DNI": 218570106
     },
     {
      "NOMBRE": "LUIGI ALBERTO RODRÍGUEZ TASSO",
      "DNI": 21799978
     },
     {
      "NOMBRE": "JOSÉ JAVIER ROJAS CASTILLA",
      "DNI": 21857440
     },
     {
      "NOMBRE": "ENZO ANDRÉS ROJAS TASAYCO",
      "DNI": 21882614
     },
     {
      "NOMBRE": "PEDRO ENRIQUE ROMERO RÍOS",
      "DNI": 21851837
     },
     {
      "NOMBRE": "CARLOS ANTONIO ROMERO ROMERO",
      "DNI": 25818112
     },
     {
      "NOMBRE": "MOISÉS RONCEROS MAGALLANES",
      "DNI": 6796897
     },
     {
      "NOMBRE": "JULIÁN ORLANDO SALÉ QUISPE",
      "DNI": 21836747
     },
     {
      "NOMBRE": "MARCOS EDUARDO SALVADOR CABRERA",
      "DNI": 21811528
     },
     {
      "NOMBRE": "EMILIO SALVATIERRA VILCA",
      "DNI": 21823768
     },
     {
      "NOMBRE": "JORGE LUIS SÁNCHEZ FLORES",
      "DNI": 21868079
     },
     {
      "NOMBRE": "JHONATAN YAMIR SARANGO POICÓN",
      "DNI": 70749244
     },
     {
      "NOMBRE": "JORGE PEDRO SARAVIA YATACO",
      "DNI": 21876485
     },
     {
      "NOMBRE": "ORISTHIAN JOSÉ SEBASTIÁN LÉVANO",
      "DNI": 48000114
     },
     {
      "NOMBRE": "LEONEL JULIO SEBASTIÁN SENISSE",
      "DNI": 21874171
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL SEGOVIA ALFARO",
      "DNI": 21823558
     },
     {
      "NOMBRE": "MANUEL ANTONIO SESSAREGO ORTIZ",
      "DNI": 21836206
     },
     {
      "NOMBRE": "ARTURO SIFUENTES MATEC",
      "DNI": 21813069
     },
     {
      "NOMBRE": "RAMÓN ELEAZAR SILVA LEVANO",
      "DNI": 21780256
     },
     {
      "NOMBRE": "JULIO CÉSAR SOBRINO MESÍAS",
      "DNI": 21794893
     },
     {
      "NOMBRE": "ALEJANDRO MARTÍN SOLARI LOZA",
      "DNI": 21848596
     },
     {
      "NOMBRE": "ALBERTO PABLO SOTO ALFARO",
      "DNI": 6888799
     },
     {
      "NOMBRE": "RICARDO MARTÍN TALLA MUÑANTE",
      "DNI": 21803643
     },
     {
      "NOMBRE": "FABIO AARÓN TASAYCO COSSÍO",
      "DNI": 60752749
     },
     {
      "NOMBRE": "MARCO ANTONIO TASAYCO DÍAZ",
      "DNI": 43265268
     },
     {
      "NOMBRE": "LUIS ALBERTO TASAYCO FLORES"
     },
     {
      "NOMBRE": "JOSÉ HUGO TASAYCO GONZALES",
      "DNI": 21793358
     },
     {
      "NOMBRE": "ADÁN TASAYCO JÁUREGUI",
      "DNI": 21794926
     },
     {
      "NOMBRE": "JORGE LUIS TASAYCO ROJAS"
     },
     {
      "NOMBRE": "PERCY GUSTAVO TASAYCO YATACO",
      "DNI": 43436412
     },
     {
      "NOMBRE": "JORGE IVÁN TATAJE ROQQUE",
      "DNI": 21863044
     },
     {
      "NOMBRE": "ROBERTO GERMÁN TORRES AMORETTI",
      "DNI": 21790601
     },
     {
      "NOMBRE": "EDGARD GONZALO TORRES AYO",
      "DNI": 21798537
     },
     {
      "NOMBRE": "DANIEL STEVE TORRES LEMONIER",
      "DNI": 41480370
     },
     {
      "NOMBRE": "PEDRO MARTIN TORRES ROJAS",
      "DNI": 21801494
     },
     {
      "NOMBRE": "JOSÉ LUIS TORRES VÉLIZ",
      "DNI": 21793374
     },
     {
      "NOMBRE": "JÚVER EMILIO TUPPIA LINARES",
      "DNI": 21813358
     },
     {
      "NOMBRE": "JOSÉ ANTONIO VALENZUELA ÁLVARO",
      "DNI": 21845094
     },
     {
      "NOMBRE": "JOSÉ ARTURO VALENZUELA PENA",
      "DNI": 43294409
     },
     {
      "NOMBRE": "EDWIN HERMES VALENZUELA S ALVATIERRA",
      "DNI": 21879199
     },
     {
      "NOMBRE": "KEVIN PIEROL VALERIO HERRERA",
      "DNI": 72395111
     },
     {
      "NOMBRE": "JAVIER ENRIQUE VALLARINO ALMEYDA",
      "DNI": 21868240
     },
     {
      "NOMBRE": "HUGO FERNANDO VÁSQUEZ MATÍAS",
      "DNI": 21842985
     },
     {
      "NOMBRE": "MIGUEL AMALQUIO VÁSQUEZ MATÍAS",
      "DNI": 21811945
     },
     {
      "NOMBRE": "WALTER VILLAVICENCIO GUTIÉRREZ",
      "DNI": 21781891
     },
     {
      "NOMBRE": "PABLO CÉSAR VILLEGAS QUISPE",
      "DNI": 21871998
     },
     {
      "NOMBRE": "ESTEBAN ORLANDO VILLEGAS VIOLETA",
      "DNI": 9561857
     },
     {
      "NOMBRE": "JHONNY EDER VIOLETA CUBA",
      "DNI": 21884899
     },
     {
      "NOMBRE": "ELVIS DANFFERS VIOLETA DEL RÍO",
      "DNI": 44426049
     },
     {
      "NOMBRE": "GUILLERMO VLADIMIR VIVANCO RAMOS",
      "DNI": 21864722
     },
     {
      "NOMBRE": "CARLOS ENRIQUE WONG RAMOS",
      "DNI": 21798890
     },
     {
      "NOMBRE": "RAFAEL ANDRES YÁNEZ APOLAYA",
      "DNI": 21811342
     },
     {
      "NOMBRE": "JOSÉ GREGORIO YATACO AGUILAR",
      "DNI": 21860998
     },
     {
      "NOMBRE": "JUAN ZOILO YATACO CARBAJAL",
      "DNI": 218100657
     },
     {
      "NOMBRE": "MIGUEL ANTONIO YATACO COPA",
      "DNI": 41004970
     },
     {
      "NOMBRE": "JAIME JUAN YATACO VIDAL",
      "DNI": 6093318
     },
     {
      "NOMBRE": "MIGUEL ÁNGEL YATACO VILLA",
      "DNI": 21852075
     },
     {
      "NOMBRE": "JESÚS YATACO YATACO",
      "DNI": 21833987
     },
     {
      "NOMBRE": "ERICK ANSELMO YAURI PAREDES",
      "DNI": 44691381
     },
     {
      "NOMBRE": "BERNARDO ANTONIO YUPANQUI CRUZ",
      "DNI": 21890053
     }
    ]
    }

// Inicializa Firebase Admin con tus credenciales
admin.initializeApp({
    credential: admin.credential.cert(require("./firebase-credentials.json")),
});

const db = admin.firestore();

const uploadData = async () => {
    const batch = db.batch();
    const hojaRef = db.collection("exalumnos");

    data["exalumnos"].forEach((item, index) => {
        const docRef = hojaRef.doc(`${index + 1}`); // Cada documento tendrá un ID único
        batch.set(docRef, item);
    });

    try {
        await batch.commit();
        console.log("Datos subidos correctamente a Firestore.");
    } catch (error) {
        console.error("Error subiendo los datos: ", error);
    }
};

uploadData();
