import React from "react";
import type { AppProps } from "next/app";
import { Database, getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from "firebaseConfig";

import "juniper-ui/dist/style.css";

//* Firebase Setup
let db: Database;
try {
  initializeApp(firebaseConfig);
  db = getDatabase();
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}
export const FirebaseContext: React.Context<{
  db: Database;
}> = React.createContext(null as any);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <FirebaseContext.Provider value={{ db }}>
        <Component {...pageProps} />
      </FirebaseContext.Provider>
    </>
  );
}

export default MyApp;
