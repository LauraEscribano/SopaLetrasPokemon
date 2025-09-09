const FILES=3;
const COLUMNES=3;
const array=[];
document.addEventListener("DOMContent", function(){
    omplirArray();
    mostrarArray();
    sumarFiles();
    sumarColumnes();
    multiplicarDiagonals();
});

function omplirArray(){
    let comptador=1;
    for(let i=0;i<FILES;i++){
        array[i]=new Array();
        for (let j=0;j<COLUMNES;j++){
            array[i][j]=comptador;
            comptador++;
        }
    }
}

function mostrarArray(){
    for(let i=0;i<FILES;i++){
        let cadena="";
        for(let j=0;j<COLUMNES;j++){
            cadena += array[i][j]+" ";
        }
        console.log(cadena + "\n");
    }
}

function sumarFiles(){
    let sumaFila, sumaArray=0;
    for(let i=0;i<FILES;i++){
        sumaFila=0;
        for(let j=0;j<COLUMNES;j++){
        sumaFila += array[i][j];
        sumaArray+=array[i][j];
        }

        console.log("La fila : " + (i+1) + " suma: " + sumaFIla);
    }
    console.log("L'array suma: " + sumaArray);
        
}


function sumarColumnes(){
    let sumaColumna, sumaArray=0;
    for(let i=0;i<COLUMNES;i++){
        sumaColumna=0;
        for(let j=0;j<FILES;j++){
        sumaColumna += array[j][i];
        sumaArray+=array[j][i];
        }

        console.log("La columna : " + (i+1) + " suma: " + sumaColumna);
    }
    console.log("L'array suma: " + sumaArray);
        
}

function multiplicarDiagonals(){
    let prodDiagonal=1;
    for(let i=0;i<FILES;i++){
        prodDiagonal *=array[i][i];
    }
    console.log("El producte de la primera diagonal és: " + prodDiagonal)
    let j=COLUMNES-1;
    let prodDiagonal2=1;
    for(let i=0;i=FILES;i++){
        prodDiagonal2+=array[i][j];
        j--;
    }
    console.log("EL producte de la segona diagonal és: " + prodDiagonal2);
}