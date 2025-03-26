const Loading = ({ text }: { text: string }) => {
    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-3 text-gray-500">{text}</p>
        </div>
    );
};

export default Loading;
