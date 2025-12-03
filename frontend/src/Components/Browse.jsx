import "../Css/browse.css";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LeftPanel from "./LeftPanel";
import Navbar from "./Navbar";
import "../Css/theme.css";
import { useSelector } from "react-redux";
import { RandomAvatar } from "react-random-avatars";

function Browse() {
  const isProduction = window.location.hostname !== 'localhost';
  const backendURL = isProduction ? "" : "http://localhost:3000";
  const bunnyVideosEndpoint = isProduction ? "/.netlify/functions/bunny-videos" : "/bunny-videos";
  const [VideoData, setVideoData] = useState([]);
  const [TagsSelected, setTagsSelected] = useState("All");
  const [FilteredVideos, setFilteredVideos] = useState([]);
  const [menuClicked, setMenuClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Tags = [
    "All",
    "Artificial Intelligence",
    "Comedy",
    "Gaming",
    "Vlog",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
  ];

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch(`${backendURL}${bunnyVideosEndpoint}`);
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          const formattedVideos = data.items.map(video => ({
            _id: video.guid,
            thumbnailURL: video.thumbnailUrl,
            videoLength: video.length,
            Title: video.title,
            uploader: video.channelName || "Bunny Videos",
            views: video.views || 0,
            uploaded_date: video.dateUploaded,
            visibility: "Public",
          }));
          setVideoData(formattedVideos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVideos();
  }, []);

  useEffect(() => {
    if (TagsSelected !== "All") {
      const tagsSelectedLower = TagsSelected.toLowerCase();
      const filteredVideos = VideoData.flatMap((item) =>
        item.Tags.map(tag => tag.toLowerCase()).includes(tagsSelectedLower) ||
        item.Title.toLowerCase().includes(tagsSelectedLower) ? item : []
      );
      setFilteredVideos(filteredVideos);
    } else {
      setFilteredVideos([]);
    }
  }, [TagsSelected, VideoData]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3600);
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  // Removed updateViews function, as it is no longer needed.

  return (
    <>
      <Navbar />
      <LeftPanel />
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className={theme ? "browse" : "browse light-mode"}
          style={loading === true ? { display: "flex" } : { display: "none" }}
        >
          <div
            className={
              menuClicked === true
                ? `browse-data ${theme ? "" : "light-mode"}`
                : `browse-data2 ${theme ? "" : "light-mode"}`
            }
            style={menuClicked === false ? { left: "74px" } : { left: "250px" }}
          >
            <div
              className={
                theme ? "popular-categories" : "popular-categories light-mode"
              }
              style={{
                left: menuClicked ? "250px" : "74px",
                width: menuClicked ? "calc(100% - 250px)" : "calc(100% - 74px)",
              }}
            >
              {Tags.map((element, index) => {
                return (
                  <div
                    className={
                      TagsSelected === element
                        ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                        : `top-tags ${theme ? "" : "tagcolor-newlight"}`
                    }
                    key={index}
                  >
                    <p
                      onClick={() => {
                        setTagsSelected(`${element}`);
                      }}
                    >
                      {element}
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              className="video-section"
              style={{
                marginLeft: menuClicked ? "40px" : "40px",
              }}
            >
              <div className="uploaded-videos">
                {Array.from({ length: 16 }).map((_, index) => (
                  <>
                    <div className="video-data">
                      <Skeleton
                        key={index}
                        count={1}
                        width={330}
                        height={186}
                        style={{ borderRadius: "12px" }}
                        className="sk-browse-vid"
                      />
                      <div className="channel-basic-data">
                        <Skeleton
                          key={index}
                          count={1}
                          width={40}
                          height={40}
                          style={{ borderRadius: "100%", marginTop: "40px" }}
                          className="sk-browse-profile"
                        />
                        <Skeleton
                          key={index}
                          count={2}
                          width={250}
                          height={15}
                          style={{
                            position: "relative",
                            top: "40px",
                            left: "15px",
                          }}
                          className="sk-browse-title"
                        />
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
      <div
        className={theme ? "browse" : "browse light-mode"}
        style={
          loading === true
            ? { visibility: "hidden", display: "none" }
            : { visibility: "visible", display: "flex" }
        }
      >
        <div
          className={
            menuClicked === true
              ? `browse-data ${theme ? "" : "light-mode"}`
              : `browse-data2 ${theme ? "" : "light-mode"}`
          }
          style={menuClicked === false ? { left: "74px " } : { left: "250px " }}
        >
          <div
            className={
              theme ? "popular-categories" : "popular-categories light-mode"
            }
            style={{
              left: menuClicked ? "250px" : "74px",
              width: menuClicked ? "calc(100% - 250px)" : "calc(100% - 74px)",
            }}
          >
            {Tags.map((element, index) => {
              return (
                <div
                  className={
                    TagsSelected === element
                      ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                      : `top-tags ${theme ? "" : "tagcolor-newlight"}`
                  }
                  key={index}
                >
                  <p
                    onClick={() => {
                      setTagsSelected(`${element}`);
                    }}
                  >
                    {element}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="video-section"
            style={{
              marginLeft: menuClicked ? "40px" : "40px",
            }}
          >
            <div
              className="uploaded-videos"
              style={
                menuClicked === true
                  ? {
                      paddingRight: "50px",
                      display: TagsSelected === "All" ? "grid" : "none",
                    }
                  : {
                      paddingRight: "0px",
                      display: TagsSelected === "All" ? "grid" : "none",
                    }
              }
            >
              {VideoData &&
                VideoData.length > 0 &&
                VideoData.map((element, index) => {
                  return (
                    <div
                      className="video-data"
                      key={index}
                      style={
                        element.visibility === "Public"
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => {
                        window.location.href = `/video/${element._id}`;
                      }}
                    >
                      <img
                        style={{ width: "330px", borderRadius: "10px" }}
                        src={element.thumbnailURL}
                        alt="thumbnails"
                        className="browse-thumbnails"
                      />
                      <p className="duration">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>

                      <div
                        className={
                          theme === true
                            ? "channel-basic-data"
                            : "channel-basic-data text-light-mode"
                        }
                      >
                        <div className="channel-pic">
                          <RandomAvatar
                            name={element._id || element.Title}
                            size={40}
                          />
                        </div>
                        <div className="channel-text-data">
                          <p className="title" style={{ marginTop: "10px" }}>
                            {element.Title && element.Title.length <= 60
                              ? element.Title
                              : `${element.Title.slice(0, 55)}..`}
                          </p>
                          <div className="video-uploader">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title={element.uploader}
                              placement="top"
                            >
                              <p
                                className={
                                  theme
                                    ? "uploader"
                                    : "uploader text-light-mode2"
                                }
                                style={{ marginTop: "10px" }}
                              >
                                {element.uploader}
                              </p>
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Verified"
                              placement="right"
                            >
                              <CheckCircleIcon
                                fontSize="100px"
                                style={{
                                  color: "rgb(138, 138, 138)",
                                  marginTop: "8px",
                                  marginLeft: "4px",
                                }}
                              />
                            </Tooltip>
                          </div>
                          <div
                            className={
                              theme ? "view-time" : "view-time text-light-mode2"
                            }
                          >
                            <p className="views">
                              {element.views >= 1e9
                                ? `${(element.views / 1e9).toFixed(1)}B`
                                : element.views >= 1e6
                                ? `${(element.views / 1e6).toFixed(1)}M`
                                : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                              views
                            </p>
                            <p
                              className="upload-time"
                              style={{ marginLeft: "4px" }}
                            >
                              &#x2022;{" "}
                              {(() => {
                                const timeDifference =
                                  new Date() - new Date(element.uploaded_date);
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
                                const weeks = Math.floor(
                                  timeDifference / 604800000
                                );
                                const years = Math.floor(
                                  timeDifference / 31536000000
                                );

                                if (minutes < 1) {
                                  return "just now";
                                } else if (minutes < 60) {
                                  return `${minutes} mins ago`;
                                } else if (hours < 24) {
                                  return `${hours} hours ago`;
                                } else if (days < 7) {
                                  return `${days} days ago`;
                                } else if (weeks < 52) {
                                  return `${weeks} weeks ago`;
                                } else {
                                  return `${years} years ago`;
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div
              className="uploaded-videos2"
              style={
                menuClicked === true
                  ? {
                      paddingRight: "50px",
                      display: TagsSelected !== "All" ? "grid" : "none",
                    }
                  : {
                      paddingRight: "0px",
                      display: TagsSelected !== "All" ? "grid" : "none",
                    }
              }
            >
              {FilteredVideos &&
                FilteredVideos.map((element, index) => {
                  return (
                    <div
                      className="video-data"
                      key={index}
                      onClick={() => {
                        window.location.href = `/video/${element._id}`;
                      }}
                    >
                      <img
                        style={{ width: "330px", borderRadius: "10px" }}
                        src={element.thumbnailURL}
                        alt="thumbnails"
                        className="browse-thumbnails"
                      />
                      <p className="duration">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>

                      <div
                        className={
                          theme === true
                            ? "channel-basic-data"
                            : "channel-basic-data text-light-mode"
                        }
                      >
                        <div className="channel-pic">
                          <RandomAvatar
                            name={element._id || element.Title}
                            size={40}
                          />
                        </div>
                        <div className="channel-text-data">
                          <p className="title" style={{ marginTop: "10px" }}>
                            {element.Title}
                          </p>
                          <div className="video-uploader">
                            <p
                              className={
                                theme ? "uploader" : "uploader text-light-mode2"
                              }
                              style={{ marginTop: "10px" }}
                            >
                              {element.uploader}
                            </p>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Verified"
                              placement="right"
                            >
                              <CheckCircleIcon
                                fontSize="100px"
                                style={{
                                  color: "rgb(138, 138, 138)",
                                  marginTop: "8px",
                                  marginLeft: "4px",
                                }}
                              />
                            </Tooltip>
                          </div>
                          <div
                            className={
                              theme ? "view-time" : "view-time text-light-mode2"
                            }
                          >
                            <p className="views">
                              {element.views >= 1e9
                                ? `${(element.views / 1e9).toFixed(1)}B`
                                : element.views >= 1e6
                                ? `${(element.views / 1e6).toFixed(1)}M`
                                : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                              views
                            </p>
                            <p
                              className="upload-time"
                              style={{ marginLeft: "4px" }}
                            >
                              &#x2022;{" "}
                              {(() => {
                                const timeDifference =
                                  new Date() - new Date(element.uploaded_date);
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
                                const weeks = Math.floor(
                                  timeDifference / 604800000
                                );
                                const years = Math.floor(
                                  timeDifference / 31536000000
                                );

                                if (minutes < 1) {
                                  return "just now";
                                } else if (minutes < 60) {
                                  return `${minutes} mins ago`;
                                } else if (hours < 24) {
                                  return `${hours} hours ago`;
                                } else if (days < 7) {
                                  return `${days} days ago`;
                                } else if (weeks < 52) {
                                  return `${weeks} weeks ago`;
                                } else {
                                  return `${years} years ago`;
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Browse;
