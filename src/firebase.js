import firebase from "firebase";
import "firebase/messaging";

import { firebasePublicKey } from "./api/apiConsts";

const config = {
  apiKey: "AIzaSyDpLr_54y_Gat6wpEkdwCOk7cCHqJOLIxA",
  authDomain: "agalia-nurseapp.firebaseapp.com",
  projectId: "agalia-nurseapp",
  storageBucket: "agalia-nurseapp.appspot.com",
  messagingSenderId: "777088927666",
  appId: "1:777088927666:web:ceb4df4b9dd59f219546ab",
  measurementId: "G-T4D7EB8JEQ",
};

firebase.initializeApp(config);

const handleUrl=(type,id)=>{
  let returnUrl=""
  switch (type) {
    case 'PTO':
      returnUrl=`/nurses/nurse-detail?type=pto&nurse_id=${id}`
      break;
    case 'CREDENTIAL':
      returnUrl= `/nurses/nurse-detail?type=cred&nurse_id=${id}`
      break;
    case 'TAX-BANK':
      returnUrl= `/settings?type=bank`
      break;
    case 'CREDIT-LOAN':
        returnUrl= `/loans`
        break;
    default:
      
  }
  return returnUrl
}

const setupToken = async () => {
  try {
    const messaging = firebase.messaging();
    messaging.onMessage((payload) => {
      
      
      //Toast.showInfoToast("notification arrived");
      navigator.serviceWorker
        .getRegistration("/firebase-cloud-messaging-push-scope")
        .then((registration) => {
          registration.showNotification(payload.notification.title, {
            ...payload.notification,
            data: { url:handleUrl(payload.data.type,payload.data.nurse_id)  },
          });
        });
    });
    const token = await messaging.getToken({ vapidKey: firebasePublicKey });
    if (token) {
      
    return token
      // todo: send token to server
    }
  } catch (e) {
    
    return null
  }
};

const DeleteFirebaseToken = async ()=>{
  try {
    const messaging = firebase.messaging();
    messaging.deleteToken()
  } catch (e) {
    
    return null
  }
}


export { setupToken,DeleteFirebaseToken };
