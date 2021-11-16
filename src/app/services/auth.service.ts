import { Injectable, AfterContentInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AlmacenamientoService } from './almacenamiento.service';
import { MenuController, NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements AfterContentInit {

  usr: any ;
  uidAuth: string ="";
  public usuario: any ={};
  user: firebase.User;
  userArr: firebase.User[] = [];

  constructor(
    private _authFire: AngularFireAuth,
    private _storage: AlmacenamientoService,
    private _navCtrl: NavController,
    private _menu :MenuController
    
  ) { 
    try {
      
      this._authFire.authState.subscribe( user => {
        
        if(!user){
          return;
        }
        
        this.user = user;
        this.usuario.user = user;
        this.usuario.uid = user.uid;
        
        this.userArr.push(user);
        
        
      }, errno => {
        this.usuario.uid = errno;
        
      });
    } catch (error) {
      
      
    }
  }

  ngAfterContentInit(){
    
  }

  async cargarUsuario(){
    return this._authFire.authState;
  }

  currentUserFirebase(){
    return this._authFire.currentUser;
  }


  async authLogin(correo: string, passw: string){
    
    
      try {
        return this._authFire.signInWithEmailAndPassword(correo, passw);
      } catch (error) {
        
      }
    
  }

  registrarUsuario( correo: string, passw: string){
    return this._authFire.createUserWithEmailAndPassword(correo, passw);
  }

  actualizarPass(newPass: string){
    return this._authFire.authState.subscribe( data => {
      return data.updatePassword( newPass ).then( () => {
        
        
      }).catch(err => {

        /* this.reautenticar(pass); */
      })
    });
  }
  actualizarCorreo(newCorreo: string){
    return this._authFire.authState.subscribe( data => {
      return data.updateEmail( newCorreo ).then( () => {
        
        
      }).catch( erro => {
        this.reautenticar(erro);
      })
    });
  }

  reautenticar(passw :string){
    try {
      let user = firebase.auth().currentUser;
      let credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        passw
      );
      return user.reauthenticateWithCredential(credential);
    } catch (error) {
      
    }
    
    
  }

  resetPassword(email: string){
    return this._authFire.sendPasswordResetEmail(email);
  }

  async autenticado(){
    return this._authFire.authState;
  }


  refrescar(email: string, pass: string){
    return firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(email, pass));
  }
 

  

  async logout(){
    this._navCtrl.navigateRoot('/login');
    await this._authFire.signOut()
    .then((resp)=>{
      this.usuario = {};
      
      this._menu.enable(false, 'cliente');
      this._menu.enable(false, 'propietario');
      this._menu.swipeGesture(false, 'cliente');
      this._menu.swipeGesture(false, 'propietario');
    }).catch((errno)=>{
      
      
    });
  }
}
