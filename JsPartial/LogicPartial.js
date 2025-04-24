import { FirestoreService } from '../modules/firestore_service.js';
import { FirestoreQuery } from '../modules/firestore_query.js';
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

//const firestore = new FirestoreService("teams/dpZaC52gxG1iCsirzJ9W/projects/McdQsPnFxUaN1QHDU9vA/Homeworks");

async function SeedTaks(teamsID,projectsId,TasksId) {
    
    const firestore = new FirestoreService("teams/"+teamsID+"/projects/"+projectsId+"/Homeworks");

    const idDoc = await firestore.getDocumentById(TasksId);
    return idDoc;
    
}

async function CallFirestore(teamsID,projectsId) {
     
    const firestore = new FirestoreService("teams/"+teamsID+"/projects/"+projectsId+"/Homeworks");
    return firestore;

}

async function CallQueryFirestore(teamsID,projectsId) {
    const firestore = new FirestoreQuery("teams/"+teamsID+"projects/"+projectsId+"Homeworks");
    return firestore;
}


document.getElementById("loadDataBtn").addEventListener("click", async () => {

   const getIdTeams = document.getElementById("docIdTeams2").value.trim();
   const getIdProjects = document.getElementById("docIdProjects2").value.trim();
   const getIdTasks = document.getElementById("docIdTaks2").value.trim();
   

  const docwithId =  await SeedTaks(getIdTeams, getIdProjects, getIdTasks);
  
  console.log("Obtained Doc with ID:", docwithId);

    const contain = document.getElementById("containDocsDataBase");
    contain.innerHTML = `
    
     <h2 >Data about the document with ID: ${docwithId.id} </h2>
     <p> name: ${docwithId.name}</p>
     <p> priority: ${docwithId.priority}</p>
     <p> status: ${docwithId.status}</p>
     <p> createdAt: ${docwithId.createdAt}</p>   
    `;
});

// Second point

document.getElementById("addDocBtn").addEventListener("click", async () => {
    const getIdTeams = document.getElementById("docIdTeams").value.trim();
    const getIdProjects = document.getElementById("docIdProjects").value.trim();
    const getIdTasks = document.getElementById("docIdTaks").value.trim();

    const firestore = await CallFirestore(getIdTeams, getIdProjects);

    const getName = document.getElementById("docNameTaks").value.trim();
    const getPriority = document.getElementById("docPriority").value.trim();
    const getStatus = document.getElementById("docStatus").value.trim();
    const getIddateString = document.getElementById("createdAt").value.trim();
    const getIddate = Timestamp.fromDate(new Date(getIddateString));
    

    if (!getName || !getPriority || !getStatus || !getIddate) {
        alert("Fill in the required fields: name, priority, status, createdAt.");
        return;
    }

    const data = {
        name: getName,
        priority: getPriority,
        status: getStatus,
        createdAt: getIddate,
        id: getIdTasks
    };

    await firestore.PostDocument(getIdTasks, data);
});




document.getElementById("addFilterBtn").addEventListener("click", () => {


    console.log("Add field clicked")
    const container = document.getElementById("filtersContainer");
    const div = document.createElement("div");
    div.classList.add("filter");

    div.innerHTML = `
        <input type="text" placeholder="Column" class="filterColumn">
        <input type="text" placeholder="Comparator (==, >, <, etc)" class="filterComparator">
        <input type="text" placeholder="Value" class="filterValue">
        `;

    container.appendChild(div);
});
 
const displayResults = (docs) => {
    const resultsEl = document.getElementById("results");
    if (!docs || docs.length === 0) {
        resultsEl.textContent = "No documents found.";
        return;
    }

    resultsEl.textContent = JSON.stringify(docs, null, 2);
};




// third point and  five point



        // Multi query
        document.getElementById("multiWhereQueryBtn").addEventListener("click", async () => {
            const getIdTeams = document.getElementById("docIdTeams3").value.trim();
            const getIdProjects = document.getElementById("docIdProjects3").value.trim();
        
            if (!getIdTeams || !getIdProjects) {
                alert("Por favor, completa Team ID y Project ID.");
                return;
            }
        
            const filterDivs = document.querySelectorAll("#filtersContainer .filter");
            const filters = [];
        
            filterDivs.forEach(div => {
                const column = div.querySelector(".filterColumn").value.trim();
                const comparison = div.querySelector(".filterComparator").value.trim();
                const valueRaw = div.querySelector(".filterValue").value.trim();
        
                if (column && comparison) {
                    const value = isNaN(valueRaw) ? valueRaw : Number(valueRaw);
                    filters.push({ column, comparison, value });
                }
            });
        
            try {
                const firestore = await CallQueryFirestore(getIdTeams, getIdProjects);
                const order = { column: "createdAt", direction: "asc" };
        
                const docs = await firestore.combinedQuery(filters, order);
                displayResults(docs);
            } catch (error) {
                console.error("Error al hacer la consulta:", error);
                alert("Ocurrió un error al obtener los datos.");
            }
        });
        

        document.getElementById("containQuery").addEventListener("click", async () => {
            const getIdTeams = document.getElementById("docIdTeams2").value.trim();
            const getIdProjects = document.getElementById("docIdProjects2").value.trim();
        
            const filterDivs = document.querySelectorAll("#filtersContainer .filter");
            const filters = [];
        
            filterDivs.forEach(div => {
                const column = div.querySelector(".filterColumn").value.trim();
                const comparison = div.querySelector(".filterComparator").value.trim();
                const valueRaw = div.querySelector(".filterValue").value.trim();
        
                if (column && comparison) {
                    const value = isNaN(valueRaw) ? valueRaw : Number(valueRaw);
                    filters.push({ column, comparison, value });
                }
            });
        
            const firestore = await CallQueryFirestore(getIdTeams, getIdProjects); 
        
     
            const docs = await firestore.combinedQuery(filters);
        
     
            const conteoPorUsuario = {};
            docs.forEach(tarea => {
                const usuario = tarea.name;
                if (!conteoPorUsuario[usuario]) {
                    conteoPorUsuario[usuario] = 0;
                }
                conteoPorUsuario[usuario]++;
            });
        
            console.log("Tareas de alta prioridad pendientes por usuario:", conteoPorUsuario);
      
            displayResults(docs);
        });
        





