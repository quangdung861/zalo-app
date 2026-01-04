export default function RoomItemSkeleton() {
  return (
    <div className="flex items-center p-2 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}