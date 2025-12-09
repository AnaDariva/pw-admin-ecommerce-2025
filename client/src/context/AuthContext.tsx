
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
    AuthenticatedUser,
    AuthenticationResponse,
} from "@/commons/types";
import { api } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    role?: string;
    id?: number;
    name?: string;
    exp?: number;
}

interface AuthContextType {
    authenticated: boolean;
    authenticatedUser?: AuthenticatedUser & { role: string };
    handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<any>;
    handleLogout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] =
        useState<AuthenticatedUser & { role: string }>();

    const formatUser = (user: AuthenticatedUser & { role?: string }, token?: string) => {
        let roleFromToken: string | undefined;
        let idFromToken: number | undefined;
        let nameFromToken: string | undefined;

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                roleFromToken = decoded.role;
                idFromToken = decoded.id;
                nameFromToken = decoded.name;
            } catch (error) {
                console.error("AuthContext: erro ao decodificar JWT:", error);
            }
        }

        const extractedRole =
            roleFromToken ??
            user.role ??
            user.authorities?.[0]?.authority ??
            "";

        return {
            ...user,
            id: idFromToken ?? (user as any).id,
            name: nameFromToken ?? (user as any).name,
            role: extractedRole,
        };
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUserStr = localStorage.getItem("user");

        if (storedUserStr && storedToken) {
            const parsedUser = JSON.parse(
                storedUserStr
            ) as AuthenticatedUser & { role: string };

            setAuthenticatedUser(parsedUser);
            setAuthenticated(true);

            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

            console.log("AuthContext: Sessão restaurada:", parsedUser.role);
        }
    }, []);

    const handleLogin = async (
        authenticationResponse: AuthenticationResponse
    ) => {
        try {
            const { token, user } = authenticationResponse;

            const formattedUser = formatUser(user, token);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(formattedUser));

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setAuthenticatedUser(formattedUser);
            setAuthenticated(true);

            console.log("AuthContext: Login efetuado. Role:", formattedUser.role);
        } catch (error) {
            console.error("AuthContext: erro em handleLogin:", error);
            setAuthenticatedUser(undefined);
            setAuthenticated(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];

        setAuthenticated(false);
        setAuthenticatedUser(undefined);

        console.log("AuthContext: Logout efetuado.");
    };

    return (
        <AuthContext.Provider
            value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
