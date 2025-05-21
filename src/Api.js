import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import firebaseConfig from './firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
    addUser: async (user) => {
        await setDoc(doc(db, 'users', String(user.id)), {
            name: user.name,
            avatar: user.avatar,
            password: user.password
        }, { merge: true });
    },
    getContactList: async (userId) => {
        let list = [];

        let results = await db.collection('users').get();
        results.forEach(result => {
            let data = result.data();

            if(result.id !== userId){
                list.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar
                });
            }
        });

        return list;
    }
};