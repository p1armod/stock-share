import type { WatchList } from "../types/WatchList";

const WatchListCard = ({watchList}: {watchList: WatchList}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold">{watchList.title}</h2>
            <p>{watchList.stocks.length} stocks</p>
            <div>
                {watchList.stocks.map((stock) => (
                    <p key={stock}>{stock}</p>
                ))}
            </div>
        </div>
    );
};

export default WatchListCard;
