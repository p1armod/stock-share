const conf = {
    appwrite: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    project_id: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    database_id: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    collection_articles: String(import.meta.env.VITE_APPWRITE_COLLECTION_ARTICLES),
    collection_users: String(import.meta.env.VITE_APPWRITE_COLLECTION_USERS),
    bucket_id: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    alpha_vantage_api_key: String(import.meta.env.VITE_ALPHA_VANTAGE_API_KEY),
    bavest_api_key: String(import.meta.env.VITE_BAVEST_API_KEY),
    collection_watchlist: String(import.meta.env.VITE_APPWRITE_COLLECTION_WATCHLIST),
    tinymce_api_key: String(import.meta.env.VITE_TINY_MCE_API_KEY)
}

export default conf;