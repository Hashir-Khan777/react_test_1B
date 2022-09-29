import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../authContext";
import MkdSDK from "../utils/MkdSDK";
import { useDrag, useDrop } from "react-dnd";

const Draggable = ({ video, index, moveVideos }) => {
  const ref = useRef(null);

  const [, drag] = useDrag(() => ({
    type: "row",
    item: { ...video, index },
  }));

  const [, drop] = useDrop(() => ({
    accept: "row",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveVideos(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  }));

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="flex items-center border border-zinc-700 my-2 rounded-lg py-10 px-6"
    >
      <div style={{ flex: 0.1 }} className="text-left">
        <p className="w-20 text-zinc-700">{video.id}</p>
      </div>
      <div style={{ flex: 1.05 }} className="flex text-left items-center">
        <img src={video.photo} className="w-20 h-full rounded-lg mr-1" alt="" />
        <p className="text-zinc-700">{video.title}</p>
      </div>
      <div
        style={{ flex: 0.25 }}
        className="flex items-center text-zinc-700 text-left"
      >
        <img src={video.photo} className="w-8 h-8 rounded-full mr-1" alt="" />
        <p className="w-20 text-zinc-600">{video.username}</p>
      </div>
      <div style={{ flex: 0.25 }} className="text-left">
        <p className="w-20 text-zinc-700">{video.like}</p>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [videos, setVideos] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { dispatch } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const sdk = new MkdSDK();

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/admin/login", { replace: true });
  };

  const moveVideos = (dragIndex, hoverIndex) => {
    videos.splice(hoverIndex, 0, videos.splice(dragIndex, 1)[0]);
    setVideos([...videos]);
  };

  useEffect(() => {
    sdk.setTable("video");
    sdk._method = "PAGINATE";
    sdk.callRestAPI({ page, limit: 10 }, "PAGINATE").then((data) => {
      setPage(data.page);
      setVideos(data.list);
      setTotalPages(data.num_pages);
    });
  }, [page]);

  return (
    <>
      {videos ? (
        <div className="w-full h-full text-white px-28 py-11 bg-zinc-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-4xl font-black">App</p>
            </div>
            <div>
              <button
                onClick={logOut}
                className="flex justify-between items-center bg-lime-500 py-3 px-6 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_1755_592)">
                    <path
                      d="M5 20C5 17.544 6.991 15.553 9.447 15.553H14.553C17.009 15.553 19 17.544 19 20"
                      stroke="#696969"
                      stroke-width="1.4824"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.0052 5.2448C16.6649 6.90453 16.6649 9.59548 15.0052 11.2552C13.3455 12.9149 10.6545 12.9149 8.9948 11.2552C7.33507 9.59548 7.33507 6.90453 8.9948 5.2448C10.6545 3.58507 13.3455 3.58507 15.0052 5.2448"
                      stroke="#696969"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1755_592">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-gray-900 ml-1">Logout</p>
              </button>
            </div>
          </div>
          <div className="mt-24">
            <div className="desktop:flex justify-between items-center">
              <div className="sm:mb-3 desktop:mb-0">
                <p className="text-3xl font-thin">Today’s leaderboard</p>
              </div>
              <div className="flex justify-between items-center bg-zinc-800 px-6 py-4 rounded-xl">
                <p className="text-white mr-2">30 May 2022</p>
                <div className="w-1 h-1 rounded-full bg-zinc-400"></div>
                <p className="bg-lime-500 text-black mx-4 px-2 py-1 rounded-lg">
                  Submissions OPEN
                </p>
                <div className="w-1 h-1 rounded-full bg-zinc-400"></div>
                <p className="text-white ml-2">11:34</p>
              </div>
            </div>
            {/* Table */}
            <div className="w-full table-auto mt-9 overflow-x-auto">
              <div>
                <div className="flex items-center px-6">
                  <div style={{ flex: 0.1 }} className="text-left">
                    <p className="w-20 text-zinc-700">#</p>
                  </div>
                  <div style={{ flex: 1 }} className="text-zinc-700 text-left">
                    <p>Title</p>
                  </div>
                  <div style={{ flex: 0.25 }} className="text-left">
                    <p className="w-20 text-zinc-700">Author</p>
                  </div>
                  <div style={{ flex: 0.25 }} className="w-20 text-left">
                    <p className="w-20 text-zinc-700">Most Liked</p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                {videos &&
                  videos.map((video, index) => (
                    <Draggable
                      moveVideos={moveVideos}
                      key={video.id}
                      index={index}
                      video={video}
                    />
                  ))}
              </div>
            </div>

            {/* Table */}
            <div className="flex justify-between items-center">
              {page > 1 ? (
                <button
                  onClick={() => setPage(page - 1)}
                  className="flex justify-between items-center bg-lime-500 py-3 px-6 rounded-full"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="flex justify-between items-center bg-lime-500 py-3 px-6 rounded-full"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen text-white px-28 py-11 bg-zinc-900">
          <p className="text-xl">Loading...</p>
        </div>
      )}
    </>
  );
};

export default AdminDashboardPage;
