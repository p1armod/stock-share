import { Client, ID, Databases, Query } from "appwrite";
import conf from "../conf/conf";
import type { WatchList } from "../types/WatchList";


class WatchListService {
    client: Client;
    databases: Databases;
    constructor() {
        this.client = new Client().setEndpoint(conf.appwrite).setProject(conf.project_id);
        this.databases = new Databases(this.client);
    }

    async addStock(watchListId: string, stock: string) {
        try {
            const oldWatchList = await this.databases.getDocument(conf.database_id, conf.collection_watchlist, watchListId);
            if (!oldWatchList) return;
            const watchListUpdate: WatchList = {
                $id: oldWatchList.$id,
                $createdAt: oldWatchList.$createdAt,
                $updatedAt: new Date().toISOString(),
                title: oldWatchList.title,
                userId: oldWatchList.userId,
                stocks: [...oldWatchList.stocks, stock]
            }
            const res = await this.databases.updateDocument(conf.database_id, conf.collection_watchlist, watchListId, watchListUpdate);
            const watchList: WatchList = {  
                $id: res.$id,
                $createdAt: res.$createdAt,
                $updatedAt: res.$updatedAt,
                title: res.title,
                userId: res.userId,
                stocks: res.stocks
            }
            return watchList;
        } catch (error) {
            console.log("Add Stock Error : ",error);
        }
    }
    async removeStock(watchListId: string, stock: string) {
        try {
            const oldWatchList = await this.databases.getDocument(conf.database_id, conf.collection_watchlist, watchListId);
            if (!oldWatchList) return;
            const watchListUpdate: WatchList = {
                $id: oldWatchList.$id,
                $createdAt: oldWatchList.$createdAt,
                $updatedAt: new Date().toISOString(),
                title: oldWatchList.title,
                userId: oldWatchList.userId,
                stocks: oldWatchList.stocks.filter((s: string) => s !== stock)
            }
            const res = await this.databases.updateDocument(conf.database_id, conf.collection_watchlist, watchListId, watchListUpdate);
            const watchList: WatchList = {  
                $id: res.$id,
                $createdAt: res.$createdAt,
                $updatedAt: res.$updatedAt,
                title: res.title,
                userId: res.userId,
                stocks: res.stocks
            }
            return watchList;
        } catch (error) {
            console.log("Remove Stock Error : ",error);
        }
    }
    async createWatchList(title: string, userId: string) {
        try {
            const watchListCreate: WatchList = {
                $id: ID.unique(),
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                title: title,
                userId: userId,
                stocks: []
            }
            const res = await this.databases.createDocument(conf.database_id, conf.collection_watchlist, watchListCreate.$id!, watchListCreate);
            const watchList: WatchList = {  
                $id: res.$id,
                $createdAt: res.$createdAt,
                $updatedAt: res.$updatedAt,
                title: res.title,
                userId: res.userId,
                stocks: res.stocks
            }
            return watchList;
        } catch (error) {
            console.log("Create WatchList Error : ",error);
        }
    }
    async getWatchLists(userId: string) {
        try {
            const res = await this.databases.listDocuments(conf.database_id, conf.collection_watchlist, [Query.equal("userId", userId)]);
            if (!res) return [];
            const watchLists: WatchList[] = res.documents.map((doc: any) => ({
                $id: doc.$id,
                $createdAt: doc.$createdAt,
                $updatedAt: doc.$updatedAt,
                title: doc.title,
                userId: doc.userId,
                stocks: doc.stocks
            }));
            return watchLists;
        } catch (error) {
            console.log("Get WatchLists Error : ",error);
        }
    }
    async updateWatchList(watchListId: string, data: WatchList) {
        try {
            const watchListUpdate: WatchList = {
                $id: watchListId,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                title: data.title,
                userId: data.userId,
                stocks: data.stocks
            }
            const res = await this.databases.updateDocument(conf.database_id, conf.collection_watchlist, watchListId, watchListUpdate);
            const watchList: WatchList = {  
                $id: res.$id,
                $createdAt: res.$createdAt,
                $updatedAt: res.$updatedAt,
                title: res.title,
                userId: res.userId,
                stocks: res.stocks
            }
            return watchList;
        } catch (error) {
            console.log("Update WatchList Error : ",error);
        }
    }
    async deleteWatchList(watchListId: string) {
        try {
            const res = await this.databases.deleteDocument(conf.database_id, conf.collection_watchlist, watchListId);
            return res;
        } catch (error) {
            console.log("Delete WatchList Error : ",error);
        }
    }
}

const watchListService = new WatchListService();

export default watchListService;
