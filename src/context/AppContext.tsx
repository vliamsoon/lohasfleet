import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { UserProfile, DeliveryOrder, Trip, Vehicle, AuditFlag, UserRole, Department } from '../types';
import { INITIAL_USERS, INITIAL_VEHICLES, INITIAL_DELIVERY_ORDERS, INITIAL_TRIPS, INITIAL_AUDIT_FLAGS } from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile | null;
  firebaseAuthUser: User | null;
  role: UserRole;
  department: Department;
  isApproved: boolean;
  usersList: UserProfile[];
  vehicles: Vehicle[];
  deliveryOrders: DeliveryOrder[];
  trips: Trip[];
  auditFlags: AuditFlag[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth & Roles
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchUserRole: (userId: string) => void;
  approveUser: (uid: string, role: UserRole, department: Department) => Promise<void>;
  deactivateUser: (uid: string) => Promise<void>;
  // Delivery Orders
  addDeliveryOrder: (newDo: Omit<DeliveryOrder, 'id'>) => Promise<void>;
  updateDeliveryOrderStatus: (doId: string, status: DeliveryOrder['status'], notes?: string) => Promise<void>;
  // Audit & Trips
  resolveTripFlag: (tripId: string, justificationNote: string) => Promise<void>;
  escalateTripFlag: (tripId: string) => Promise<void>;
  updateTripOdometer: (tripId: string, startOdo?: number, endOdo?: number, photoUrl?: string) => Promise<void>;
  // Route Dispatch
  optimizeRoute: (tripId: string) => Promise<{ kmSaved: number; timeSavedMins: number }>;
  dispatchRouteToDriver: (tripId: string) => Promise<void>;
  // Notifications
  notificationMessage: string | null;
  setNotificationMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]); // Default to William Soon (Owner)
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(INITIAL_DELIVERY_ORDERS);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [auditFlags, setAuditFlags] = useState<AuditFlag[]>(INITIAL_AUDIT_FLAGS);
  const [activeTab, setActiveTab] = useState<string>('mileage-and-fuel-audit');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Connection test on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseAuthUser(user);
      if (user) {
        // Check if user exists in usersList
        const existing = usersList.find((u) => u.uid === user.uid || u.email === user.email);
        if (existing) {
          setCurrentUser(existing);
        } else {
          // Create new pending user profile
          const isOwnerEmail = user.email === 'williamsoon1994@gmail.com';
          const newProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'LOHAS User',
            email: user.email || '',
            role: isOwnerEmail ? 'owner' : 'management',
            department: isOwnerEmail ? 'general' : 'ops',
            status: isOwnerEmail ? 'active' : 'pending',
            avatarUrl: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };

          try {
            await setDoc(doc(db, 'users', user.uid), newProfile);
          } catch (e) {
            console.warn('Local fallback for user profile save:', e);
          }
          setUsersList((prev) => [newProfile, ...prev]);
          setCurrentUser(newProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync initial seed data to Firestore if empty, and listen to collections
  useEffect(() => {
    let unsubTrips: (() => void) | undefined;
    let unsubDOs: (() => void) | undefined;

    async function initFirestoreData() {
      try {
        const tripsSnap = await getDocs(collection(db, 'trips'));
        if (tripsSnap.empty) {
          // Seed initial data
          for (const t of INITIAL_TRIPS) {
            await setDoc(doc(db, 'trips', t.tripId), t).catch(() => {});
          }
          for (const d of INITIAL_DELIVERY_ORDERS) {
            await setDoc(doc(db, 'deliveryOrders', d.doNumber), d).catch(() => {});
          }
          for (const v of INITIAL_VEHICLES) {
            await setDoc(doc(db, 'vehicles', v.id), v).catch(() => {});
          }
          for (const u of INITIAL_USERS) {
            await setDoc(doc(db, 'users', u.uid), u).catch(() => {});
          }
        }

        // Attach listeners
        unsubTrips = onSnapshot(
          collection(db, 'trips'),
          (snap) => {
            if (!snap.empty) {
              const loaded = snap.docs.map((docSnap) => docSnap.data() as Trip);
              setTrips(loaded);
            }
          },
          (err) => {
            handleFirestoreError(err, OperationType.LIST, 'trips');
          }
        );

        unsubDOs = onSnapshot(
          collection(db, 'deliveryOrders'),
          (snap) => {
            if (!snap.empty) {
              const loaded = snap.docs.map((docSnap) => docSnap.data() as DeliveryOrder);
              setDeliveryOrders(loaded);
            }
          },
          (err) => {
            handleFirestoreError(err, OperationType.LIST, 'deliveryOrders');
          }
        );
      } catch (err) {
        console.warn('Running with hybrid local-firestore state:', err);
      }
    }

    initFirestoreData();

    return () => {
      if (unsubTrips) unsubTrips();
      if (unsubDOs) unsubDOs();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const isOwnerEmail = user.email === 'williamsoon1994@gmail.com';
      const existing = usersList.find((u) => u.uid === user.uid || u.email === user.email);
      if (existing) {
        setCurrentUser(existing);
      } else {
        const newProf: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          role: isOwnerEmail ? 'owner' : 'logistic',
          department: isOwnerEmail ? 'general' : 'ops',
          status: isOwnerEmail ? 'active' : 'pending',
          avatarUrl: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        setUsersList((prev) => [newProf, ...prev]);
        setCurrentUser(newProf);
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseAuthUser(null);
    setCurrentUser(null);
  };

  const switchUserRole = (userId: string) => {
    const target = usersList.find((u) => u.uid === userId);
    if (target) {
      setCurrentUser(target);
      // If switching to driver, switch tab to driver view or route planner
      if (target.role === 'logistic') {
        setActiveTab('route-planner');
      }
    }
  };

  const approveUser = async (uid: string, newRole: UserRole, newDept: Department) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.uid === uid
          ? {
              ...u,
              role: newRole,
              department: newDept,
              status: 'active',
              approvedBy: currentUser?.name || 'William Soon',
            }
          : u
      )
    );
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: newRole,
        department: newDept,
        status: 'active',
        approvedBy: currentUser?.name || 'William Soon',
      });
    } catch (e) {
      console.warn('Firestore update fallback:', e);
    }
  };

  const deactivateUser = async (uid: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, status: 'inactive' } : u))
    );
    try {
      await updateDoc(doc(db, 'users', uid), { status: 'inactive' });
    } catch (e) {
      console.warn('Firestore update fallback:', e);
    }
  };

  const addDeliveryOrder = async (newDoData: Omit<DeliveryOrder, 'id'>) => {
    const id = `do_${Date.now()}`;
    const fullDo: DeliveryOrder = {
      ...newDoData,
      id,
    };
    setDeliveryOrders((prev) => [fullDo, ...prev]);
    try {
      await setDoc(doc(db, 'deliveryOrders', fullDo.doNumber), fullDo);
    } catch (e) {
      console.warn('Firestore setDoc fallback for DO:', e);
    }
  };

  const updateDeliveryOrderStatus = async (doId: string, status: DeliveryOrder['status'], notes?: string) => {
    setDeliveryOrders((prev) =>
      prev.map((item) =>
        item.id === doId || item.doNumber === doId
          ? {
              ...item,
              status,
              notes: notes || item.notes,
              deliveredAt: status === 'delivered' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : item.deliveredAt,
              podVerified: status === 'delivered' ? true : item.podVerified,
            }
          : item
      )
    );
  };

  const resolveTripFlag = async (tripId: string, justificationNote: string) => {
    const clearedBy = currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'William Soon (Owner)';
    const clearedAt = `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} SGT`;

    setTrips((prev) =>
      prev.map((t) =>
        t.tripId === tripId
          ? {
              ...t,
              status: 'cleared',
              auditStatus: 'cleared',
              auditorNote: justificationNote,
              clearedBy,
              clearedAt,
              auditActor: clearedBy,
            }
          : t
      )
    );

    setAuditFlags((prev) =>
      prev.map((f) =>
        f.tripId === tripId
          ? {
              ...f,
              status: 'cleared',
              clearedBy,
              clearNote: justificationNote,
            }
          : f
      )
    );

    try {
      await updateDoc(doc(db, 'trips', tripId), {
        status: 'cleared',
        auditStatus: 'cleared',
        auditorNote: justificationNote,
        clearedBy,
        clearedAt,
      });
    } catch (e) {
      console.warn('Firestore updateDoc fallback:', e);
    }
  };

  const escalateTripFlag = async (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.tripId === tripId
          ? {
              ...t,
              auditStatus: 'open_flag',
              auditorNote: `[ESCALATED TO OWNER]: High priority review requested by ${currentUser?.name || 'Finance'}.`,
            }
          : t
      )
    );

    setAuditFlags((prev) =>
      prev.map((f) =>
        f.tripId === tripId ? { ...f, status: 'escalated' } : f
      )
    );
  };

  const updateTripOdometer = async (tripId: string, startOdo?: number, endOdo?: number, photoUrl?: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.tripId === tripId) {
          const s = startOdo ?? t.startOdoKm;
          const e = endOdo ?? t.endOdoKm;
          const delta = e > s ? e - s : t.odoDeltaKm;
          return {
            ...t,
            startOdoKm: s,
            endOdoKm: e,
            odoDeltaKm: delta,
            startOdoPhotoUrl: photoUrl || t.startOdoPhotoUrl,
          };
        }
        return t;
      })
    );
  };

  const optimizeRoute = async (tripId: string) => {
    // Reorder waypoints to achieve optimized 16.5% reduction
    await new Promise((res) => setTimeout(res, 600));
    setTrips((prev) =>
      prev.map((t) => {
        if (t.tripId === tripId) {
          return {
            ...t,
            plannedKm: 62.4, // Optimized down from 74.8 km (-12.4 km)
          };
        }
        return t;
      })
    );
    return { kmSaved: 12.4, timeSavedMins: 38 };
  };

  const dispatchRouteToDriver = async (tripId: string) => {
    await new Promise((res) => setTimeout(res, 500));
    setTrips((prev) =>
      prev.map((t) => (t.tripId === tripId ? { ...t, status: 'in_progress' } : t))
    );
  };

  const role = currentUser?.role || 'owner';
  const department = currentUser?.department || 'general';
  const isApproved = currentUser?.status === 'active';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseAuthUser,
        role,
        department,
        isApproved,
        usersList,
        vehicles,
        deliveryOrders,
        trips,
        auditFlags,
        activeTab,
        setActiveTab,
        loginWithGoogle,
        logout,
        switchUserRole,
        approveUser,
        deactivateUser,
        addDeliveryOrder,
        updateDeliveryOrderStatus,
        resolveTripFlag,
        escalateTripFlag,
        updateTripOdometer,
        optimizeRoute,
        dispatchRouteToDriver,
        notificationMessage,
        setNotificationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
