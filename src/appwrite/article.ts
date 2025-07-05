import conf from "../conf/conf";
import {Account,Client, ID,Databases,Storage,Query} from "appwrite";
import type { Article } from "../types/Article";



export class ArticleService {
    client = new Client();
    account: Account;
    databases: Databases;
    storage: Storage;
    constructor() {
        this.client.setEndpoint(conf.appwrite).setProject(conf.project_id);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createArticle(data: Article) {
        try {
            const articleCreate = {
                userId: data.userId,
                title: data.title,
                slug: data.slug,
                content: data.content,
                featured_image: data.featured_image
            }
            const response = await this.databases.createDocument(conf.database_id, conf.collection_articles, ID.unique(), articleCreate);
            return response;
        } catch (error) {
            console.log("Create Document Error : ",error);
        }
    }

    async getArticles() {
        try {
            const response = await this.databases.listDocuments(conf.database_id, conf.collection_articles);
            return response;
        } catch (error) {
            console.log("Get Documents Error : ",error);
        }
    }

    async getArticleByUserId(userId: string) {
        try {
            const response = await this.databases.listDocuments(conf.database_id, conf.collection_articles, [Query.equal('userId', userId)]);
            return response;
        } catch (error) {
            console.log("Get Documents Error : ",error);
        }
    }

    async getArticleById(articleId: string) {
        try {
            const response = await this.databases.getDocument(conf.database_id, conf.collection_articles, articleId);
            return response;
        } catch (error) {
            console.log("Get Document Error : ",error);
        }
    }

    async getArticleBySlug(slug: string) {
        try {
            const response = await this.databases.listDocuments(conf.database_id, conf.collection_articles, [Query.equal('slug', slug)]);
            return response;
        } catch (error) {
            console.log("Get Documents Error : ",error);
        }
    }

    async updateArticle(articleId: string, data: Article) {
        try {
            const articleUpdate = {
                userId: data.userId,
                title: data.title,
                slug: data.slug,
                content: data.content,
                featured_image: data.featured_image
            }
            const response = await this.databases.updateDocument(conf.database_id, conf.collection_articles, articleId, articleUpdate);
            return response;
        } catch (error) {
            console.log("Update Document Error : ",error);
        }
    }

    async deleteArticle(articleId: string) {
        try {
            const response = await this.databases.deleteDocument(conf.database_id, conf.collection_articles, articleId);
            return response;
        } catch (error) {
            console.log("Delete Document Error : ",error);
        }
    }

    async uploadImage(file: File) {
        try {
            const response = await this.storage.createFile(conf.bucket_id, ID.unique(), file);
            return response;
        } catch (error) {
            console.log("Upload Image Error : ",error);
        }
    }

    async getImageUrl(fileId: string) {
        try {
            const response = await this.storage.getFileView(conf.bucket_id, fileId);
            if (!response) {
                throw new Error("Image not found");
            }
            return response;
        } catch (error) {
            console.log("Get Image Preview Error : ",error);
        }
    }

    async getImage(fileId: string) {
        try {
            const response = await this.storage.getFile(conf.bucket_id, fileId);
            return response;
        } catch (error) {
            console.log("Get Image Error : ",error);
        }
    }

    async deleteImage(fileId: string) {
        try {
            const response = await this.storage.deleteFile(conf.bucket_id, fileId);
            return response;
        } catch (error) {
            console.log("Delete Image Error : ",error);
        }
    }

    

}

const articleService = new ArticleService();
export default articleService;
