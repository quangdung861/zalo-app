export default function RoomItemSkeleton() {
  

  return (
    <>
      <style>
        {`
          .room-skeleton {
            display: flex;
            align-items: center;
            padding: 8px;
            animation: pulse 1.5s ease-in-out infinite;
          }

          .room-skeleton__avatar {
            width: 48px;
            height: 48px;
            background-color: #e0e0e0;
            border-radius: 50%;
            margin-right: 12px;
            flex-shrink: 0;
          }

          .room-skeleton__content {
            flex: 1;
          }

          .room-skeleton__line {
            height: 16px;
            background-color: #e0e0e0;
            border-radius: 4px;
          }

          .room-skeleton__line--title {
            width: 75%;
            margin-bottom: 8px;
          }

          .room-skeleton__line--sub {
            width: 50%;
            background-color: #ededed;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <div className="room-skeleton">
        <div className="room-skeleton__avatar" />
        <div className="room-skeleton__content">
          <div className="room-skeleton__line room-skeleton__line--title" />
          <div className="room-skeleton__line room-skeleton__line--sub" />
        </div>
      </div>
    </>
  );
}
