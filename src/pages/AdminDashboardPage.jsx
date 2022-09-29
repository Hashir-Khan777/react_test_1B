import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../authContext";
import MkdSDK from "../utils/MkdSDK";

const page = 1;
const AdminDashboardPage = () => {
  const [videos, setVideos] = useState(null);

  const { dispatch } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const sdk = new MkdSDK();

  useEffect(() => {
    sdk.setTable("video");
    sdk._method = "PAGINATE";
    sdk.callRestAPI({ page, limit: 10 }, "PAGINATE").then((data) => {
      setVideos(data);
    });
  }, []);

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="w-full h-screen text-white px-28 py-11 bg-zinc-900">
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
      <div className="mt-32">
        <div className="flex justify-between items-center">
          <div>
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
        <table className="table-auto mt-9 w-full">
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-left">Title</th>
              <th className="text-left">Author</th>
              <th className="text-left">Most Liked</th>
            </tr>
          </thead>
          <tbody>
            {videos &&
              videos.list.map((video) => (
                <tr key={video.id}>
                  <td>{video.id < 10 ? `0${video.id}` : video.id}</td>
                  <td>{video.title}</td>
                  <td>{video.username}</td>
                  <td>{video.like}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
