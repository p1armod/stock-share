import conf from "../conf/conf";
import { ID, Account, Client } from "appwrite";
import type { Models } from "appwrite";

type Subscription = () => void;

export class AuthService {
    private client: Client;
    public account: Account;
    private subscriptions: Set<Subscription> = new Set();
    
    constructor() {
        this.client = new Client().setEndpoint(conf.appwrite).setProject(conf.project_id);
        this.account = new Account(this.client);
    }
    async login(email: string, password: string) {
        try {
            const response = await this.account.createEmailPasswordSession(email, password);
            return response;
        } catch (error) {
            console.log("Login Error : ",error);
        }
    }
    async register(email: string, password: string, name: string) {
        try {
            const response = await this.account.create(ID.unique(), email, password, name);
            return response;
        } catch (error) {
            console.log("Register Error : ",error);
        }
    }

    async logout() {
        try {
            const response = await this.account.deleteSession("current");
            return response;
        } catch (error) {
            console.log("Logout Error : ",error);
        }
    }




    async getCurrentUser() {
        try {
            // First check if we have a valid session
            try {
                await this.account.getSession('current');
            } catch (sessionError) {
                // No valid session, return null instead of throwing
                return null;
            }
            
            // If we have a session, get the user
            const response = await this.account.get();
            return response;
        } catch (error) {
            console.log("Get Current User Error:", error);
            return null; // Return null instead of throwing
        }
    }
    
    subscribeToAuth(callback: (user: Models.User<Models.Preferences> | null) => void): () => void {
        // Initial check
        this.getCurrentUser().then(user => {
            callback(user);
        }).catch(() => {
            callback(null);
        });
    
        // Subscribe to auth changes
        const unsubscribe = this.client.subscribe('account', async (response) => {
            try {
                if (response.events.includes('session.*')) {
                    const user = await this.getCurrentUser();
                    callback(user);
                }
            } catch (error) {
                console.log('Auth subscription error:', error);
                callback(null);
            }
        });
    
        const subscription = () => {
            try {
                unsubscribe();
            } finally {
                this.subscriptions.delete(subscription);
            }
        };
    
        this.subscriptions.add(subscription);
        return subscription;
    }

    cleanup() {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions.clear();
    }


}

const authService = new AuthService();
export default authService;

