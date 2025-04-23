import { FirestoreService } from '../modules/firestore_service.js';
import { FirestoreQuery } from '../modules/firestore_query.js';

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

async function getUserCriticalTasks(teamId){
 
 const firestore = new FirestoreService("teams/"+teamId+"/projects");
 const docs = await firestore.getAllDocuments();
 return docs;
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

document.getElementById("addDocBtn").addEventListener("click", async () => {
    const getIdTeams = document.getElementById("docIdTeams").value.trim();
    const getIdProjects = document.getElementById("docIdProjects").value.trim();
    const getIdTasks = document.getElementById("docIdTaks").value.trim();

    const firestore = await CallFirestore(getIdTeams, getIdProjects);

    const getName = document.getElementById("docNameTaks").value.trim();
    const getPriority = document.getElementById("docPriority").value.trim();
    const getStatus = document.getElementById("docStatus").value.trim();
    const getIddate = document.getElementById("createdAt").value.trim();

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

 


