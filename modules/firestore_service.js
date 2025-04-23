import { db } from './firebase_init.js';
import { collection, getDocs, getDoc, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export class FirestoreService {
  constructor(collectionName, documentId) {
    this.collectionTeams = collection(db, collectionName);
   
  }

  async getAllDocuments() {
    const snapshot = await getDocs(this.collectionTeams);
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });

    });
    return data;
  }

  async getDocumentById(id) {
    const docRef = doc(this.collectionTeams, id);
    const snapshot = await getDoc(docRef);
  
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null; 
    }
  }

  async PostDocument(customId, dataObject) {
    try {
      console.log(customId, dataObject);
      const docRef = doc(this.collectionTeams, customId.toString());
      await setDoc(docRef, dataObject);
      console.log("Documento creado con ID:", customId);
      alert("Documento creado con éxito.");
    } catch (e) {
      console.error("Error al crear el documento:", e);
      alert("Error al crear el documento.");
    }
  }


  
}
