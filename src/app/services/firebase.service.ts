import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc,collection, collectionData, query } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Viaje } from '../models/viaje.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // ====================== Autenticacion ======================

  getAuth() {
    return getAuth();
  }

  // === Acceder ===

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // === Crear ===

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // === Actualizar ===

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // === Reestablecer ===

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // === Cerrar Sesion ===

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // ====================== Base de datos ======================

  // === Documento ===

  async eliminarViaje(viajeId: string): Promise<void> {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId);

    try {
      await viajeRef.delete();
    } catch (error) {

      console.error('Error al eliminar el viaje:', error);
      throw error;
    }
  }

  actualizarViaje(viajeId: string, nuevosDatos: Viaje): Promise<void> {
    const viajesCollection = this.firestore.collection('viajes');
    return viajesCollection.doc(viajeId).update(nuevosDatos);
  }

  marcarViajeCompleto(viajeId: string): Promise<void> {
    const viajesCollection = this.firestore.collection('viajes');
    return viajesCollection.doc(viajeId).update({ completo: true });
  }

  //disponibles
  disponible(viajeId: string, dis: number ): Promise<void> {
    const viajesCollection = this.firestore.collection('viajes');
    
    return viajesCollection.doc(viajeId).update({ disponibles: dis,});
  }

  //agregar email pasajero
  emailPasajerp(viajeId: string, email_viajero: string ): Promise<void> {
    const viajesCollection = this.firestore.collection('viajes');
    
    return viajesCollection.doc(viajeId).update({ emailP: email_viajero});
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  getCollectionData(path: string, collectionQuery?:any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }
}
