import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where, addDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';

import firebaseConfig from './firebaseConfig';
import firebase from 'firebase/compat/app';
import { use } from 'react';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default {
    addUser: async (user) => {
        const defaultAvatar = 'https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg';
        const q = query(collection(db, 'users'), where('name', '==', user.name));
        const querySnapshot = await getDocs(q);

         if (querySnapshot.empty) {
        await setDoc(doc(db, 'users', String(user.id)), {
            id: String(user.id),
            name: user.name,
            avatar: user.avatar || defaultAvatar,
            password: user.password
        }, { merge: true });
        }
        console.log( user.id);
    },
    getContactList: async (userId) => {
        let list = [];
        
        const results = await getDocs(collection(db, 'users'));
        results.forEach(result => {
            let data = result.data();

            if(result.id !== String(userId)){
                list.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar,
                });
            }
        });
        
        return list;
    },
    addNewChat: async (user, user2) => {
        let newChatRef = await addDoc(collection(db, 'chats'), {
            messages: [],
            users: [user.id, user2.id]
        });

        await updateDoc(doc(db, 'users', user.id), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                title: user2.name,
                image: user2.avatar,
                with: user2.id
            })
        });

        await updateDoc(doc(db, 'users', user2.id), {
            chats: arrayUnion({
                chatId: newChatRef.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        });
    },
    onChatList:(userId, setChatList) => {
        // Cria uma referência ao documento do usuário
        const userDocRef = doc(db, 'users', userId);
        // Usa onSnapshot do Modular SDK
        return onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                let data = docSnap.data();
                if (data.chats) {
                    let chats = [...data.chats];

                    chats.sort((a, b)=>{
                        if(a.lastMessageDate === undefined){
                            return -1;
                        } 
                        if(b.lastMessageDate === undefined){
                            return -1;
                        }
                        if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){
                            return 1;
                        } 
                        else{
                            return -1;
                        }
                    });

                    setChatList(chats);
                }
            }
        });
    },
    onChatContent: (() => {
        let lastMessagesLength = 0;
        return (chatId, setList, setUsers, loggedUserId) => {
            return onSnapshot(doc(db, 'chats', chatId), (doc) => {
                if(doc.exists) {
                    let data = doc.data();
                    setList(data.messages);
                    setUsers(data.users);

                    // Só toca o som se a nova mensagem NÃO for do usuário logado
                    if (
                        data.messages &&
                        data.messages.length > lastMessagesLength &&
                        data.messages[data.messages.length - 1].author !== loggedUserId
                    ) {
                        const audio = new Audio('/notification.mp3');
                        audio.play();
                    }
                    lastMessagesLength = data.messages ? data.messages.length : 0;
                }
            });
        }
    })(),
    sendMessage: async(chatData, userId, type, body, users) => {
        let now = new Date();

        await updateDoc(doc(db, 'chats', chatData.chatId), {
            messages: arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        });

        // Removido o som daqui

        for(let i in users) {
            let u = await getDoc(doc(db, 'users', users[i]));
            let data = u.data();
            if(data.chats) {
                let chats = [...data.chats];

                for(let e in chats){
                    if(chats[e].chatId === chatData.chatId) {
                        chats[e].lastMessage = body;
                        chats[e].lastMessageDate = now;
                    }
                }

                await updateDoc(doc(db, 'users', users[i]), {
                    chats
                });
            }                
        }
    }
}