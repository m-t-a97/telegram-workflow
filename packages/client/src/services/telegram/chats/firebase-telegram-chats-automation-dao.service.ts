// import {
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";

// import { Observable, of } from "rxjs";
// import { collectionData, docData } from "rxfire/firestore";

// import {
//   FirestoreCollectionPaths,
//   LoggerUtils,
//   ChatAutomation,
//   IDUtils,
// } from "@shared-core";

// import { firebaseReferences } from "@/firebase";
// import ITelegramChatsAutomationDaoService, {
//   ChatAutomationCreatedResultType,
// } from "./i-telegram-chats-automation-dao.service";

// export default class FirebaseTelegramChatsAutomationDaoService
//   implements ITelegramChatsAutomationDaoService
// {
//   public getAll(): Observable<ChatAutomation[]> {
//     try {
//       const uid = firebaseReferences.auth.currentUser.uid;

//       const chatAutomationsCollection = collection(
//         firebaseReferences.firestore,
//         `${FirestoreCollectionPaths.USERS}/${uid}/${FirestoreCollectionPaths.TELEGRAM}/telegram-${uid}/${FirestoreCollectionPaths.CHAT_AUTOMATIONS}`
//       );

//       return collectionData(chatAutomationsCollection) as Observable<
//         ChatAutomation[]
//       >;
//     } catch (error) {
//       LoggerUtils.error(
//         "FirebaseTelegramChatsAutomationDaoService",
//         "getAll",
//         error
//       );
//     }

//     return of([]);
//   }

//   public getOne(id: string): Observable<ChatAutomation> {
//     try {
//       const uid = firebaseReferences.auth.currentUser.uid;

//       const chatAutomationDocRef = doc(
//         firebaseReferences.firestore,
//         `${FirestoreCollectionPaths.USERS}/${uid}/${FirestoreCollectionPaths.TELEGRAM}/telegram-${uid}/${FirestoreCollectionPaths.CHAT_AUTOMATIONS}/${id}`
//       );

//       return docData(chatAutomationDocRef) as Observable<ChatAutomation>;
//     } catch (error) {
//       LoggerUtils.error(
//         "FirebaseTelegramChatsAutomationDaoService",
//         "getOne",
//         error
//       );
//     }

//     return of(null);
//   }

//   public async create(): Promise<ChatAutomationCreatedResultType> {
//     try {
//       const uid = firebaseReferences.auth.currentUser.uid;

//       const usersChatAutomationsCollection = collection(
//         firebaseReferences.firestore,
//         `${FirestoreCollectionPaths.USERS}/${uid}/${FirestoreCollectionPaths.TELEGRAM}/telegram-${uid}/${FirestoreCollectionPaths.CHAT_AUTOMATIONS}`
//       );

//       const newChatAutomationDocument = await addDoc(
//         usersChatAutomationsCollection,
//         {
//           name: `automation-${IDUtils.generate(6, false)}`.toUpperCase(),
//           sourceChatId: null,
//           destinationChatIds: [],
//           active: false,
//           touched: false,
//         } as Partial<ChatAutomation>
//       );

//       await updateDoc(newChatAutomationDocument, {
//         uid: newChatAutomationDocument.id,
//       } as Partial<ChatAutomation>);

//       return Promise.resolve({ uid: newChatAutomationDocument.id });
//     } catch (error) {
//       LoggerUtils.error(
//         "FirebaseTelegramChatsAutomationDaoService",
//         "create",
//         error
//       );

//       return Promise.reject(error);
//     }
//   }

//   public async update(
//     id: string,
//     data: Partial<ChatAutomation>
//   ): Promise<void> {
//     try {
//       const uid = firebaseReferences.auth.currentUser.uid;

//       const chatAutomationDocRef = doc(
//         firebaseReferences.firestore,
//         `${FirestoreCollectionPaths.USERS}/${uid}/${FirestoreCollectionPaths.TELEGRAM}/telegram-${uid}/${FirestoreCollectionPaths.CHAT_AUTOMATIONS}/${id}`
//       );

//       await updateDoc(chatAutomationDocRef, {
//         ...data,
//       });

//       return Promise.resolve();
//     } catch (error) {
//       LoggerUtils.error(
//         "FirebaseTelegramChatsAutomationDaoService",
//         "update",
//         error
//       );

//       return Promise.reject(error);
//     }
//   }

//   public async delete(id: string): Promise<void> {
//     try {
//       const uid = firebaseReferences.auth.currentUser.uid;

//       const chatAutomationDocRef = doc(
//         firebaseReferences.firestore,
//         `${FirestoreCollectionPaths.USERS}/${uid}/${FirestoreCollectionPaths.TELEGRAM}/telegram-${uid}/${FirestoreCollectionPaths.CHAT_AUTOMATIONS}/${id}`
//       );

//       await deleteDoc(chatAutomationDocRef);

//       return Promise.resolve();
//     } catch (error) {
//       LoggerUtils.error(
//         "FirebaseTelegramChatsAutomationDaoService",
//         "delete",
//         error
//       );

//       return Promise.reject(error);
//     }
//   }
// }
