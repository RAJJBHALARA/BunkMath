import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'iqSetup'

export function useAttendance() {
  const { currentUser } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setData(null)
      setLoading(false)
      return
    }

    const userDocRef = doc(db, 'users', currentUser.uid)

    // Listen to real-time updates from Firestore
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data().setupData
        setData(remoteData)
        // Also update localStorage as a local secondary cache
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData))
      } else {
        // Migration: If Firestore is empty, check localStorage
        const localRaw = localStorage.getItem(STORAGE_KEY)
        if (localRaw) {
          try {
            const localData = JSON.parse(localRaw)
            // Save local data to Firestore for the first time
            await setDoc(userDocRef, { setupData: localData }, { merge: true })
            setData(localData)
          } catch (e) {
            setData(null)
          }
        } else {
          setData(null)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [currentUser])

  const saveData = async (newData) => {
    if (!currentUser) return
    const userDocRef = doc(db, 'users', currentUser.uid)
    await setDoc(userDocRef, { setupData: newData }, { merge: true })
    // No need to set state manually, onSnapshot will pick it up
  }

  return { data, updateData: saveData, loading }
}
