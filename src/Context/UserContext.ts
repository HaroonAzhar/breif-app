import {createContext} from 'react';
import {User} from "../types/user";

const UserContext = createContext({
    user: null as User | null,
    setUser: (u: User | null) => {
    }
});
export default UserContext;
