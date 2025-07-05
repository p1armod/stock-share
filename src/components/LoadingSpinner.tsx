


interface LoadingSpinnerProps {
    message?: string;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
    small: 'h-6 w-6 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-t-2 border-b-2',
};

const LoadingSpinner = ({ 
    message, 
    className = '',
    size = 'large'
}: LoadingSpinnerProps) => {
    return (
        <div className={`flex ${!message ? 'items-center' : 'flex-col items-center justify-center'} ${className}`}>
            <div className="flex items-center">
                <div className={`animate-spin rounded-full border-blue-500 ${sizeMap[size]}`}></div>
                {message && <p className="text-lg font-medium text-gray-700 ml-3">{message}...</p>}
            </div>
            {message && size === 'large' && (
                <p className="mt-4 text-sm text-gray-500">Please wait while we load your content</p>
            )}
        </div>
    );
}

export default LoadingSpinner;