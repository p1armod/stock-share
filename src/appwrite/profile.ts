import { Client, Databases, ID, Storage, Query } from "appwrite";
import conf from "../conf/conf";
import type { Profile } from "../types/Profile";

class ProfileService {
    client: Client;
    databases: Databases;
    storage: Storage;
    constructor() {
        this.client = new Client().setEndpoint(conf.appwrite).setProject(conf.project_id);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }
    async createProfile(data: Profile) {
        try {
            const profileCreate: Profile = {
                userId: data.userId,
                name: data.name,
                email: data.email,
                bio: data.bio,
                avatar: data.avatar,
                $id: ID.unique(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                title: "",
            }
            const res = await this.databases.createDocument(conf.database_id, conf.collection_users, profileCreate.$id!, profileCreate);
            return res;
        } catch (error) {
            console.log("Create Profile Error : ",error);
        }
    }
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            // First, try to find the profile by userId
            const response = await this.databases.listDocuments(
                conf.database_id,
                conf.collection_users,
                [Query.equal("userId", userId)]
            );
            
            if (response.documents.length > 0) {
                const doc = response.documents[0];
                return {
                    userId: doc.userId,
                    name: doc.name,
                    email: doc.email,
                    bio: doc.bio,
                    avatar: doc.avatar,
                    $id: doc.$id,
                    $createdAt: doc.$createdAt,
                    $updatedAt: doc.$updatedAt,
                    title: doc.title,
                };
            }
            return null;
        } catch (error) {
            console.error("Get Profile Error:", error);
            return null;
        }
    }
    async createOrUpdateProfile(data: Profile) {
        try {
            // First, try to find existing profile
            const existing = await this.getProfile(data.userId);
            
            if (existing) {
                // Get the document ID from the existing profile
                const response = await this.databases.listDocuments(
                    conf.database_id,
                    conf.collection_users,
                    [Query.equal("userId", data.userId)]
                );
                
                if (response.documents.length > 0) {
                    const docId = response.documents[0].$id;
                    // Update existing document
                    return await this.databases.updateDocument(
                        conf.database_id,
                        conf.collection_users,
                        docId,
                        data
                    );
                }
            }
            
            // Create new document if not exists
            return await this.databases.createDocument(
                conf.database_id,
                conf.collection_users,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error("Create/Update Profile Error:", error);
            throw error;
        }
    }
    async deleteProfile(userId: string) {
        try {
            const res = await this.databases.deleteDocument(conf.database_id, conf.collection_users, userId);
            if (!res) {
                throw new Error("Profile not deleted");
            }
            return res;
        } catch (error) {
            console.log("Delete Profile Error : ",error);
        }
    }

    // Using same bucket for storing avatar and article images
    async createAvatar(file: File) {
        try {
            const res = await this.storage.createFile(conf.bucket_id, ID.unique(), file);
            if (!res) {
                throw new Error("Avatar not created");
            }
            return res;
        } catch (error) {
            console.log("Create Avatar Error : ",error);
        }
    }
    async getAvatar(avatarId: string) {
        try {
            const res = await this.storage.getFile(conf.bucket_id, avatarId);
            if (!res) {
                throw new Error("Avatar not found");
            }
            return res;
        } catch (error) {
            console.log("Get Avatar Error : ",error);
        }
    }
    async updateAvatar(avatarId: string, file: File) {
        try {
            const avatar = await this.getAvatar(avatarId);
            if (avatar) {
                await this.deleteAvatar(avatar.$id);
            }
            const res = await this.createAvatar(file);
            return res;
        } catch (error) {
            console.log("Change Avatar Error : ",error);
        }
    }
    async deleteAvatar(avatarId: string) {
        try {
            const res = await this.storage.deleteFile(conf.bucket_id, avatarId);
            if (!res) {
                throw new Error("Avatar not deleted");
            }
            return res;
        } catch (error) {
            console.log("Delete Avatar Error : ",error);
        }
    }
    async getAvatarUrl(avatarId: string) {
        try {
            // Use getFileView instead of getFilePreview to get the direct URL
            const res = await this.storage.getFileView(conf.bucket_id, avatarId);
            if (!res) throw new Error("Avatar not found");
            return res; // This will return the direct URL to the file
        } catch (error) {
            console.error("Get Avatar URL Error:", error);
            return null;
        }
    }
}

const profileService = new ProfileService();
export default profileService;
