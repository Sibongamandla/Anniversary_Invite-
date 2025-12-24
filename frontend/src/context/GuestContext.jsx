import { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext(null);

export const GuestProvider = ({ children }) => {
    const [guestCode, setGuestCode] = useState(() => localStorage.getItem('guestCode'));

    useEffect(() => {
        if (guestCode) {
            localStorage.setItem('guestCode', guestCode);
        } else {
            localStorage.removeItem('guestCode');
        }
    }, [guestCode]);

    const unlock = (code) => setGuestCode(code);
    const lock = () => setGuestCode(null);

    return (
        <GuestContext.Provider value={{ guestCode, unlock, lock }}>
            {children}
        </GuestContext.Provider>
    );
};

export const useGuest = () => useContext(GuestContext);
