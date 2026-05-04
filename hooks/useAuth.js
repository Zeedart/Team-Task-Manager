import { useContext } from "react";

import {AuthContext} from "../components/context/AuthProvider"

/**
 * @returns {{ user: import("@supabase/supabase-js").User | null, loading: boolean }}
 */

const useAuth = () => {
    const context = useContext(AuthContext);

    if(!AuthContext) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

export default useAuth;